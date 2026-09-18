(function () {
  "use strict";

  const STORAGE_KEY = "gor:progress:v1";
  const SELECTED_KEY = "gor:selected:v1";
  const SAVE_INTERVAL_MS = 5000;
  const COMPLETE_THRESHOLD = 0.95;
  const MIN_PROGRESS_SECONDS = 10; // ignore blips below this to count as "started"

  // ---------- Storage ----------

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn("Progression illisible, réinitialisation.", e);
      return {};
    }
  }

  function saveProgressStore(store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      console.warn("Impossible de sauvegarder la progression.", e);
    }
  }

  let progress = loadProgress();

  function updateEpisodeProgress(videoId, time, duration) {
    const existing = progress[videoId] || {};
    const completed =
      existing.completed ||
      (duration > 0 && time / duration >= COMPLETE_THRESHOLD);
    progress[videoId] = {
      time: completed ? existing.time || time : time,
      duration: duration || existing.duration || 0,
      completed,
      updatedAt: Date.now(),
    };
    saveProgressStore(progress);
    renderEpisodeList();
    renderHeaderStats();
  }

  function markCompleted(videoId) {
    setEpisodeDone(videoId, true);
  }

  // Manual toggle, independent of actual playback — for marking episodes
  // already seen elsewhere (e.g. before this tool existed).
  function setEpisodeDone(videoId, done) {
    if (done) {
      const existing = progress[videoId] || {};
      progress[videoId] = { ...existing, completed: true, updatedAt: Date.now() };
    } else {
      delete progress[videoId];
    }
    saveProgressStore(progress);
    renderEpisodeList();
    renderHeaderStats();
    renderResumeBanner();
  }

  function setArcDone(arc, done) {
    for (const ep of GOR_EPISODES) {
      if (ep.arc !== arc) continue;
      if (done) {
        const existing = progress[ep.id] || {};
        progress[ep.id] = { ...existing, completed: true, updatedAt: Date.now() };
      } else {
        delete progress[ep.id];
      }
    }
    saveProgressStore(progress);
    renderEpisodeList();
    renderHeaderStats();
    renderResumeBanner();
  }

  function getStatus(ep) {
    const p = progress[ep.id];
    if (!p) return "todo";
    if (p.completed) return "done";
    if (p.time && p.time >= MIN_PROGRESS_SECONDS) return "in-progress";
    return "todo";
  }

  function getSelectedId() {
    return localStorage.getItem(SELECTED_KEY);
  }

  function setSelectedId(id) {
    try {
      localStorage.setItem(SELECTED_KEY, id);
    } catch (e) {
      /* ignore */
    }
  }

  function thumbUrl(id, quality) {
    return `https://i.ytimg.com/vi/${id}/${quality || "mqdefault"}.jpg`;
  }

  // ---------- Episode lookup ----------

  const episodesById = new Map(GOR_EPISODES.map((ep) => [ep.id, ep]));

  function findResumeEpisode() {
    let best = null;
    for (const ep of GOR_EPISODES) {
      const p = progress[ep.id];
      if (p && !p.completed && p.time >= MIN_PROGRESS_SECONDS) {
        if (!best || p.updatedAt > progress[best.id].updatedAt) {
          best = ep;
        }
      }
    }
    return best;
  }

  function formatTime(seconds) {
    seconds = Math.floor(seconds || 0);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
  }

  // ---------- Player ----------

  let player = null;
  let currentEpisode = null;
  let saveIntervalHandle = null;
  let pendingLoad = null; // { episode, startSeconds } if player not ready yet

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("player", {
      host: "https://www.youtube.com",
      playerVars: { rel: 0 },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  };

  function onPlayerReady() {
    if (pendingLoad) {
      const { episode, startSeconds } = pendingLoad;
      pendingLoad = null;
      loadEpisode(episode, startSeconds);
    }
  }

  function onPlayerStateChange(event) {
    if (!currentEpisode) return;
    if (event.data === YT.PlayerState.PLAYING) {
      startSaveInterval();
    } else if (
      event.data === YT.PlayerState.PAUSED ||
      event.data === YT.PlayerState.ENDED
    ) {
      stopSaveInterval();
      saveCurrentPlayerProgress();
      if (event.data === YT.PlayerState.ENDED) {
        markCompleted(currentEpisode.id);
      }
    }
  }

  function startSaveInterval() {
    stopSaveInterval();
    saveIntervalHandle = setInterval(saveCurrentPlayerProgress, SAVE_INTERVAL_MS);
  }

  function stopSaveInterval() {
    if (saveIntervalHandle) {
      clearInterval(saveIntervalHandle);
      saveIntervalHandle = null;
    }
  }

  function saveCurrentPlayerProgress() {
    if (!player || !currentEpisode || typeof player.getCurrentTime !== "function") return;
    const time = player.getCurrentTime();
    const duration = player.getDuration();
    if (!duration) return;
    updateEpisodeProgress(currentEpisode.id, time, duration);
  }

  function loadEpisode(ep, startSeconds) {
    currentEpisode = ep;
    setSelectedId(ep.id);
    expandedArcs.add(ep.arc);

    const saved = progress[ep.id];
    const start = startSeconds != null ? startSeconds : saved && !saved.completed ? saved.time : 0;

    document.getElementById("now-playing").hidden = false;
    document.getElementById("now-playing-code").textContent = ep.code;
    document.getElementById("now-playing-title").textContent = ep.title;
    document.getElementById("now-playing-arc").textContent = ep.arc;
    renderEpisodeList();

    if (!player || typeof player.loadVideoById !== "function") {
      pendingLoad = { episode: ep, startSeconds: start };
      return;
    }
    player.loadVideoById({ videoId: ep.id, startSeconds: start });
  }

  // ---------- Rendering ----------

  function renderHeaderStats() {
    const total = GOR_EPISODES.length;
    const done = GOR_EPISODES.filter((ep) => getStatus(ep) === "done").length;
    document.getElementById("header-stats").textContent = `${done} / ${total} terminés`;
    document.getElementById("header-progress-fill").style.width = `${(done / total) * 100}%`;
  }

  function renderResumeBanner() {
    const banner = document.getElementById("resume-banner");
    const ep = findResumeEpisode();
    if (!ep) {
      banner.hidden = true;
      return;
    }
    const p = progress[ep.id];
    banner.hidden = false;
    document.getElementById("resume-thumb").src = thumbUrl(ep.id, "hqdefault");
    document.getElementById("resume-title").textContent = `${ep.code} — ${ep.title}`;
    document.getElementById("resume-arc").textContent = ep.arc;
    document.getElementById("resume-time").textContent = `à ${formatTime(p.time)}`;
    document.getElementById("resume-btn").onclick = () => {
      loadEpisode(ep, p.time);
      document.getElementById("player-wrap").scrollIntoView({ behavior: "smooth", block: "start" });
    };
  }

  let activeFilter = "all";
  const expandedArcs = new Set();

  function matchesFilter(ep) {
    if (activeFilter === "all") return true;
    return getStatus(ep) === activeFilter;
  }

  function renderEpisodeList() {
    const container = document.getElementById("episode-list");
    container.innerHTML = "";

    const groups = new Map();
    for (const ep of GOR_EPISODES) {
      if (!matchesFilter(ep)) continue;
      if (!groups.has(ep.arc)) groups.set(ep.arc, []);
      groups.get(ep.arc).push(ep);
    }

    if (groups.size === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "Aucun épisode dans cette catégorie.";
      container.appendChild(empty);
      return;
    }

    for (const [arc, eps] of groups) {
      const groupEl = document.createElement("details");
      groupEl.className = "arc-group";
      groupEl.open = expandedArcs.has(arc);
      groupEl.addEventListener("toggle", () => {
        if (groupEl.open) expandedArcs.add(arc);
        else expandedArcs.delete(arc);
      });

      const summaryEl = document.createElement("summary");
      const titleEl = document.createElement("span");
      titleEl.className = "arc-title";
      titleEl.textContent = arc;
      const countEl = document.createElement("span");
      countEl.className = "arc-count";
      const doneCount = eps.filter((ep) => getStatus(ep) === "done").length;
      countEl.textContent = `${doneCount}/${eps.length}`;

      const allDone = doneCount === eps.length;
      const bulkBtn = document.createElement("button");
      bulkBtn.type = "button";
      bulkBtn.className = "arc-bulk-btn";
      bulkBtn.textContent = allDone ? "Tout démarquer" : "Tout marquer vu";
      bulkBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setArcDone(arc, !allDone);
      };

      const chevron = document.createElement("span");
      chevron.className = "arc-chevron";
      chevron.textContent = "▸";
      summaryEl.appendChild(titleEl);
      summaryEl.appendChild(countEl);
      summaryEl.appendChild(bulkBtn);
      summaryEl.appendChild(chevron);
      groupEl.appendChild(summaryEl);

      for (const ep of eps) {
        groupEl.appendChild(renderEpisodeRow(ep));
      }

      container.appendChild(groupEl);
    }
  }

  function renderEpisodeRow(ep) {
    const status = getStatus(ep);
    const p = progress[ep.id];

    const row = document.createElement("div");
    row.className = "episode-row" + (currentEpisode && currentEpisode.id === ep.id ? " active" : "");
    row.onclick = () => loadEpisode(ep);

    const thumbWrap = document.createElement("div");
    thumbWrap.className = "ep-thumb-wrap";

    const img = document.createElement("img");
    img.className = "ep-thumb";
    img.loading = "lazy";
    img.alt = "";
    img.src = thumbUrl(ep.id);
    thumbWrap.appendChild(img);

    if (status === "done") {
      const check = document.createElement("div");
      check.className = "ep-badge-check";
      check.textContent = "✓";
      thumbWrap.appendChild(check);
    }

    if (p && p.duration) {
      const dur = document.createElement("div");
      dur.className = "ep-duration";
      dur.textContent = formatTime(p.duration);
      thumbWrap.appendChild(dur);
    }

    if (status === "in-progress" && p && p.duration) {
      const bar = document.createElement("div");
      bar.className = "ep-progress-overlay";
      const fill = document.createElement("div");
      fill.className = "ep-progress-fill";
      fill.style.width = Math.min(100, (p.time / p.duration) * 100) + "%";
      bar.appendChild(fill);
      thumbWrap.appendChild(bar);
    }

    row.appendChild(thumbWrap);

    const main = document.createElement("div");
    main.className = "ep-main";

    const codeEl = document.createElement("div");
    codeEl.className = "ep-code";
    codeEl.textContent = ep.code;
    main.appendChild(codeEl);

    const titleEl = document.createElement("div");
    titleEl.className = "ep-title";
    titleEl.textContent = ep.title;
    titleEl.title = ep.title;
    main.appendChild(titleEl);

    row.appendChild(main);

    const checkBtn = document.createElement("button");
    checkBtn.type = "button";
    checkBtn.className = "ep-check-btn" + (status === "done" ? " checked" : "");
    checkBtn.title = status === "done" ? "Marquer non vu" : "Marquer comme vu";
    checkBtn.setAttribute("aria-label", checkBtn.title);
    checkBtn.textContent = "✓";
    checkBtn.onclick = (e) => {
      e.stopPropagation();
      setEpisodeDone(ep.id, status !== "done");
    };
    row.appendChild(checkBtn);

    return row;
  }

  function renderFilters() {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.filter;
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderEpisodeList();
      });
    });
  }

  function initResetButton() {
    document.getElementById("reset-progress-btn").addEventListener("click", () => {
      if (!confirm("Réinitialiser toute la progression de visionnage ? Cette action est irréversible.")) return;
      progress = {};
      saveProgressStore(progress);
      localStorage.removeItem(SELECTED_KEY);
      renderEpisodeList();
      renderHeaderStats();
      renderResumeBanner();
    });
  }

  // ---------- Init ----------

  function init() {
    renderHeaderStats();
    renderResumeBanner();
    renderFilters();
    initResetButton();

    const selectedId = getSelectedId();
    const initialEp = (selectedId && episodesById.get(selectedId)) || GOR_EPISODES[0];
    loadEpisode(initialEp);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
