import * as Matrix from './Matrix.js';
import * as Geometry from './Geometry.js';
import * as Materials from './Materials.js';
import { initPixelControls } from './controls.js';
import { initOrthographicCamera } from './camera.js';
import { updatePixelColors } from './interaction.js';

let pixelColors = [];
let enableGrid = true;

export let canvas, scene, renderer, controls, camera, matrix;

export function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(Materials.backgroundColor);

  canvas = document.getElementById('pixel-view');

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  canvas.appendChild(renderer.domElement);

  populateScene();
}

export function populateScene() {
  matrix = Matrix.getMatrix();

  const center = {
    x: (matrix.width * Geometry.size) / 2,
    y: -(matrix.height * Geometry.size) / 2,
    z: 100,
  };

  camera = initOrthographicCamera(canvas, center);
  controls = initPixelControls(camera, renderer, center);

  if (matrix.layers === 1) {
    pixelColors = [
      [
        [Materials.canvasColors[7], Materials.canvasColors[6]],
        [Materials.canvasColors[7], Materials.canvasColors[6]],
      ],
      [
        [Materials.canvasColors[7], Materials.canvasColors[6]],
        [Materials.canvasColors[7], Materials.canvasColors[6]],
      ],
    ];
    return;
  }

  pixelColors = [[], []];
  for (let i = 0; i < (matrix.layers - (matrix.layers % 2)) / 2; i++) {
    pixelColors[0].push([Materials.canvasColors[0], Materials.canvasColors[6]]);
    pixelColors[0].push([Materials.canvasColors[1], Materials.canvasColors[6]]);
    pixelColors[1].push([Materials.canvasColors[2], Materials.canvasColors[6]]);
    pixelColors[1].push([Materials.canvasColors[3], Materials.canvasColors[6]]);
  }
  if (matrix.layers % 2 == 1) {
    pixelColors[0].push([Materials.canvasColors[4], Materials.canvasColors[6]]);
    pixelColors[1].push([Materials.canvasColors[5], Materials.canvasColors[6]]);
  }

  for (const row of matrix.matrix) {
    for (const point of row) {
      addPixelToScene(point);
    }
  }

  if (enableGrid || matrix.layers === 1) {
    for (let y = 1; y < matrix.height; y++) {
      addLineToSceneByPosition(y);
    }
    for (let x = 1; x < matrix.width; x++) {
      addLineToSceneByPosition(x, 'Vertical');
    }

    addLineToSceneByPosition(0);
    addLineToSceneByPosition(matrix.height);
    addLineToSceneByPosition(0, 'Vertical');
    addLineToSceneByPosition(matrix.width, 'Vertical');
  }

  console.log(scene);
  animate();
}

export function addPixelToScene(point) {
  const planeGeometry = new THREE.PlaneGeometry(Geometry.size, Geometry.size);
  const boxMaterial = new THREE.MeshBasicMaterial({
    color: getPixelColor(point),
  });
  const square = new THREE.Mesh(planeGeometry, boxMaterial);
  square.position.set(
    point.coords.x * Geometry.size + Geometry.size / 2,
    -point.coords.y * Geometry.size - Geometry.size / 2,
    0
  );
  square.name = 'Pixel';
  scene.add(square);
  point.pixelId = square.id;
}

export function addLineToSceneByPosition(pos, dir = 'Horizontal') {
  const points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  if (dir === 'Horizontal') {
    points.push(new THREE.Vector3(Geometry.size * matrix.width, 0, 0));
  } else if (dir === 'Vertical') {
    points.push(new THREE.Vector3(0, -Geometry.size * matrix.height, 0));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: Materials.lineColor,
    linewidth: Geometry.lineWidth,
  });

  const line = new THREE.Line(geometry, material);

  if (dir === 'Horizontal') {
    line.position.set(0, -pos * Geometry.size, 10);
  } else if (dir === 'Vertical') {
    line.position.set(pos * Geometry.size, 0, 10);
  }
  scene.add(line);
}

function updatePixel(coords) {
  scene.getObjectById(getId(coords)).material.color.set(getPixelColor(coords));
}

function getMaterial(options) {
  if (options.Material == 'Mesh') {
    return new THREE.MeshBasicMaterial({ color: options.Color });
  } else if (options.Material == 'Line') {
    return new THREE.LineBasicMaterial({ color: options.Color });
  }
}

export function getPixelColor(point) {
  if (point.coords.y % matrix.layers < point.coords.y % (matrix.layers * 2)) {
    return pixelColors[1][point.coords.x % matrix.layers][point.toggle];
  } else {
    return pixelColors[0][point.coords.x % matrix.layers][point.toggle];
  }
}

function reset(options, matrix) {
  previous = [];

  disposeHierarchy(scene);
  scene.dispose();
  renderer.renderLists.dispose();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  initPixelColors();
  initControls();
  initGrid();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  Matrix.updatePixelColors();
  updatePixelColors();

  renderer.render(scene, camera);
}
