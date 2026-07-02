window.ANALYTICS = (function () {

  const state = {
    tracks: {},
    shows: {},
    lastGoodSnapshot: null
  };

  function safeNumber(n, fallback = 0) {
    return Number.isFinite(n) ? n : fallback;
  }

  function normalizeTrack(id, data = {}) {
    const plays = safeNumber(data.plays);
    const completions = safeNumber(data.completions);
    const dropoffs = safeNumber(data.dropoffs);

    const completionRate = plays ? completions / plays : 0;
    const dropoffRate = plays ? dropoffs / plays : 0;

    return {
      plays,
      completions,
      dropoffs,
      completionRate: +completionRate.toFixed(2),
      dropoffRate: +dropoffRate.toFixed(2),
      score: safeNumber(data.score, Math.round(completionRate * 100))
    };
  }

  function normalizeShow(data = {}) {
    const plays = safeNumber(data.plays);
    const completions = safeNumber(data.completions);

    const completionRate = plays ? completions / plays : 0;

    return {
      plays,
      completions,
      completionRate: +completionRate.toFixed(2),
      score: safeNumber(data.score, Math.round(completionRate * 100))
    };
  }

  function ingest(raw = {}) {
    try {
      const tracks = raw.tracks || {};
      const shows = raw.shows || {};

      const cleanTracks = {};
      const cleanShows = {};

      Object.keys(tracks).forEach(id => {
        cleanTracks[id] = normalizeTrack(id, tracks[id]);
      });

      Object.keys(shows).forEach(id => {
        cleanShows[id] = normalizeShow(shows[id]);
      });

      state.tracks = cleanTracks;
      state.shows = cleanShows;
      state.lastGoodSnapshot = { tracks: cleanTracks, shows: cleanShows };

      return state.lastGoodSnapshot;

    } catch (err) {
      console.warn("Analytics recovery triggered:", err);

      // fallback = last known good state
      return state.lastGoodSnapshot || { tracks: {}, shows: {} };
    }
  }

  function getTopTracks(limit = 5) {
    return Object.entries(state.tracks)
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, limit);
  }

  function getHealthScore() {
    const tracks = Object.values(state.tracks);
    if (!tracks.length) return 100;

    const avg = tracks.reduce((s, t) => s + t.completionRate, 0) / tracks.length;
    return Math.round(avg * 100);
  }

  return {
    ingest,
    getTopTracks,
    getHealthScore,
    state
  };

})();
