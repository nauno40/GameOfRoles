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
    renderResumeBanner();
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
    renderResumeBanner();

    if (!player || typeof player.loadVideoById !== "function") {
      pendingLoad = { episode: ep, startSeconds: start };
      return;
    }
    player.loadVideoById({ videoId: ep.id, startSeconds: start });
  }

  // ---------- Rendering ----------

  function renderHeaderStats() {
    // Les hors-séries ne comptent pas dans la progression : ce ne sont pas
    // des épisodes de la trame principale.
    const tracked = GOR_EPISODES.filter((ep) => !ep.bonus);
    const total = tracked.length;
    const done = tracked.filter((ep) => getStatus(ep) === "done").length;
    document.getElementById("header-stats").textContent = `${done} / ${total} terminés`;
    document.getElementById("header-progress-fill").style.width = `${(done / total) * 100}%`;
  }

  function renderResumeBanner() {
    const banner = document.getElementById("resume-banner");
    const ep = findResumeEpisode();
    // Inutile de proposer de "reprendre" l'épisode déjà chargé dans le lecteur.
    if (!ep || (currentEpisode && ep.id === currentEpisode.id)) {
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
      const isBonus = eps[0].bonus === true;

      const groupEl = document.createElement("details");
      groupEl.className = "arc-group" + (isBonus ? " arc-group--bonus" : "");
      groupEl.open = expandedArcs.has(arc);
      groupEl.addEventListener("toggle", () => {
        if (groupEl.open) expandedArcs.add(arc);
        else expandedArcs.delete(arc);
      });

      const summaryEl = document.createElement("summary");
      const titleEl = document.createElement("span");
      titleEl.className = "arc-title";
      // Non-breaking hyphen: avoids an ugly mid-word line break (e.g. "Hors-série").
      titleEl.textContent = arc.replace(/-/g, "‑");
      if (isBonus) {
        const subtitle = document.createElement("span");
        subtitle.className = "arc-subtitle";
        subtitle.textContent = "crossovers, spéciaux & récaps — hors trame principale";
        titleEl.appendChild(subtitle);
      }
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

  // ---------- Mise à jour (app Android uniquement) ----------

  const RELEASES_API = "https://api.github.com/repos/nauno40/GameOfRoles/releases/latest";
  const UPDATE_KEY = "gor:update:v1";
  const CHECK_INTERVAL_MS = 30 * 24 * 3600 * 1000; // vérification automatique : une fois par mois
  const android = window.GORAndroid;
  let pendingUpdate = null;

  function loadUpdateState() {
    try {
      return JSON.parse(localStorage.getItem(UPDATE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveUpdateState(state) {
    try {
      localStorage.setItem(UPDATE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }

  function isNewer(remote, local) {
    const a = remote.replace(/^v/, "").split(".").map(Number);
    const b = local.replace(/^v/, "").split(".").map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const x = a[i] || 0;
      const y = b[i] || 0;
      if (x !== y) return x > y;
    }
    return false;
  }

  function formatDate(ts) {
    return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  }

  function refreshUpdateStatus() {
    const state = loadUpdateState();
    const version = `v${android.getVersion()}`;
    const status = document.getElementById("update-status");
    status.textContent = pendingUpdate
      ? `${version} · ${pendingUpdate.tag} disponible`
      : state.lastCheck
        ? `${version} · vérifié le ${formatDate(state.lastCheck)}`
        : version;
  }

  function showUpdateBanner() {
    document.getElementById("update-banner-text").textContent =
      `Nouvelle version ${pendingUpdate.tag} disponible (actuelle : v${android.getVersion()})`;
    document.getElementById("update-banner").hidden = false;
  }

  async function checkForUpdate(manual) {
    const btn = document.getElementById("update-btn");
    if (manual) {
      btn.disabled = true;
      document.getElementById("update-status").textContent = "Vérification…";
    }
    try {
      const res = await fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" } });
      if (!res.ok) throw new Error(res.status);
      const rel = await res.json();
      const asset = (rel.assets || []).find((a) => a.name.endsWith(".apk"));
      const state = loadUpdateState();
      state.lastCheck = Date.now();
      if (asset && isNewer(rel.tag_name, android.getVersion())) {
        if (state.tag !== rel.tag_name || manual) state.dismissed = false;
        state.tag = rel.tag_name;
        state.url = asset.browser_download_url;
        pendingUpdate = { tag: state.tag, url: state.url };
        if (!state.dismissed) showUpdateBanner();
      } else {
        pendingUpdate = null;
        delete state.tag;
        delete state.url;
        delete state.dismissed;
        if (manual) document.getElementById("update-banner").hidden = true;
      }
      saveUpdateState(state);
      refreshUpdateStatus();
      if (manual && !pendingUpdate) {
        document.getElementById("update-status").textContent = `À jour (v${android.getVersion()})`;
      }
    } catch (e) {
      // Pas de connexion : on ne note pas la vérification, elle sera retentée au prochain lancement.
      if (manual) document.getElementById("update-status").textContent = "Impossible de vérifier (connexion ?)";
    } finally {
      btn.disabled = false;
    }
  }

  function startUpdate() {
    if (!pendingUpdate) return checkForUpdate(true);
    android.downloadUpdate(pendingUpdate.url, pendingUpdate.tag);
    document.getElementById("update-banner").hidden = true;
    document.getElementById("update-status").textContent = "Téléchargement… l'installation s'ouvrira ensuite";
  }

  function dismissUpdate() {
    const state = loadUpdateState();
    state.dismissed = true;
    saveUpdateState(state);
    document.getElementById("update-banner").hidden = true;
  }

  function initUpdater() {
    if (!android) return;
    const btn = document.getElementById("update-btn");
    btn.hidden = false;
    btn.addEventListener("click", startUpdate);
    document.getElementById("update-banner-btn").addEventListener("click", startUpdate);
    document.getElementById("update-banner-dismiss").addEventListener("click", dismissUpdate);

    // Une mise à jour déjà repérée reste signalée tant qu'elle n'est pas installée.
    const state = loadUpdateState();
    if (state.tag && state.url && isNewer(state.tag, android.getVersion())) {
      pendingUpdate = { tag: state.tag, url: state.url };
      if (!state.dismissed) showUpdateBanner();
    } else if (state.tag) {
      delete state.tag;
      delete state.url;
      delete state.dismissed;
      saveUpdateState(state);
    }
    refreshUpdateStatus();

    if (!state.lastCheck || Date.now() - state.lastCheck > CHECK_INTERVAL_MS) {
      checkForUpdate(false);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    init();
    initUpdater();
  });

  if ("serviceWorker" in navigator && !navigator.userAgent.includes("GORApp")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {
        /* pas grave, l'app marche très bien sans */
      });
    });
  }
})();
