/**
 * Export / import de la progression : format du fichier, validation, fusion.
 * Logique pure (pas de DOM) pour pouvoir la tester isolément.
 */
const GORProgressIO = {
  FORMAT: "game-of-roles-progress",

  build(progress, selectedId) {
    return JSON.stringify(
      {
        format: this.FORMAT,
        version: 1,
        exportedAt: new Date().toISOString(),
        selected: selectedId || null,
        progress,
      },
      null,
      2
    );
  },

  fileName(date = new Date()) {
    return `game-of-roles-progression-${date.toISOString().slice(0, 10)}.json`;
  },

  // Renvoie { progress, selected } ou lève une Error si le fichier n'est pas valide.
  parse(text) {
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Ce fichier n'est pas un JSON valide.");
    }
    if (!data || data.format !== this.FORMAT || typeof data.progress !== "object" || data.progress === null) {
      throw new Error("Ce fichier n'est pas une sauvegarde Game Of Roles.");
    }
    const num = (v) => (typeof v === "number" && isFinite(v) && v >= 0 ? v : 0);
    const progress = {};
    for (const [id, p] of Object.entries(data.progress)) {
      if (!p || typeof p !== "object") continue;
      progress[id] = {
        time: num(p.time),
        duration: num(p.duration),
        completed: p.completed === true,
        updatedAt: num(p.updatedAt),
      };
    }
    return { progress, selected: typeof data.selected === "string" ? data.selected : null };
  },

  // Fusion : un épisode terminé l'emporte ; sinon l'entrée la plus récente.
  merge(current, incoming) {
    const result = { ...current };
    for (const [id, b] of Object.entries(incoming)) {
      const a = result[id];
      if (!a) result[id] = b;
      else if (a.completed !== b.completed) result[id] = a.completed ? a : b;
      else if ((b.updatedAt || 0) > (a.updatedAt || 0)) result[id] = b;
    }
    return result;
  },

  summary(progress) {
    const entries = Object.values(progress);
    const done = entries.filter((p) => p.completed).length;
    return { done, inProgress: entries.filter((p) => !p.completed && p.time > 0).length };
  },
};
