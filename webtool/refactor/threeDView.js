import * as Matrix from './Matrix.js';
import * as Materials from './Materials.js';
import * as Geometry from './Geometry.js';
import { initControls } from './controls.js';
import { initCamera } from './camera.js';

export let canvas, scene, renderer, controls, camera, matrix;

export function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(Materials.backgroundColor);

  canvas = document.getElementById('threeD-view');

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  canvas.appendChild(renderer.domElement);

  matrix = Matrix.getMatrix();

  const center = {
    x: (matrix.width * Geometry.weftLength) / 2 / matrix.layers,
    y: 0,
    z: (matrix.height * Geometry.warpLength) / 2 / matrix.layers,
  };

  camera = initCamera(canvas, center);
  controls = initControls(camera, renderer, center);

  initScene();

  scene.add(
    new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial(0x00ff00)
    )
  );
  console.log(scene);
}

function initScene() {
  let light = new THREE.HemisphereLight(Materials.lightColor);
  light.position.y = -10;
  scene.add(light);

  let axesHelper = new THREE.AxesHelper(5);
  axesHelper.translateY(matrix.layers * Geometry.layerOffset + 10);
  scene.add(axesHelper);

  for (let i = 0; i < matrix.width; i++) {
    for (let k = 0; k < matrix.height; k++) {
      if (!Matrix.isPrimePoint({ x: i, y: k })) continue;

      const curve = Matrix.getWarpPoints({ y: k, x: i });
      const tube = Geometry.getTubeFromCurve(curve, 'Warp');
      scene.add(tube);
      matrix.matrix[k][i].id = tube.id;
    }
  }

  for (const curve of Matrix.getWeftPoints()) {
    scene.add(Geometry.getTubeFromCurve(curve, 'Weft'));
  }

  animate();
}

export function animate() {
  requestAnimationFrame(animate);
  controls.update();

  renderer.render(scene, camera);
}
