window.STUDIO = (function () {
    // Root-relative so it always resolves to the real repo root,
    // regardless of whether /watch gets served as /watch or /watch/.
    // NOTE: must match the folder the scripts are actually served from
    // (watch.html loads them as /STUDIO/studio.js and /STUDIO/media.js).
    const BASE = "/STUDIO";

async function loadJSON(file, fallback = []) {
    try {
        const res = await fetch(`/data/${file}`);
        if (!res.ok) throw new Error(`${file} failed: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn(`[STUDIO] Using fallback for ${file}`, err);
        return fallback;
    }
}

    // Just load the flat, pre-ordered playlist and play it top to bottom, on loop.
    async function generate() {
        const playlist = await loadJSON("playlist.json", []);
        console.log(`[STUDIO] Queue generated: ${playlist.length} items`);
        return playlist;
    }

    return { generate };
})();
