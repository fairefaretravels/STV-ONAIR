window.STUDIO = (function () {

    // Safer relative base (works in most deployments)
    const BASE = "./data/";

    const PLAYLIST_SOURCES = [
        "./STUDIO/data/cloudinary-to-playlist.json"
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
            console.error("[STUDIO] ALL SOURCES FAILED → USING EMERGENCY LOOP");

            activeSource = "emergency-inline";

            return [
                {
                    title: "Emergency Broadcast Loop",
                    artist: "STV SYSTEM",
                    url: "./media/emergency.mp4",
                    type: "video"
                }
            ];
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
