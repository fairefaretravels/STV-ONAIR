window.STUDIO = (function () {

    const BASE = "/STUDIO/data/";

    // PRIMARY + FALLBACK CHAINS
    const PLAYLIST_SOURCES = [
        "cloudinary-to-playlist.json", // primary (Cloudinary-generated)
        "playlist.json",               // local backup
        "emergency-playlist.json"      // hard fallback (static safe loop)
    ];

    async function loadJSON(file) {
        const res = await fetch(`${BASE}${file}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`${file} failed: ${res.status}`);
        return await res.json();
    }

    async function trySources(files) {
        for (let file of files) {
            try {
                console.log(`[STUDIO] Trying playlist source: ${file}`);
                const data = await loadJSON(file);

                if (Array.isArray(data) && data.length > 0) {
                    console.log(`[STUDIO] SUCCESS: ${file} (${data.length} items)`);
                    return data;
                }

                console.warn(`[STUDIO] Empty playlist in ${file}`);
            } catch (err) {
                console.warn(`[STUDIO] FAILED: ${file}`, err.message);
            }
        }

        return null;
    }

    async function generate() {
        const playlist = await trySources(PLAYLIST_SOURCES);

        if (!playlist) {
            console.error("[STUDIO] ALL PLAYLIST SOURCES FAILED");

            // last-resort emergency inline playlist
            return [
                {
                    title: "Emergency Broadcast Loop",
                    url: "/STUDIO/media/emergency.mp4",
                    type: "video"
                }
            ];
        }

        console.log(`[STUDIO] Queue generated: ${playlist.length} items`);
        return playlist;
    }

    return { generate };

})();
