const tracks = [...document.querySelectorAll(".track")];
const audio = document.querySelector("#track-audio");
const playButton = document.querySelector('[data-action="play"]');
const title = document.querySelector("#current-title");
const artist = document.querySelector("#current-artist");
let selectedTrack = 0;

function setPlaying(playing) {
  playButton.classList.toggle("is-playing", playing);
  playButton.setAttribute("aria-pressed", String(playing));
  playButton.setAttribute("aria-label", playing ? "Стоп" : "Воспроизвести");
}

function selectTrack(index, autoplay = false) {
  selectedTrack = (index + tracks.length) % tracks.length;
  const selected = tracks[selectedTrack];
  audio.pause();
  audio.src = selected.dataset.src;
  audio.load();
  title.textContent = selected.dataset.title;
  artist.textContent = selected.dataset.artist;
  tracks.forEach((track, i) => {
    const active = i === selectedTrack;
    track.classList.toggle("is-selected", active);
    if (active) track.setAttribute("aria-current", "true");
    else track.removeAttribute("aria-current");
  });
  setPlaying(false);
  if (autoplay) startPlayback();
}

async function startPlayback() {
  try {
    await audio.play();
    setPlaying(true);
  } catch {
    setPlaying(false);
  }
}

function stopPlayback() {
  audio.pause();
  audio.currentTime = 0;
  setPlaying(false);
}

tracks.forEach((track, index) => {
  track.addEventListener("click", () => selectTrack(index));
  track.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectTrack(index);
    }
  });
});

document.querySelector(".transport").addEventListener("click", (event) => {
  const action = event.target.closest("button")?.dataset.action;
  if (action === "previous") selectTrack(selectedTrack - 1, !audio.paused);
  if (action === "next") selectTrack(selectedTrack + 1, !audio.paused);
  if (action === "play") {
    if (audio.paused) startPlayback();
    else stopPlayback();
  }
});

audio.addEventListener("ended", () => setPlaying(false));
selectTrack(0);
