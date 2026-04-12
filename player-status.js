function checkStreamStatus() {
  const statusEl = document.getElementById("player-status");

  // Caster.fm status endpoint (public stream info)
  fetch("https://api.caster.fm/v1/public/station/a185d2e2-447f-4fc1-a552-5a8b75b8008c")
    .then(res => res.json())
    .then(data => {
      if (data && data.online) {
        statusEl.innerHTML = "🔴 LIVE NOW";
        statusEl.className = "player-loading player-live";
      } else {
        statusEl.innerHTML = "⚫ OFFLINE";
        statusEl.className = "player-loading player-offline";
      }
    })
    .catch(() => {
      statusEl.innerHTML = "⚫ OFFLINE";
      statusEl.className = "player-loading player-offline";
    });
}

// Run on load
checkStreamStatus();

// Refresh every 30 seconds
setInterval(checkStreamStatus, 30000);
const audio = document.getElementById("radioAudio");
const btn = document.getElementById("playBtn");
const indicator = document.getElementById("live-indicator");

let playing = false;

// Play / Pause
btn.onclick = () => {
  if (!playing) {
    audio.play();
    btn.innerText = "⏸";
    playing = true;
  } else {
    audio.pause();
    btn.innerText = "▶";
    playing = false;
  }
};

// Live status check
function checkStatus() {
  fetch("https://api.caster.fm/v1/public/station/a185d2e2-447f-4fc1-a552-5a8b75b8008c")
    .then(res => res.json())
    .then(data => {
      if (data.online) {
        indicator.innerText = "🔴 LIVE";
        indicator.className = "live";
      } else {
        indicator.innerText = "⚫ OFFLINE";
        indicator.className = "offline";
      }
    })
    .catch(() => {
      indicator.innerText = "⚫ OFFLINE";
      indicator.className = "offline";
    });
}

checkStatus();
setInterval(checkStatus, 30000);
const audio = document.getElementById("radioAudio");
const btn = document.getElementById("playBtn");
const indicator = document.getElementById("live-indicator");

let playing = false;

// Play / Pause
btn.onclick = () => {
  if (!playing) {
    audio.play();
    btn.innerText = "⏸";
    playing = true;
  } else {
    audio.pause();
    btn.innerText = "▶";
    playing = false;
  }
};

const audio = document.getElementById("radioAudio");
const btn = document.getElementById("playBtn");
const indicator = document.getElementById("live-indicator");

let playing = false;

// Play / Pause
btn.onclick = () => {
  if (!playing) {
    audio.play();
    btn.innerText = "⏸";
    playing = true;
  } else {
    audio.pause();
    btn.innerText = "▶";
    playing = false;
  }
};

<script src="player.js"></script>
