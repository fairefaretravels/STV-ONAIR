window.STUDIO = (function () {
    // Base path for data files. Absolute so this resolves correctly no
    // matter which page includes studio.js. shows.json is the single
    // shared source used by /watch, /247, and this dashboard.
    const BASE = "/";
    const PLAYLIST_SOURCES = [
        "shows.json"
    ];
    let activeSource = null;

    async function loadJSON(file) {
        const res = await fetch(`${BASE}${file}`, { cache: "no-store" });
        if (!res.ok) {
            throw new Error(`${file} failed: ${res.status}`);
        }
        const text = await res.text();
        try {
            return JSON.parse(text);
        } catch (err) {
            throw new Error(`${file} invalid JSON`);
        }
    }

    async function trySources(files) {
        for (const file of files) {
            try {
                console.log(`[STUDIO] Trying: ${file}`);
                const data = await loadJSON(file);
                if (Array.isArray(data) && data.length > 0) {
                    activeSource = file;
                    console.log(`[STUDIO] ACTIVE SOURCE: ${file} (${data.length} entries)`);
                    return data;
                }
                console.warn(`[STUDIO] Empty playlist: ${file}`);
            } catch (err) {
                console.warn(`[STUDIO] Failed source: ${file}`, err.message);
            }
        }
        return null;
    }

    // =========================
    // FLATTEN
    // =========================
    // shows.json mixes two shapes:
    //   1) a flat show with its own "url" (plays directly)
    //   2) a series with an "episodes" array (no top-level "url") —
    //      each episode needs to become its own queue item so MEDIA
    //      can play them one at a time.
    // This walks the raw shows list and produces one flat array of
    // playable {title, artist, url, duration, type} items.
    function flatten(shows) {
        const queue = [];

        for (const show of shows) {
            if (Array.isArray(show.episodes) && show.episodes.length > 0) {
                for (const ep of show.episodes) {
                    if (!ep.url) continue;
                    queue.push({
                        title: ep.title || show.title,
                        artist: show.title,
                        cover: ep.cover || show.cover,
                        url: ep.url,
                        duration: ep.duration || 60,
                        type: show.type || "series"
                    });
                }
            } else if (show.url) {
                queue.push({
                    title: show.title,
                    artist: show.type || "",
                    cover: show.cover,
                    url: show.url,
                    duration: show.duration || 30,
                    type: show.type || "video"
                });
            }
        }

        return queue;
    }

    async function generate() {
        const shows = await trySources(PLAYLIST_SOURCES);

        if (!shows) {
            console.error("[STUDIO] shows.json failed to load — queue will be empty");
            activeSource = null;
            return [];
        }

        const queue = flatten(shows);

        if (!queue.length) {
            console.error("[STUDIO] shows.json loaded but produced no playable items");
        } else {
            console.log(`[STUDIO] Queue ready from: ${activeSource} (${queue.length} playable items)`);
        }

        return queue;
    }

    function getSource() {
        return activeSource;
    }

    return {
        generate,
        getSource
    };
})();
