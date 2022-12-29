import * as Geometry from './Geometry.js';
import { scene } from './threeDView.js';
import { initBlankWeave, initPlainWeave } from '../weaves/weaves.js';

const matrix = {};
const okList = [
  ['0', '1'],
  ['00', '10', '11'],
  ['000', '100', '110', '111'],
  ['0000', '1000', '1100', '1110', '1111'],
];

export function initMatrix(options) {
  matrix.height = options.height;
  matrix.width = options.width;
  matrix.layers = options.layers;
  matrix.matrix = [];
  matrix.changedPoints = [];
  matrix.hoveredOverPoints = [];

  switch (options.weave) {
    case 'blank':
      initBlankWeave(matrix);
      break;

    case 'plain':
      initPlainWeave(matrix, options);
      break;
  }
}

export function getMatrix() {
  return matrix;
}

export function updateMatrix(newMatrix) {
  matrix.matrix = newMatrix.matrix;
  matrix.height = newMatrix.height;
  matrix.width = newMatrix.width;
  matrix.layers = newMatrix.layers;

  matrix.changedPoints = [];
  matrix.hoveredOverPoints = [];
}

export function getMatrixToggles() {
  return {
    matrix: matrix.matrix.map((row) => row.map((point) => point.toggle)),
    width: matrix.width,
    height: matrix.height,
  };
}

//not used
export function testMatrix(matrix) {
  if (matrix.length % matrix.layers == 0) {
    let length = matrix[0].length;
    for (let i = 1; i < matrix.length; i++) {
      if (matrix[i].length != length) {
        return false;
      }
    }
    return true;
  } else return false;
}

export function getWarpPoints(currentPoint) {
  let currentPointHeight = getHeight(currentPoint);
  if (currentPointHeight === null) return;

  let previousPoint = getPreviousSet(currentPoint);
  let previousPointHeight;
  if (previousPoint !== null) previousPointHeight = getHeight(previousPoint);
  else
    previousPointHeight =
      matrix.layers - (currentPoint.coords.x % matrix.layers) - 1;

  let warp = matrix.layers - (currentPoint.coords.x % matrix.layers) - 1;
  let previousPointY =
    Geometry.warpHeight * previousPointHeight + warp * Geometry.layerOffset;
  let currentPointY =
    Geometry.warpHeight * currentPointHeight + warp * Geometry.layerOffset;

  if (currentPointHeight < warp) {
    currentPointY -= (warp - currentPointHeight) * Geometry.layerOffset;
  } else if (currentPointHeight > warp + 1) {
    currentPointY += (currentPointHeight - warp - 1) * Geometry.layerOffset;
  }

  if (previousPointHeight < warp) {
    previousPointY -= (warp - previousPointHeight) * Geometry.layerOffset;
  } else if (previousPointHeight > warp + 1) {
    previousPointY += (previousPointHeight - warp - 1) * Geometry.layerOffset;
  }

  let middleY =
    Math.abs(currentPointY - previousPointY) / 2 +
    Math.min(previousPointY, currentPointY);
  const x =
    ((currentPoint.coords.x - (currentPoint.coords.x % matrix.layers)) /
      matrix.layers) *
    Geometry.weftLength;
  const z =
    ((currentPoint.coords.y - (currentPoint.coords.y % matrix.layers)) /
      matrix.layers) *
    Geometry.warpLength;

  return [
    new THREE.Vector3(x, previousPointY, Geometry.warp[0] + z),
    new THREE.Vector3(x, previousPointY, Geometry.warp[1] + z),
    new THREE.Vector3(x, middleY, Geometry.warp[2] + z),
    new THREE.Vector3(x, currentPointY, Geometry.warp[3] + z),
    new THREE.Vector3(x, currentPointY, Geometry.warp[4] + z),
  ];
}

export function* getWeftPoints() {
  let x, y, z;
  for (let i = 0; i < matrix.height; i++) {
    x = [
      -Geometry.tubeRadius * 2,
      ((matrix.width - 1) * Geometry.weftLength) / matrix.layers +
        Geometry.tubeRadius,
    ];
    y =
      Geometry.warpHeight * (i % matrix.layers) +
      Geometry.warpHeight / 2 +
      (i % matrix.layers) * Geometry.layerOffset;
    z =
      ((i - (i % matrix.layers)) / matrix.layers) * Geometry.warpLength +
      Geometry.warpLength;
    yield [new THREE.Vector3(x[0], y, z), new THREE.Vector3(x[1], y, z)];
  }
}

