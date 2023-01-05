import * as Matrix from './Matrix.js';
import * as Materials from './Materials.js';
import * as Geometry from './Geometry.js';
import { initThreeDControls } from './controls.js';
import { initPerspectiveCamera } from './camera.js';
import { addAxesHelpers } from './helpers.js';
import { addLights } from './lights.js';

export let canvas, scene, renderer, controls, camera, matrix;

export function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(Materials.backgroundColor);

  canvas = document.getElementById('3d-view');

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  canvas.appendChild(renderer.domElement);

  populateScene();
}

export function populateScene() {
  matrix = Matrix.getMatrix();

  const center = {
    x: (matrix.width * Geometry.weftLength) / 2 / matrix.layers,
    y: 0,
    z: (matrix.height * Geometry.warpLength) / 2 / matrix.layers,
  };

  camera = initPerspectiveCamera(canvas, center);
  controls = initThreeDControls(camera, renderer, center);
  addLights(scene);
  addAxesHelpers(scene);

  for (const [y, row] of matrix.matrix.entries()) {
    for (const [x, point] of row.entries()) {
      if (!Matrix.isPrimePoint(point)) continue;

      const curve = Matrix.getWarpPoints(point);
      const tube = Geometry.getTubeFromCurve(curve, 'Warp');
      matrix.matrix[y][x] = { ...point, threeDId: tube.id };
      scene.add(tube);
    }
  }

  for (const curve of Matrix.getWeftPoints()) {
    scene.add(Geometry.getTubeFromCurve(curve, 'Weft'));
  }

  console.log(scene);
  console.log(matrix.testMatrix());
}

export function clearScene() {
  scene.remove.apply(scene, scene.children);
}
