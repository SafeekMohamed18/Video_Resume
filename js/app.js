const sceneList = Array.isArray(window.sceneData) ? window.sceneData : [];
const timeline = new TimelineEngine(sceneList);

const sceneNodes = [...document.querySelectorAll('.scene')];
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const presentationBtn = document.getElementById('presentationBtn');
const timelineRange = document.getElementById('timelineRange');
const backgroundMusic = document.getElementById('backgroundMusic');
let audioContext = null;
let lastSceneId = timeline.activeSceneId;
let ambientNodes = [];
let ambientTimer = null;

function ensureAudioContext() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return null;
  }

  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  return audioContext;
}

function startAmbientMusic() {
  const context = ensureAudioContext();
  if (!context || ambientNodes.length) {
    return;
  }

  context.resume();
  const master = context.createGain();
  master.gain.value = 0.035;
  master.connect(context.destination);

  const frequencies = [220, 277.18, 329.63];
  ambientNodes = frequencies.map((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 0 ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 0 ? 0.55 : 0.18;
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start();
    return oscillator;
  });

  const progression = [
    [220, 277.18, 329.63],
    [196, 246.94, 293.66],
    [174.61, 220, 261.63],
    [196, 246.94, 329.63]
  ];
  let step = 0;
  ambientTimer = window.setInterval(() => {
    const next = progression[step % progression.length];
    ambientNodes.forEach((oscillator, index) => {
      oscillator.frequency.exponentialRampToValueAtTime(next[index], context.currentTime + 1.2);
    });
    step += 1;
  }, 3200);
}

function stopAmbientMusic() {
  if (ambientTimer) {
    window.clearInterval(ambientTimer);
    ambientTimer = null;
  }

  ambientNodes.forEach((oscillator) => oscillator.stop());
  ambientNodes = [];
}

function startAudio() {
  if (backgroundMusic?.src) {
    backgroundMusic.volume = 0.16;
    backgroundMusic.play().catch(() => startAmbientMusic());
    return;
  }

  startAmbientMusic();
}

function playSceneCue() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return;
  }

  audioContext = ensureAudioContext();
  if (!audioContext) {
    return;
  }
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(520, now);
  oscillator.frequency.exponentialRampToValueAtTime(760, now + 0.08);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.035, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.18);
}

function updateSceneDisplay(currentSceneId) {
  if (!currentSceneId) {
    return;
  }

  sceneNodes.forEach((scene) => {
    const isActive = scene.dataset.sceneId === currentSceneId;
    scene.classList.toggle('active', isActive);
    if (isActive && scene.dataset.sceneId !== lastSceneId) {
      scene.classList.remove('scene-entering');
      window.requestAnimationFrame(() => scene.classList.add('scene-entering'));
      playSceneCue();
    }
  });
  lastSceneId = currentSceneId;
}

function handleTimeUpdate(payload) {
  const { scene, progress } = payload;
  if (!scene) {
    return;
  }

  updateSceneDisplay(scene.id);
  timelineRange.value = Math.round(progress);
}

timeline.onTimeUpdate = handleTimeUpdate;

playBtn.addEventListener('click', () => {
  startAudio();
  timeline.playVideo();
});

pauseBtn.addEventListener('click', () => {
  timeline.pauseVideo();
  backgroundMusic?.pause();
  stopAmbientMusic();
});

restartBtn.addEventListener('click', () => {
  startAudio();
  timeline.restartVideo();
  updateSceneDisplay(timeline.activeSceneId);
});

presentationBtn.addEventListener('click', () => {
  document.body.classList.toggle('presentation-mode');
});

timelineRange.addEventListener('input', (event) => {
  startAudio();
  const percent = Number(event.target.value);
  const total = timeline.getTotalDuration();
  timeline.setTime((percent / 100) * total);
  updateSceneDisplay(timeline.activeSceneId);
});

window.addEventListener('DOMContentLoaded', () => {
  updateSceneDisplay(timeline.activeSceneId);
  timeline.updateTimeline();
});
