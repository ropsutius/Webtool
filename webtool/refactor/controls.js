import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';

export function initControls(camera, renderer, center) {
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
