window.STUDIO_METRICS = (function () {

  const KEY = "stv_metrics_v1";

  // Load from storage or rebuild clean
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return createEmpty();
      return JSON.parse(raw);
    } catch (e) {
      console.warn("[METRICS] Corrupt data reset");
      return createEmpty();
    }
  }

  function createEmpty() {
    return {
      tracks: {},
      shows: {},
      commercials: {},
      meta: {
        created: Date.now(),
        lastRepair: Date.now()
      }
    };
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  let state = load();

  function ensureBucket(type, id) {
    if (!state[type][id]) {
      state[type][id] = {
        plays: 0,
        completions: 0,
        dropoffs: 0,
        lastSeen: null
      };
    }
  }

  // Called whenever something plays
  function recordPlay(item) {
    const type = item.type || "tracks";
    const bucket = normalize(type);

    ensureBucket(bucket, item.id);

    state[bucket][item.id].plays++;
    state[bucket][item.id].lastSeen = Date.now();

    save(state);
  }

  // Called when playback finishes
  function recordComplete(item) {
    const bucket = normalize(item.type || "tracks");

    ensureBucket(bucket, item.id);

    state[bucket][item.id].completions++;
    save(state);
  }

  // Called when user skips
  function recordDropoff(item) {
    const bucket = normalize(item.type || "tracks");

    ensureBucket(bucket, item.id);

    state[bucket][item.id].dropoffs++;
    save(state);
  }

  function normalize(type) {
    if (type === "commercial") return "commercials";
    if (type === "show" || type === "show_episode") return "shows";
    return "tracks";
  }

  // Auto-repair missing structure
  function repair() {
    const fixed = createEmpty();

    for (const k in state.tracks || {}) {
      fixed.tracks[k] = state.tracks[k];
    }
    for (const k in state.shows || {}) {
      fixed.shows[k] = state.shows[k];
    }
    for (const k in state.commercials || {}) {
      fixed.commercials[k] = state.commercials[k];
    }

    fixed.meta.lastRepair = Date.now();
    state = fixed;
    save(state);
  }

  function get() {
    return state;
  }

  function compute() {
    const all = { ...state.tracks, ...state.shows, ...state.commercials };

    let plays = 0;
    let completions = 0;
    let dropoffs = 0;

    for (const id in all) {
      plays += all[id].plays || 0;
      completions += all[id].completions || 0;
      dropoffs += all[id].dropoffs || 0;
    }

    return {
      plays,
      completions,
      dropoffs,
      completionRate: plays ? completions / plays : 0
    };
  }

  return {
    recordPlay,
    recordComplete,
    recordDropoff,
    get,
    compute,
    repair
  };

})();