function getHeight(point) {
  let string = getSetString(point);
  return okList[matrix.layers - 1].includes(string)
    ? okList[matrix.layers - 1].indexOf(string)
    : null;
}

function getSetString(point) {
  let startPoint = getStartPoint(point);
  let string = startPoint.toggle.toString();

  for (let i = 1; i < matrix.layers; i++) {
    startPoint = getNextPointInSet(startPoint);
    string += startPoint.toggle.toString();
  }
  return string;
}

function isStartPoint(point) {
  return point.coords.y % matrix.layers === 0;
}

export function isLastPoint(point) {
  return point.coords.y % matrix.layers === matrix.layers - 1;
}

export function isPrimePoint(point) {
  return (
    (point.coords.x % matrix.layers) + (point.coords.y % matrix.layers) ===
    matrix.layers - 1
  );
}

export function getPointByCoordinates(coords) {
  return matrix.matrix[coords.y][coords.x];
}

export function getPointById(id) {
  return matrix.matrix.flat().find((point) => point.id === id);
}

export function getPrimePoint(point) {
  while (!isPrimePoint(point)) {
    point = getNextPointInSet(point);
  }
  return point;
}

function getStartPoint(point) {
  if (isStartPoint(point)) return point;

  for (let i = 1; i < matrix.layers; i++) {
    point = getNextPointInSet(point);
    if (isStartPoint(point)) return point;
  }
}

export function getPreviousPointInSet(point) {
  return !isStartPoint(point)
    ? getPointByCoordinates({ x: point.coords.x, y: point.coords.y - 1 })
    : getPointByCoordinates({
        x: point.coords.x,
        y: point.coords.y + matrix.layers - 1,
      });
}

export function getNextPointInSet(point) {
  return !isLastPoint(point)
    ? getPointByCoordinates({ x: point.coords.x, y: point.coords.y + 1 })
    : getPointByCoordinates({
        x: point.coords.x,
        y: point.coords.y - matrix.layers + 1,
      });
}

function getPreviousSet(point) {
  return point.coords.y < matrix.layers
    ? null
    : getPointByCoordinates({
        y: point.coords.y - matrix.layers,
        x: point.coords.x,
      });
}

export function getNextSet(point) {
  return point.coords.y > matrix.height - matrix.layers - 1
    ? null
    : getPointByCoordinates({
        y: point.coords.y + matrix.layers,
        x: point.coords.x,
      });
}

export function rotateToggle(point) {
  let startPoint = getStartPoint(point);
  for (let i = 0; i < matrix.layers; i++) {
    if (startPoint.toggle === 0) {
      tryToggle(startPoint);
      return;
    }
    startPoint = getNextPointInSet(startPoint);
  }
  let previousPoint = getPreviousPointInSet(startPoint);
  for (let i = 0; i < matrix.layers; i++) {
    if (previousPoint.toggle === 1) {
      tryToggle(previousPoint);
    }
    previousPoint = getPreviousPointInSet(previousPoint);
  }
}

export function tryToggle(point) {
  point.toggle = point.toggle === 0 ? 1 : 0;

  let string = getSetString(point);
  if (!okList[matrix.layers - 1].includes(string))
    point.toggle = point.toggle === 0 ? 1 : 0;
  else matrix.changedPoints.push(point);
}

export function updateTubeHeights() {
  for (const point of matrix.changedPoints) {
    const curve = getWarpPoints(getPrimePoint(point));
    if (!curve) continue;

    const tube = scene.getObjectById(point.id);
    console.log(point, tube, curve);
    Geometry.updateTube(tube, curve);

    const nextPoint = getNextSet(point);
    if (nextPoint) {
      const nextCurve = getWarpPoints(getPrimePoint(nextPoint));
      if (!nextCurve) continue;

      const nextTube = scene.getObjectById(nextPoint.id);
      Geometry.updateTube(nextTube, nextCurve);
    }
  }
  matrix.changedPoints = [];
}
