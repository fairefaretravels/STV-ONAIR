const library = [];

function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;

    clock.textContent = new Date().toLocaleTimeString();
}

function updateStats() {
    const count = document.getElementById("videoCount");
    if (count) {
        count.textContent = library.length;
    }
}

function renderLibrary() {
    const list = document.getElementById("library");
    if (!list) return;

    list.innerHTML = "";

    if (library.length === 0) {
        list.innerHTML = "<p>No media added yet.</p>";
        updateStats();
        return;
    }

    library.forEach(item => {
        const row = document.createElement("div");
        row.className = "media-item";

        row.innerHTML = `
            <strong>${item.title}</strong><br>
            <small>${item.url}</small>
        `;

        row.animate([
            { opacity: 0, transform: "translateX(-20px)" },
            { opacity: 1, transform: "translateX(0)" }
        ], {
            duration: 300,
            easing: "ease-out"
        });

        list.appendChild(row);
    });

    updateStats();
}

function saveMedia() {
    const title = document.getElementById("mediatitle").value.trim();
    const url = document.getElementById("mediaurl").value.trim();

    if (!title || !url) {
        alert("Enter title and URL");
        return;
    }

    library.push({ title, url });

    renderLibrary();

    document.getElementById("mediatitle").value = "";
    document.getElementById("mediaurl").value = "";
}

function goLive() {
    if (!library.length) {
        alert("No media queued.");
        return;
    }

    alert(`Sending ${library.length} items to LIVE player`);
}

window.addEventListener("DOMContentLoaded", () => {
    renderLibrary();
    updateClock();
    setInterval(updateClock, 1000);
});
