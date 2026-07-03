window.STUDIO = (function () {

    const BASE = "./STUDIO/";

    async function loadJSON(file, fallback = []) {
        try {
            const res = await fetch(`${BASE}/data/${file}`);
            if (!res.ok) throw new Error(`${file} failed: ${res.status}`);
            return await res.json();
        } catch (err) {
            console.warn(`[STUDIO] Using fallback for ${file}`, err);
            return fallback;
        }
    }

    async function generate() {
        const playlist = await loadJSON("playlist.json", []);
        console.log(`[STUDIO] Queue generated: ${playlist.length} items`);
        return playlist;
    }

    return { generate };
})();
