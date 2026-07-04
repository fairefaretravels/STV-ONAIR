window.STUDIO = (function () {
    // Safer relative base (works in most deployments)
    const BASE = "./data/";
    const PLAYLIST_SOURCES = [
        "./STUDIO/data/cloudinary-to-playlist.json",
        "playlist.json",
        "emergency-playlist.json"
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
                    console.log(`[STUDIO] ACTIVE SOURCE: ${file} (${data.length} items)`);
                    return data;
                }
                console.warn(`[STUDIO] Empty playlist: ${file}`);
            } catch (err) {
                console.warn(`[STUDIO] Failed source: ${file}`, err.message);
            }
        }
        return null;
    }
    async function generate() {
        const playlist = await trySources(PLAYLIST_SOURCES);
        if (!playlist) {
            // NOTE: previously this returned a fake "Emergency Broadcast
            // Loop" item pointing at ./media/emergency.mp4. That file
            // doesn't exist in this deployment, so MEDIA would fail to
            // load it, retry after 500ms, fail again, retry again —
            // forever. That fail/retry cycle was the visible flicker.
            // Returning an empty queue here instead means MEDIA.start()
            // just logs "EMPTY QUEUE" and stops cleanly — no fake item,
            // no retry loop, no flicker.
            console.error("[STUDIO] ALL SOURCES FAILED — NO EMERGENCY FALLBACK, QUEUE WILL BE EMPTY");
            activeSource = null;
            return [];
        }
        console.log(`[STUDIO] Queue ready from: ${activeSource}`);
        return playlist;
    }
    function getSource() {
        return activeSource;
    }
    return {
        generate,
        getSource
    };
})();
