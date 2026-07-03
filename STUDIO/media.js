window.MEDIA = (function () {

    let queue = [];
    let index = 0;
    let isTransitioning = false;
    let advanceTimer = null;
    let stallTimer = null;

    const STALL_TIMEOUT_MS = 15000; // if a video never fires 'canplay', skip it after this long

    // ---------- SAFE DOM CACHE ----------
    const UI = {
        title: () => document.getElementById("title"),
        artist: () => document.getElementById("artist"),
        player: () => document.getElementById("player"),
        frame: () => document.getElementById("playerFrame"),
        npTitle: () => document.getElementById("npTitle"),
        npSub: () => document.getElementById("npSub"),
        ltHeadline: () => document.getElementById("ltHeadline"),
        ltSubheadline: () => document.getElementById("ltSubheadline"),
        tickerText: () => document.getElementById("tickerText"),
        banner: () => document.getElementById("nowPlayingBanner"),
        commercialOverlay: () => document.getElementById("commercialOverlay")
    };

    function setLoading(state, item) {
        const title = UI.title();
        if (!title) return;

        title.innerText = state
            ? "Loading Next Segment..."
            : (item?.title || item?.name || "Commercial Break");
    }

    function updateBroadcastUI(item) {
        const titleText = item?.title || item?.name || "Commercial Break";
        const subtitleText = item?.artist || item?.category || item?.type || "Live Programming";

        const npTitle = UI.npTitle();
        const npSub = UI.npSub();
        const ltHeadline = UI.ltHeadline();
        const ltSubheadline = UI.ltSubheadline();
        const tickerText = UI.tickerText();
        const banner = UI.banner();
        const commercialOverlay = UI.commercialOverlay();

        if (npTitle) npTitle.innerText = titleText;
        if (npSub) npSub.innerText = subtitleText;
        if (ltHeadline) ltHeadline.innerText = titleText;
        if (ltSubheadline) ltSubheadline.innerText = subtitleText;

        if (tickerText) {
            tickerText.innerText =
                `STV LIVE • NOW PLAYING: ${titleText} • ${subtitleText} • Imterviews • Entertainment • News • Weather • Community coverage • Stay tuned`;
        }

        if (banner) {
            banner.classList.remove("show");
            setTimeout(() => banner.classList.add("show"), 50);
            setTimeout(() => banner.classList.remove("show"), 5000);
        }

        if (commercialOverlay) {
            const isCommercial = (item?.type || "").toLowerCase() === "commercial";
            commercialOverlay.classList.toggle("show", isCommercial);
        }
    }

    function clearScheduledAdvance() {
        if (advanceTimer) {
            clearTimeout(advanceTimer);
            advanceTimer = null;
        }
    }

    function scheduleAdvance(seconds) {
        clearScheduledAdvance();
        advanceTimer = setTimeout(() => next(), (seconds || 30) * 1000);
    }

    function clearStallTimer() {
        if (stallTimer) {
            clearTimeout(stallTimer);
            stallTimer = null;
        }
    }

    function scheduleStallFallback(item) {
        clearStallTimer();
        stallTimer = setTimeout(() => {
            console.warn("STALLED — video never became playable, skipping:", item);
            next();
        }, STALL_TIMEOUT_MS);
    }

    function isDriveLink(src) {
        return typeof src === "string" && src.includes("drive.google.com");
    }

    function toDrivePreview(src) {
        const match =
            src.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
            src.match(/[?&]id=([a-zA-Z0-9_-]+)/);

        if (!match) return src;
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    function resetPlayerState(player, frame) {
        if (player) {
            player.pause?.();
            player.removeAttribute("src");
            player.load?.();
        }
        if (frame) frame.src = "about:blank";
    }

    function load(item) {
        const player = UI.player();
        const frame = UI.frame();

        if (!player || !frame) {
            console.error("PLAYER ELEMENT(S) NOT FOUND");
            return;
        }

        const src = item?.url || item?.src;

        const titleEl = UI.title();
        const artistEl = UI.artist();
        if (titleEl) titleEl.innerText = item?.title || item?.name || "Commercial Break";
        if (artistEl) artistEl.innerText = item?.artist || item?.category || "";

        setLoading(true, item);
        updateBroadcastUI(item);
        clearScheduledAdvance();
        clearStallTimer();

        if (!src) {
            console.error("MISSING MEDIA URL:", item);
            setTimeout(() => {
                isTransitioning = false;
                next();
            }, 0);
            return;
        }

        // ---------- DRIVE ----------
        if (isDriveLink(src)) {

            resetPlayerState(player, frame);

            player.style.display = "none";
            frame.style.display = "block";
            frame.src = toDrivePreview(src);

            setLoading(false, item);

            scheduleAdvance(item?.duration || 30);
            return;
        }

        // ---------- VIDEO ----------
        frame.style.display = "none";
frame.src = "about:blank";

player.style.display = "block";
player.loop = !!item?.loop;

clearStallTimer();

player.pause();
player.removeAttribute("src");
player.load();

player.oncanplay = null;

player.addEventListener("canplay", () => {
    clearStallTimer();
    setLoading(false, item);

    player.play().catch(console.error);

    if (item?.loop) {
        scheduleAdvance(item?.duration || 30);
    }
}, { once: true });

player.onerror = () => {
    console.error("MEDIA LOAD ERROR:", item);
    clearStallTimer();
    next();
};

player.src = src;
player.load();

scheduleStallFallback(item);

        // NOTE: intentionally NOT wiring onplay/onpause to clearScheduledAdvance here.
        // play() resolves asynchronously after oncanplay schedules the advance timer,
        // so a 'play' handler here would immediately cancel that timer and any
        // looping item would never advance. clearScheduledAdvance() is already called
        // at the top of load() and inside next(), which is the correct place for it.
    }

    function next() {
        if (isTransitioning) return;
        if (!queue || queue.length === 0) {
            console.error("QUEUE EMPTY - STOPPING");
            return;
        }

        isTransitioning = true;
        clearScheduledAdvance();
        clearStallTimer();

        const player = UI.player();
        if (player) player.style.opacity = 0.3;

        setTimeout(() => {
            index = (index + 1) % queue.length;
            load(queue[index]);

            if (player) player.style.opacity = 1;
            isTransitioning = false;
        }, 600);
    }

    async function start(q) {
        queue = q || (STUDIO?.generate ? await STUDIO.generate() : []);
        index = 0;

        if (!queue || queue.length === 0) {
            console.error("EMPTY QUEUE");
            return;
        }

        load(queue[0]);
    }

    return { start };

})();
