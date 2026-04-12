const audio = document.getElementById("radioAudio");
const btn = document.getElementById("playBtn");
const player = document.getElementById("sticky-player");
const liveText = document.getElementById("live-text");

let playing = false;

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

function checkStatus() {
  fetch("https://api.caster.fm/v1/public/station/a185d2e2-447f-4fc1-a552-5a8b75b8008c")
    .then(res => res.json())
    .then(data => {
      if (data.online) {
        player.classList.add("live");
        liveText.innerText = "LIVE";
      } else {
        player.classList.remove("live");
        liveText.innerText = "OFFLINE";
      }
    })
    .catch(() => {
      player.classList.remove("live");
      liveText.innerText = "OFFLINE";
    });
}

checkStatus();
setInterval(checkStatus, 30000);
