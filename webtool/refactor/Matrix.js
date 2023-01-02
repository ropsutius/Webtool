import * as Geometry from './Geometry.js';
import { clearScene, populateScene, scene } from './threeDView.js';
import { initBlankWeave, initPlainWeave } from '../weaves/weaves.js';

const matrix = {};

const pointRegex = new RegExp(/^1*0*$/);

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

function clearMatrixIds() {
  matrix.matrix.map((row) => row.map((point) => (point.id = undefined)));
}

export function updateLayers(layers) {
  if (layers === 4) matrix.layers = 1;
  else matrix.layers += 1;

  clearMatrixIds();
  clearScene();
  populateScene();
}

//not used
function testMatrix(matrix) {
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
  const currentPointHeight = getHeight(currentPoint);
  if (currentPointHeight === null) return;

  let previousPoint = getPointInPreviousSet(currentPoint);
  let previousPointHeight;
  if (previousPoint !== null) previousPointHeight = getHeight(previousPoint);
  else
    previousPointHeight =
      matrix.layers - (currentPoint.coords.x % matrix.layers) - 1;

  const warp = matrix.layers - (currentPoint.coords.x % matrix.layers) - 1;

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

export function getMatrixToggles() {
  return {
    matrix: matrix.matrix.map((row) => row.map((point) => point.toggle)),
    width: matrix.width,
    height: matrix.height,
  };
}

function getHeight(point) {
  const string = getSetString(point);
  return pointRegex.test(string) ? string.lastIndexOf('1') + 1 : null;
}

function getSetOfPoints(point) {
  const set = [];
  let primePointIndex;
  const startPoint =
    matrix.matrix[point.coords.y - (point.coords.y % matrix.layers)][
      point.coords.x
    ];
  for (let i = 0; i < matrix.layers; i++) {
    set.push(matrix.matrix[startPoint.coords.y + i][startPoint.coords.x]);
    if (
      isPrimePoint(matrix.matrix[startPoint.coords.y + i][startPoint.coords.x])
    ) {
      primePointIndex = i;
    }
  }

  return { points: set, primePointIndex, length: set.length };
}

function getSetString(point) {
  const set = getSetOfPoints(point);
  return set.points.reduce(
    (string, point) => (string += point.toggle.toString()),
    ''
  );
}

export function isPrimePoint(point) {
  return (
    (point.coords.x % matrix.layers) + (point.coords.y % matrix.layers) ===
    matrix.layers - 1
  );
}

function getPointByCoordinates(coords) {
  return matrix.matrix[coords.y][coords.x];
}

export function getPointById(id) {
  return matrix.matrix.flat().find((point) => point.id === id);
}

function getPointInPreviousSet(point) {
  return point.coords.y < matrix.layers
    ? null
    : getPointByCoordinates({
        y: point.coords.y - matrix.layers,
        x: point.coords.x,
      });
}

export function getPointInNextSet(point) {
  return point.coords.y > matrix.height - matrix.layers - 1
    ? null
    : getPointByCoordinates({
        y: point.coords.y + matrix.layers,
        x: point.coords.x,
      });
}

export function getNextSet(set) {
  const lastPoint = set.points[set.length - 1];
  if (!matrix.matrix[lastPoint.coords.y + 1]) return null;

  return getSetOfPoints(
    matrix.matrix[lastPoint.coords.y + 1][lastPoint.coords.x]
  );
}

export function updateToggleOfSet(point) {
  const string = getSetString(point);
  const index = string.lastIndexOf('1');
  const set = getSetOfPoints(point);

  if (index === set.length - 1) {
    for (point of set.points) {
      point.toggle = 0;
      matrix.changedPoints.push(point);
    }
  } else {
    set.points[index + 1].toggle = 1;
    matrix.changedPoints.push(set.points[index + 1]);
  }
}

export function updateTubeHeights() {
  for (const point of matrix.changedPoints) {
    const set = getSetOfPoints(point);
    updateTubeOfSet(set);

    const nextSet = getNextSet(set);
    if (!nextSet) continue;
    updateTubeOfSet(nextSet);
  }
  matrix.changedPoints = [];
}

function updateTubeOfSet(set) {
  const primePoint = set.points[set.primePointIndex];
  const curve = getWarpPoints(primePoint);

  const tube = scene.getObjectById(primePoint.id);
  Geometry.updateTube(tube, curve);
}
