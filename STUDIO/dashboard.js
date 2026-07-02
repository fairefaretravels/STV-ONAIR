window.mediaLibrary = window.mediaLibrary || [];

window.saveMedia = function () {
    const titleEl = document.getElementById("mediatitle");
    const urlEl = document.getElementById("mediaurl");

    const title = titleEl?.value?.trim();
    const url = urlEl?.value?.trim();

    if (!title || !url) {
        alert("Please enter both a title and a URL.");
        return;
    }

    const mediaItem = {
        id: Date.now(),
        title,
        url,
        createdAt: new Date().toISOString()
    };

    window.mediaLibrary.push(mediaItem);

    console.log("Saved media item:", mediaItem);
    console.log("Current library:", window.mediaLibrary);

    // optional: clear inputs
    titleEl.value = "";
    urlEl.value = "";
};

window.goLive = function () {
    if (!window.mediaLibrary.length) {
        alert("No media in library yet.");
        return;
    }

    // Save to session storage so watch page can read it
    sessionStorage.setItem(
        "STUDIO_PLAYLIST",
        JSON.stringify(window.mediaLibrary)
    );

    console.log("Go Live triggered. Playlist sent:", window.mediaLibrary);

    // Navigate to watch page (adjust path if needed)
    window.location.href = "STUDIO/watch.html";
};
