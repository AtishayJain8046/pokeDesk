export default class TransitionSystem {
  constructor(scene) {
    this.scene = scene;
    this.transitioning = false;
  }

  fadeToScene(targetScene, data = {}) {
    if (this.transitioning) return;
    this.transitioning = true;

    this.scene.cameras.main.fadeOut(300, 0, 0, 0);
    this.scene.cameras.main.once("camerafadeoutcomplete", () => {
      this.scene.scene.start(targetScene, data);
    });
  }

  fadeIn(duration = 300) {
    this.scene.cameras.main.fadeIn(duration, 0, 0, 0);
    this.transitioning = false;
  }
}
