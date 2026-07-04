window.MEDIA = (function () {

    // =========================
    // STATE
    // =========================
    let queue = [];
    let index = 0;
    let isTransitioning = false;

    let advanceTimer = null;
    let stallTimer = null;

    const STALL_TIMEOUT_MS = 15000;

    const STATE = {
        IDLE: "idle",
        LOADING: "loading",
        PLAYING: "playing",
        STALLED: "stalled",
        FAILED: "failed"
    };

    let state = STATE.IDLE;

    // =========================
    // DOM
    // =========================
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

    // =========================
    // STATE HELPERS
    // =========================
    function setState(s) {
        state = s;
    }

    // =========================
    // LOADING PLACEHOLDER HELPER
    // (no-op hook — the actual standby-photo show/hide is wired up
    // in watch.html via the video element's own play/waiting/error
    // events. This just prevents ReferenceErrors on the iframe route
    // and gives a place to hook in iframe-specific loading UI later.)
    // =========================
    function setLoading(isLoading, item) {
        // intentionally left as a safe no-op for now
    }

    // =========================
    // MEDIA NORMALIZER
    // =========================
    function normalize(item) {
        const src = item?.url || item?.src || "";

        const lower = src.toLowerCase();

        const isDrive = lower.includes("drive.google.com");
        const isYouTube = lower.includes("youtube.com") || lower.includes("youtu.be");
        const isHLS = lower.includes(".m3u8");
        const isMP4 = lower.includes(".mp4");

        return {
            ...item,
            src,
            type:
                isDrive || isYouTube ? "iframe"
                : isHLS ? "hls"
                : isMP4 ? "video"
                : "unknown"
        };
    }

    // =========================
    // UI UPDATE
    // =========================
    function updateUI(item) {
        const title = item?.title || item?.name || "Commercial Break";
        const sub = item?.artist || item?.category || item?.type || "";

        if (UI.title()) UI.title().innerText = title;
        if (UI.artist()) UI.artist().innerText = sub;

        if (UI.npTitle()) UI.npTitle().innerText = title;
        if (UI.npSub()) UI.npSub().innerText = sub;
        if (UI.ltHeadline()) UI.ltHeadline().innerText = title;
        if (UI.ltSubheadline()) UI.ltSubheadline().innerText = sub;

        if (UI.tickerText()) {
            UI.tickerText().innerText =
                `LIVE • NOW PLAYING: ${title} • ${sub} • Entertainment • News • Community • Stay tuned`;
        }

        if (UI.banner()) {
            UI.banner().classList.remove("show");
            setTimeout(() => UI.banner().classList.add("show"), 50);
        }
    }

    // =========================
    // RESET
    // =========================
    function reset(player, frame) {
        clearTimeout(advanceTimer);
        clearTimeout(stallTimer);

        if (player) {
            // Clear handlers BEFORE touching src/load() so the
            // teardown itself can never trigger a stale callback.
            player.oncanplay = null;
            player.onerror = null;

            player.pause();
            player.removeAttribute("src");
            player.load();
        }

        if (frame) frame.src = "about:blank";
    }

    // =========================
    // STALL WATCHDOG
    // =========================
    function startStallWatch(item) {
        clearTimeout(stallTimer);

        stallTimer = setTimeout(() => {
            console.warn("STALL TIMEOUT:", item);
            fail(item, "STALL");
        }, STALL_TIMEOUT_MS);
    }

    function clearStall() {
        clearTimeout(stallTimer);
    }

    // =========================
    // ADVANCE
    // =========================
    function scheduleAdvance(item) {
        clearTimeout(advanceTimer);

        const seconds = item?.duration || 30;

        advanceTimer = setTimeout(() => {
            next();
        }, seconds * 1000);
    }

    // =========================
    // FAIL HANDLER
    // =========================
    function fail(item, reason) {
        console.warn("MEDIA FAIL:", reason, item);

        item._failCount = (item._failCount || 0) + 1;

        if (item._failCount > 2) {
            console.warn("SKIPPING PERMANENTLY FAILED ITEM:", item);
        }

        // IMPORTANT: defer next() instead of calling it inline.
        // fail() can be invoked synchronously from inside load(), which
        // itself can be invoked synchronously from inside next()'s
        // setTimeout callback (e.g. a bad/missing src on the very next
        // item). If next() were called directly here, it would re-enter
        // while isTransitioning is still true from the outer call, get
        // silently swallowed by the `if (isTransitioning) return;` guard,
        // and leave the queue permanently stuck. setTimeout(next, 0)
        // pushes this to a fresh tick so it always finds isTransitioning
        // already reset to false.
        setTimeout(next, 0);
    }

    // =========================
    // LOAD MEDIA
    // =========================
    function load(item) {
        const player = UI.player();
        const frame = UI.frame();

        if (!player || !frame) return;

        const media = normalize(item);

        setState(STATE.LOADING);
        updateUI(media);
        reset(player, frame);

        if (!media.src) {
            return fail(media, "NO_SRC");
        }

        // =========================
        // IFRAME ROUTE
        // =========================
        if (media.type === "iframe") {
            setLoading(true, media);

            player.style.display = "none";
            frame.style.display = "block";

            frame.src = media.src.includes("drive.google.com")
                ? `https://drive.google.com/file/d/${extractDriveId(media.src)}/preview`
                : media.src;

            setLoading(false, media);

            scheduleAdvance(media);
            return;
        }

        // =========================
        // VIDEO ROUTE
        // =========================
        frame.style.display = "none";
        player.style.display = "block";

        player.loop = !!media.loop;

        // Muted autoplay is required by browser autoplay policy (Chrome,
        // Safari, Firefox all block unmuted programmatic play() without a
        // prior user gesture). This is an unattended broadcast player, so
        // there's never a user gesture to rely on at load time — without
        // this line, player.play() below throws NotAllowedError on every
        // single item, every time, which used to trigger fail("AUTOPLAY")
        // in a loop.
        //
        // If the viewer has already clicked an "unmute" control this
        // session (soundEnabled), keep sound on across the item change
        // instead of re-muting every load().
        player.muted = !soundEnabled;

        startStallWatch(media);

        const onCanPlay = async () => {
            clearStall();
            setLoading(false, media);

            setState(STATE.PLAYING);

            try {
                await player.play();
            } catch (err) {
                console.warn("AUTOPLAY BLOCKED:", err);
                fail(media, "AUTOPLAY");
                return;
            }

            scheduleAdvance(media);
        };

        const onError = () => {
            clearStall();
            fail(media, "ERROR");
        };

        // IMPORTANT: use DOM0-style assignment (not addEventListener).
        // This guarantees each load() call fully REPLACES the previous
        // item's handlers instead of stacking a new listener on top of
        // one that may never have fired (e.g. a canplay handler with no
        // matching error, or vice versa). Without this, stale handlers
        // from earlier items stick around and get triggered by the
        // reset()/load() calls of later items, causing spurious calls
        // to next() and the "flicker"/rapid-recycle behavior.
        player.oncanplay = onCanPlay;
        player.onerror = onError;

        player.src = media.src;
        player.load();
    }

    // =========================
    // DRIVE ID EXTRACT
    // =========================
    function extractDriveId(url) {
        const match =
            url.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
            url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

        return match ? match[1] : "";
    }

    // =========================
    // NEXT ITEM
    // =========================
    function next() {
        if (isTransitioning) return;

        isTransitioning = true;

        const player = UI.player();
        if (player) player.style.opacity = 0.3;

        setTimeout(() => {
            index = (index + 1) % queue.length;
            load(queue[index]);

            if (player) player.style.opacity = 1;

            isTransitioning = false;
        }, 500);
    }

    // =========================
    // START
    // =========================
    async function start(q) {
        queue = q || [];
        index = 0;

        if (!queue.length) {
            console.error("EMPTY QUEUE");
            return;
        }

        load(queue[0]);
    }

    // =========================
    // SOUND / UNMUTE
    // =========================
    // Called by a user-gesture UI element (button/overlay click) to turn
    // sound on for the currently playing item and all subsequent items.
    // Browsers require a real user gesture to unmute programmatically-
    // playing video, so this can only ever be triggered from a click/tap
    // handler -- it will not work if called from a timer or on load.
    let soundEnabled = false;

    function enableSound() {
        soundEnabled = true;
        const player = UI.player();
        if (player) player.muted = false;
    }

    // =========================
    // PUBLIC API
    // =========================
    return {
        start,
        enableSound
    };

})();
