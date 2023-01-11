import * as THREE from "three";
import * as ThreeDView from "./threeDView.js";
import * as PixelView from "./pixelView.js";
import {
  updateToggleOfSet,
  getPointById,
  getPointInNextSet,
} from "./Matrix.js";
import {
  highlightColor,
  tubeHighlightColor,
  getPixelColor,
  warpColor,
} from "./Materials.js";
import { camFactor } from "./camera.js";

const raycaster = new THREE.Raycaster();
const pointer3d = new THREE.Vector2(-1000000, -1000000);
const pointerPixel = new THREE.Vector2(-1000000, -1000000);
let isPointerInViewport = false;

let hoveredOverTubes = [];
let hoveredOverPixels = [];

export function onWindowResize() {
  ThreeDView.renderer.setSize(
    ThreeDView.canvas.clientWidth,
    ThreeDView.canvas.clientHeight,
    false
  );

  PixelView.renderer.setSize(
    PixelView.canvas.clientWidth,
    PixelView.canvas.clientHeight,
    false
  );

  ThreeDView.camera.aspect =
    ThreeDView.canvas.clientWidth / ThreeDView.canvas.clientHeight;
  ThreeDView.camera.updateProjectionMatrix();

  PixelView.camera.left = -PixelView.canvas.clientWidth / camFactor;
  PixelView.camera.right = PixelView.canvas.clientWidth / camFactor;
  PixelView.camera.top = PixelView.canvas.clientHeight / camFactor;
  PixelView.camera.bottom = -PixelView.canvas.clientHeight / camFactor;
  PixelView.camera.updateProjectionMatrix();
}

export function onPointerEnter() {
  isPointerInViewport = true;
}

export function onPointerLeave() {
  isPointerInViewport = false;
}

export function onPointerMove(event) {
  const pointer = event.target.id === "3d-view" ? pointer3d : pointerPixel;
  const nonTargetedPointer =
    event.target.id === "3d-view" ? pointerPixel : pointer3d;

  pointer.x =
    ((event.clientX - event.target.offsetLeft) / event.target.offsetWidth) * 2 -
    1;
  pointer.y =
    -((event.clientY - event.target.offsetTop) / event.target.offsetHeight) *
      2 +
    1;

  nonTargetedPointer.x = -1000000;
  nonTargetedPointer.y = -1000000;
}

export function onMouseClick(event) {
  const target = event.target.id === "3d-view" ? ThreeDView : PixelView;
  const pointer = event.target.id === "3d-view" ? pointer3d : pointerPixel;

  raycaster.setFromCamera(pointer, target.camera);
  const intersects = raycaster.intersectObjects(target.scene.children);

  for (const { object } of intersects) {
    if (object.name === "Warp") {
      updateToggleOfSet(getPointById(object.id));
      break;
    } else if (object.name === "Pixel") {
      updateToggleOfSet(getPointById(object.id));
      break;
    }
  }
}

export function updateTubeColors() {
  if (!isPointerInViewport) return;

  for (const point of hoveredOverTubes) {
    ThreeDView.scene
      .getObjectById(point.threeDId)
      .material.color.set(warpColor);
  }
  hoveredOverTubes = [];

  raycaster.setFromCamera(pointer3d, ThreeDView.camera);
  const intersects = raycaster.intersectObjects(ThreeDView.scene.children);

  for (const { object } of intersects) {
    if (object.name !== "Warp") continue;

    const point = getPointById(object.id);
    const nextPoint = getPointInNextSet(point);
    if (nextPoint !== null) {
      const nextObject = ThreeDView.scene.getObjectById(nextPoint.threeDId);
      nextObject.material.color.set(tubeHighlightColor);
      hoveredOverTubes.push(nextPoint);
    }

    object.material.color.set(tubeHighlightColor);
    hoveredOverTubes.push(point);
    break;
  }
}

export function updatePixelColors() {
  if (!isPointerInViewport) return;

  for (const point of hoveredOverPixels) {
    PixelView.scene
      .getObjectById(point.pixelId)
      .material.color.set(getPixelColor(point));
  }
  hoveredOverPixels = [];

  raycaster.setFromCamera(pointerPixel, PixelView.camera);
  const intersects = raycaster.intersectObjects(PixelView.scene.children, true);

  for (const { object } of intersects) {
    if (object.type === "Mesh") {
      const point = getPointById(object.id);
      object.material.color.set(highlightColor[point.toggle]);
      hoveredOverPixels.push(point);
      break;
    }
  }
}
