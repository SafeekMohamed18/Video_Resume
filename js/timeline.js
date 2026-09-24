class TimelineEngine {
  constructor(sceneList) {
    this.scenes = sceneList;
    this.currentTime = 0;
    this.playing = false;
    this.intervalId = null;
    this.activeSceneId = sceneList[0]?.id || null;
    this.onTimeUpdate = null;
  }

  getTotalDuration() {
    return this.scenes[this.scenes.length - 1]?.end || 0;
  }

  getSceneAtTime(time) {
    if (!this.scenes.length) {
      return null;
    }

    const match = this.scenes.find((scene) => time >= scene.start && time < scene.end);
    return match || this.scenes[this.scenes.length - 1];
  }

  updateTimeline() {
    const totalDuration = this.getTotalDuration();
    const progress = totalDuration > 0 ? (this.currentTime / totalDuration) * 100 : 0;
    const currentScene = this.getSceneAtTime(this.currentTime) || this.scenes[0] || null;

    if (this.onTimeUpdate) {
      this.onTimeUpdate({
        currentTime: this.currentTime,
        progress,
        totalDuration,
        scene: currentScene
      });
    }
  }

  setTime(time) {
    const maxTime = this.getTotalDuration();
    const clamped = Math.min(Math.max(time, 0), maxTime);
    const scene = this.getSceneAtTime(clamped) || this.scenes[0] || null;

    this.currentTime = clamped;
    this.activeSceneId = scene ? scene.id : null;
    this.updateTimeline();
  }

  playVideo() {
    if (this.playing || !this.scenes.length) {
      return;
    }

    this.playing = true;
    this.intervalId = window.setInterval(() => {
      const totalDuration = this.getTotalDuration();
      if (this.currentTime >= totalDuration) {
        this.pauseVideo();
        this.currentTime = totalDuration;
        this.activeSceneId = this.getSceneAtTime(totalDuration)?.id || this.scenes[this.scenes.length - 1]?.id || null;
        this.updateTimeline();
        return;
      }

      this.currentTime += 0.05;
      const scene = this.getSceneAtTime(this.currentTime) || this.scenes[0] || null;
      this.activeSceneId = scene ? scene.id : null;
      this.updateTimeline();
    }, 50);
  }

  pauseVideo() {
    this.playing = false;
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  restartVideo() {
    this.pauseVideo();
    this.currentTime = 0;
    this.activeSceneId = this.scenes[0]?.id || null;
    this.updateTimeline();
  }
}
