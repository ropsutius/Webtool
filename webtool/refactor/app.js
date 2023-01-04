import * as Matrix from './Matrix.js';
import * as ThreeDView from './threeDView.js';
import * as PixelView from './pixelView.js';
import { updateTubeColors, updatePixelColors } from './interaction.js';

export function init(options) {
  Matrix.initMatrix(options);
  ThreeDView.initScene();
  PixelView.initScene();

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  ThreeDView.controls.update();
  PixelView.controls.update();

  Matrix.updateTubeHeights();
  Matrix.updatePixelColors();

  updateTubeColors();
  updatePixelColors();

  ThreeDView.renderer.render(ThreeDView.scene, ThreeDView.camera);
  PixelView.renderer.render(PixelView.scene, PixelView.camera);
}
