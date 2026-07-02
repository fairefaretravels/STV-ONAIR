window.saveMedia = function () {
    const titleEl = document.getElementById("mediatitle");
    const urlEl = document.getElementById("mediaurl");

    const title = titleEl.value.trim();
    const url = urlEl.value.trim();

    // Basic validation
    if (!title || !url) {
        showToast?.("⚠️ Missing title or URL");
        alert("Please enter both a title and a URL.");
        return;
    }

    // URL sanity check (lightweight)
    const isValidUrl = /^https?:\/\/.+/i.test(url);
    if (!isValidUrl) {
        showToast?.("⚠️ Invalid URL format");
        alert("Please enter a valid http(s) URL.");
        return;
    }

    const mediaItem = {
        id: crypto?.randomUUID?.() || String(Date.now()),
        title,
        url,
        createdAt: new Date().toISOString()
    };

    console.log("[STUDIO] MEDIA INGEST:", mediaItem);

    // UI feedback hooks (if your dashboard has them)
    showToast?.(`Added: ${title}`);

    // Optional visual pulse effect on save button
    const btn = document.querySelector("button[onclick='saveMedia()']");
    if (btn) {
        btn.classList.add("pulse");
        setTimeout(() => btn.classList.remove("pulse"), 600);
    }

    // Clear inputs
    titleEl.value = "";
    urlEl.value = "";
    titleEl.focus();

    // Future hook: push into library / API
    window.dispatchEvent(new CustomEvent("studio:media:add", {
        detail: mediaItem
    }));
};

window.goLive = function () {
    console.log("[STUDIO] INIT LIVE HANDOFF → WATCH ENGINE");

    showToast?.("🚀 Sending to LIVE player...");

    // Future-ready payload structure (important for scaling)
    const payload = {
        timestamp: new Date().toISOString(),
        mode: "live",
        source: "dashboard",
        action: "sync_playlist"
    };

    console.log("[STUDIO] LIVE PAYLOAD:", payload);

    // This is your integration hook to watch.html
    window.dispatchEvent(new CustomEvent("studio:go-live", {
        detail: payload
    }));

    // Optional UX hint
    const btn = document.querySelector("button[onclick='goLive()']");
    if (btn) {
        btn.classList.add("live-fire");
        setTimeout(() => btn.classList.remove("live-fire"), 800);
    }
};
