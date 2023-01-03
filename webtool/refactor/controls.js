import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';

export function initThreeDControls(camera, renderer, center) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 25;
  controls.maxDistance = 1000;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.PAN,
    RIGHT: THREE.MOUSE.ROTATE,
  };
  controls.zoomSpeed = 0.6;
  controls.target = new THREE.Vector3(center.x, center.y, center.z);

  return controls;
}

export function initPixelControls(camera, renderer, center) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableRotate = false;
  controls.screenSpacePanning = true;
  controls.minZoom = 0.2;
  controls.maxZoom = 2;
  controls.mouseButtons = {
    RIGHT: THREE.MOUSE.PAN,
  };
  controls.target = new THREE.Vector3(center.x, center.y, 0);

  return controls;
}
