window.STUDIO = (function () {

    const PLAYLIST_FILE = "cloudinary-to-playlist.json";

async function generate() {
    const playlist = await loadJSON(PLAYLIST_FILE, []);
    console.log(`[STUDIO] Queue generated: ${playlist.length} items`);
    return playlist;
}
        const res = await fetch(`${BASE}${file}`);
        if (!res.ok) throw new Error(`${file} failed: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn(`[STUDIO] Using fallback for ${file}`, err);
        return fallback;
    }
}
    async function generate() {
        const playlist = await loadJSON("cloudinary-to-playlist.json", []);
        console.log(`[STUDIO] Queue generated: ${playlist.length} items`);
        return playlist;
    }

    return { generate };
})();
