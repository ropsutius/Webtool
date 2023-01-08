import {
  getMatrix,
  isPrimePoint,
  getWarpPoints,
  getWeftPoints,
} from './Matrix.js';
import { backgroundColor } from './Materials.js';
import { weftLength, warpLength, getTubeFromCurve } from './Geometry.js';
import { initThreeDControls } from './controls.js';
import { initPerspectiveCamera } from './camera.js';
import { addAxesHelpers } from './helpers.js';
import { addLights } from './lights.js';

export let canvas, scene, renderer, controls, camera, matrix;

export function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  canvas = document.getElementById('3d-view');
  renderer = new THREE.WebGLRenderer({ canvas });

  populateScene();
}

export function populateScene() {
  matrix = getMatrix();

  const center = {
    x: (matrix.width * weftLength) / 2 / matrix.layers,
    y: 0,
    z: (matrix.height * warpLength) / 2 / matrix.layers,
  };

  camera = initPerspectiveCamera(canvas, center);
  controls = initThreeDControls(camera, renderer, center);
  addLights(scene);
  addAxesHelpers(scene);

  for (const [y, row] of matrix.matrix.entries()) {
    for (const [x, point] of row.entries()) {
      if (!isPrimePoint(point)) continue;

      const curve = getWarpPoints(point);
      const tube = getTubeFromCurve(curve, 'Warp');
      matrix.matrix[y][x] = { ...point, threeDId: tube.id };
      scene.add(tube);
    }
  }

  for (const curve of getWeftPoints()) {
    scene.add(getTubeFromCurve(curve, 'Weft'));
  }

  console.log(matrix);
  console.log(scene);
}

export function clearScene() {
  scene.remove.apply(scene, scene.children);
}
