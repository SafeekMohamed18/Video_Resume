const sceneList = Array.isArray(window.sceneData) ? window.sceneData : [];
const timeline = new TimelineEngine(sceneList);

const sceneNodes = [...document.querySelectorAll('.scene')];
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const presentationBtn = document.getElementById('presentationBtn');
const timelineRange = document.getElementById('timelineRange');

const cinematicPopupMap = {
  'scene-01': ['Build', 'Vision', 'Impact'],
  'scene-02': ['Code', 'Clarity', 'Purpose'],
  'scene-03': ['Learn', 'Growth', 'Future'],
  'scene-04': ['Skills', 'Systems', 'Stack'],
  'scene-05': ['Experience', 'Delivery', 'Teamwork'],
  'scene-06': ['ClassWallet', 'Solve', 'Value'],
  'scene-07': ['Leadership', 'Collaboration', 'Wins'],
  'scene-08': ['Think', 'Lead', 'Adapt'],
  'scene-09': ['Business', 'Technology', 'Strategy'],
  'scene-10': ['Why Me', 'Balance', 'Trust'],
  'scene-11': ['Connect', 'Ready', 'Hello']
};

function renderScenePopups(currentSceneId) {
  const stage = document.querySelector('.video-stage');
  if (!stage) {
    return;
  }

  const existingPopups = stage.querySelectorAll('.cinematic-popup');
  existingPopups.forEach((popup) => popup.remove());

  const labels = cinematicPopupMap[currentSceneId] || [];
  labels.forEach((label, index) => {
    const popup = document.createElement('span');
    popup.className = 'cinematic-popup';
    popup.textContent = label;
    popup.style.setProperty('--delay', `${index * 0.12}s`);
    popup.style.setProperty('--drift', `${(index % 2 === 0 ? -1 : 1) * (18 + index * 8)}px`);
    popup.style.setProperty('--left', `${12 + (index * 22) % 68}%`);
    popup.style.setProperty('--top', `${18 + (index * 16) % 52}%`);
    stage.appendChild(popup);
  });
}

function updateSceneDisplay(currentSceneId) {
  if (!currentSceneId) {
    return;
  }

  sceneNodes.forEach((scene) => {
    const isActive = scene.dataset.sceneId === currentSceneId;
    scene.classList.toggle('active', isActive);
  });

  renderScenePopups(currentSceneId);
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
