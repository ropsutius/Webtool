import * as Matrix from './Matrix.js';
import * as ThreeDView from './threeDView.js';
import * as PixelView from './pixelView.js';
import {
  updateTubeColors,
  updatePixelColors,
  onWindowResize,
} from './interaction.js';
import {
  addSavedProject,
  getSavedProjects,
} from '../services/projectService.js';

//const newMatrix = await addSavedProject({});

export function initApp(options) {
  Matrix.initMatrix(options);
  ThreeDView.initScene();
  PixelView.initScene();

  onWindowResize();
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
