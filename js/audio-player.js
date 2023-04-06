const seekSlider = document.getElementById("mainSong");
const playIconContainer = document.getElementById("playIconContainer");
const audioPlayerContainer = document.getElementById("audio-player-container");
let playState = "play";

playIconContainer.addEventListener("click", () => {
  if (playState === "play") {
    audio.play();
    requestAnimationFrame(whilePlaying);
    playState = "pause";
  } else {
    audio.pause();
    cancelAnimationFrame(rAF);
    playState = "play";
  }
});

const showRangeProgress = (rangeInput) => {
  audioPlayerContainer.style.setProperty(
    "--seek-before-width",
    (rangeInput.value / rangeInput.max) * 100 + "%"
  );
};

seekSlider.addEventListener("input", (e) => {
  showRangeProgress(e.target);
});

// --------------

const audio = document.querySelector("audio");
const durationContainer = document.getElementById("durationTime");
const currentTimeContainer = document.getElementById("currentTime");
let rAF = null;

const calculateTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minutes}:${returnedSeconds}`;
};

const displayDuration = () => {
  durationContainer.textContent = calculateTime(audio.duration);
};

const setSliderMax = () => {
  seekSlider.max = Math.floor(audio.duration);
};

const displayBufferedAmount = () => {
  const bufferedAmount = Math.floor(
    audio.buffered.end(audio.buffered.length - 1)
  );
  audioPlayerContainer.style.setProperty(
    "--buffered-width",
    `${(bufferedAmount / seekSlider.max) * 100}%`
  );
};

const whilePlaying = () => {
  seekSlider.value = Math.floor(audio.currentTime);
  if (Math.floor(audio.currentTime) === Math.floor(audio.duration)) {
    audio.pause();
    playState = "play";
    audio.currentTime = 0;
    playIconContainer.classList.toggle("active");
  }
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  let value = (seekSlider.value / seekSlider.max) * 100;
  audioPlayerContainer.style.setProperty("--seek-before-width", `${value}%`);
  seekSlider.style.setProperty(
    "background",
    `linear-gradient(to right, #82CFD0 0%, #7a66cc ${value}%, #fff ${value}%, white 100%)`
  );
  rAF = requestAnimationFrame(whilePlaying);
};

if (audio.readyState > 0) {
  displayDuration();
  setSliderMax();
  displayBufferedAmount();
} else {
  audio.addEventListener("loadedmetadata", () => {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
  });
}

audio.addEventListener("progress", displayBufferedAmount);

seekSlider.addEventListener("input", () => {
  currentTimeContainer.textContent = calculateTime(seekSlider.value);
  if (!audio.paused) {
    cancelAnimationFrame(rAF);
  }
});

seekSlider.addEventListener("change", () => {
  audio.currentTime = seekSlider.value;

  if (!audio.paused) {
    requestAnimationFrame(whilePlaying);
  }
});
// ---------
if ("mediaSession" in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: "War for love",
    artist: "Bright Lights",
  });
  navigator.mediaSession.setActionHandler("play", () => {
    if (playState === "play") {
      audio.play();
      requestAnimationFrame(whilePlaying);
      playState = "pause";
    } else {
      audio.pause();
      cancelAnimationFrame(rAF);
      playState = "play";
    }
  });
  navigator.mediaSession.setActionHandler("pause", () => {
    if (playState === "play") {
      audio.play();
      requestAnimationFrame(whilePlaying);
      playState = "pause";
    } else {
      audio.pause();
      cancelAnimationFrame(rAF);
      playState = "play";
    }
  });
  navigator.mediaSession.setActionHandler("seekbackward", (details) => {
    audio.currentTime = audio.currentTime - (details.seekOffset || 10);
  });
  navigator.mediaSession.setActionHandler("seekforward", (details) => {
    audio.currentTime = audio.currentTime + (details.seekOffset || 10);
  });
  navigator.mediaSession.setActionHandler("seekto", (details) => {
    if (details.fastSeek && "fastSeek" in audio) {
      audio.fastSeek(details.seekTime);
      return;
    }
    audio.currentTime = details.seekTime;
  });
  navigator.mediaSession.setActionHandler("stop", () => {
    audio.currentTime = 0;
    seekSlider.value = 0;
    audioPlayerContainer.style.setProperty("--seek-before-width", "0%");
    currentTimeContainer.textContent = "0:00";
    if (playState === "pause") {
      cancelAnimationFrame(rAF);
      playState = "play";
    }
  });
}
