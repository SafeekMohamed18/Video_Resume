const sceneList = Array.isArray(window.sceneData) ? window.sceneData : [];
const timeline = new TimelineEngine(sceneList);

const sceneNodes = [...document.querySelectorAll('.scene')];
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const presentationBtn = document.getElementById('presentationBtn');
const timelineRange = document.getElementById('timelineRange');

function updateSceneDisplay(currentSceneId) {
  if (!currentSceneId) {
    return;
  }

  sceneNodes.forEach((scene) => {
    const isActive = scene.dataset.sceneId === currentSceneId;
    scene.classList.toggle('active', isActive);
  });
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
  timeline.playVideo();
});

pauseBtn.addEventListener('click', () => {
  timeline.pauseVideo();
});

restartBtn.addEventListener('click', () => {
  timeline.restartVideo();
  updateSceneDisplay(timeline.activeSceneId);
});

presentationBtn.addEventListener('click', () => {
  document.body.classList.toggle('presentation-mode');
});

timelineRange.addEventListener('input', (event) => {
  const percent = Number(event.target.value);
  const total = timeline.getTotalDuration();
  timeline.setTime((percent / 100) * total);
  updateSceneDisplay(timeline.activeSceneId);
});

window.addEventListener('DOMContentLoaded', () => {
  updateSceneDisplay(timeline.activeSceneId);
  timeline.updateTimeline();
});
