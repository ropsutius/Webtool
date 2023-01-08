import { getMatrix } from './Matrix.js';
import { pixelSize, lineWidth } from './Geometry.js';
import {
  updatePixelColors,
  getPixelColor,
  backgroundColor,
  lineColor,
} from './Materials.js';
import { initPixelControls } from './controls.js';
import { initOrthographicCamera } from './camera.js';

let isGridEnabled = true;

export let canvas, scene, renderer, controls, camera, matrix;

export function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(backgroundColor);

  canvas = document.getElementById('pixel-view');
  renderer = new THREE.WebGLRenderer({ canvas });

  populateScene();
}

export function populateScene() {
  matrix = getMatrix();

  const center = {
    x: (matrix.width * pixelSize) / 2,
    y: -(matrix.height * pixelSize) / 2,
    z: 100,
  };

  camera = initOrthographicCamera(canvas, center);
  controls = initPixelControls(camera, renderer, center);

  updatePixelColors();

  addPixelsToScene();

  if (isGridEnabled || matrix.layers === 1) addGridToScene();

  console.log(scene);
}

function addPixelsToScene() {
  for (const row of matrix.matrix) {
    for (const point of row) {
      const planeGeometry = new THREE.PlaneGeometry(pixelSize, pixelSize);
      const boxMaterial = new THREE.MeshBasicMaterial({
        color: getPixelColor(point),
      });
      const square = new THREE.Mesh(planeGeometry, boxMaterial);
      square.position.set(
        point.coords.x * pixelSize + pixelSize / 2,
        -point.coords.y * pixelSize - pixelSize / 2,
        0
      );
      square.name = 'Pixel';
      scene.add(square);
      point.pixelId = square.id;
    }
  }
}

function addGridToScene() {
  for (let y = 0; y <= matrix.height; y++) {
    addLineToSceneByPosition(y);
  }
  for (let x = 0; x <= matrix.width; x++) {
    addLineToSceneByPosition(x, 'Vertical');
  }
}

function addLineToSceneByPosition(position, direction = 'Horizontal') {
  const points = [];
  points.push(new THREE.Vector3(0, 0, 0));
  if (direction === 'Horizontal') {
    points.push(new THREE.Vector3(pixelSize * matrix.width, 0, 0));
  } else if (direction === 'Vertical') {
    points.push(new THREE.Vector3(0, -pixelSize * matrix.height, 0));
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color: lineColor,
    linewidth: lineWidth,
  });

  const line = new THREE.Line(geometry, material);

  if (direction === 'Horizontal') {
    line.position.set(0, -position * pixelSize, 10);
  } else if (direction === 'Vertical') {
    line.position.set(position * pixelSize, 0, 10);
  }
  scene.add(line);
}

export function clearScene() {
  scene.remove.apply(scene, scene.children);
}
