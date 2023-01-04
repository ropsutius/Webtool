import * as Matrix from './Matrix.js';
import * as Materials from './Materials.js';
import * as ThreeDView from './threeDView.js';
import * as PixelView from './pixelView.js';
import { camFactor } from './camera.js';

const raycaster = new THREE.Raycaster();
const pointer3d = new THREE.Vector2(-1000000, -1000000);
const pointerPixel = new THREE.Vector2(-1000000, -1000000);

let hoveredOverTubes = [];
let hoveredOverPixels = [];

export function onWindowResize() {
  ThreeDView.camera.aspect =
    ThreeDView.canvas.offsetWidth / ThreeDView.canvas.offsetHeight;
  ThreeDView.camera.updateProjectionMatrix();

  PixelView.camera.left = -PixelView.canvas.offsetWidth / camFactor;
  PixelView.camera.right = PixelView.canvas.offsetWidth / camFactor;
  PixelView.camera.top = PixelView.canvas.offsetHeight / camFactor;
  PixelView.camera.bottom = -PixelView.canvas.offsetHeight / camFactor;
  PixelView.camera.updateProjectionMatrix();

  ThreeDView.renderer.setSize(
    ThreeDView.canvas.offsetWidth,
    ThreeDView.canvas.offsetHeight
  );

  PixelView.renderer.setSize(
    PixelView.canvas.offsetWidth,
    PixelView.canvas.offsetHeight
  );
}

export function onPointerMove(event, canvas) {
  const pointer =
    event.target.parentNode.id === '3d-view' ? pointer3d : pointerPixel;
  const nonTargetedPointer =
    event.target.parentNode.id === '3d-view' ? pointerPixel : pointer3d;

  pointer.x =
    ((event.clientX - canvas.offsetLeft) / canvas.offsetWidth) * 2 - 1;
  pointer.y =
    -((event.clientY - canvas.offsetTop) / canvas.offsetHeight) * 2 + 1;
  nonTargetedPointer.x = -1000000;
  nonTargetedPointer.y = -1000000;
}

export function onMouseClick(event, scene, camera) {
  const pointer =
    event.target.parentNode.id === '3d-view' ? pointer3d : pointerPixel;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (const { object } of intersects) {
    if (object.name === 'Warp') {
      Matrix.updateToggleOfSet(Matrix.getPointById(object.id));
      break;
    } else if (object.name === 'Pixel') {
      Matrix.updateToggleOfSet(Matrix.getPointById(object.id));
      break;
    }
  }
}

export function updateTubeColors() {
  for (const point of hoveredOverTubes) {
    ThreeDView.scene
      .getObjectById(point.threeDId)
      .material.color.set(Materials.warpColor);
  }
  hoveredOverTubes = [];

  raycaster.setFromCamera(pointer3d, ThreeDView.camera);
  const intersects = raycaster.intersectObjects(ThreeDView.scene.children);

  for (const { object } of intersects) {
    if (object.name !== 'Warp') continue;

    const point = Matrix.getPointById(object.id);
    const nextPoint = Matrix.getPointInNextSet(point);
    if (nextPoint !== null) {
      const nextObject = ThreeDView.scene.getObjectById(nextPoint.threeDId);
      nextObject.material.color.set(Materials.tubeHighlightColor);
      hoveredOverTubes.push(nextPoint);
    }

    object.material.color.set(Materials.tubeHighlightColor);
    hoveredOverTubes.push(point);
    break;
  }
}

export function updatePixelColors() {
  for (const point of hoveredOverPixels) {
    PixelView.scene
      .getObjectById(point.pixelId)
      .material.color.set(Materials.getPixelColor(point));
  }
  hoveredOverPixels = [];

  raycaster.setFromCamera(pointerPixel, PixelView.camera);
  const intersects = raycaster.intersectObjects(PixelView.scene.children, true);

  for (const { object } of intersects) {
    if (object.type === 'Mesh') {
      const point = Matrix.getPointById(object.id);
      object.material.color.set(Materials.highlightColor[point.toggle]);
      hoveredOverPixels.push(point);
      break;
    }
  }
}
