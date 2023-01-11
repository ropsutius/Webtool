import * as Matrix from './Matrix.js';
import * as ThreeDView from './threeDView.js';
import * as PixelView from './pixelView.js';
import {
  updateTubeColors,
  updatePixelColors,
  onWindowResize,
} from './interaction.js';
import { getSavedProjects } from './services/projectService.js';

export async function initApp() {
  //fetch projects from database
  const projects = await getSavedProjects();

  if (projects) Matrix.initMatrix(projects[projects.length - 1]);
  else Matrix.initMatrix({ layers: 2, width: 30, height: 30, weave: 'plain' });

  ThreeDView.initScene();
  PixelView.initScene();

  window.addEventListener('resize', onWindowResize);

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
