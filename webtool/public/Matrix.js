import * as ThreeDView from './threeDView.js';
import * as PixelView from './pixelView.js';
import {
  weftLength,
  warpLength,
  warpPoints,
  warpOffset,
  tubeRadius,
  layerOffset,
  updateTube,
} from './Geometry.js';
import { getPixelColor } from './Materials.js';
import { initBlankWeave, initPlainWeave } from './weaves/weaves.js';

const matrix = {
  height: 0,
  width: 0,
  layers: 0,
  matrix: [],
  changedPoints: { tubes: [], pixels: [] },
  hoveredOverPoints: [],
  getToggles() {
    return this.matrix.map((row) => row.map((point) => point.toggle));
  },
  getString() {
    return this.getToggles()
      .map((row) => row.toString())
      .join(';');
  },
  testMatrix() {
    if (this.width % this.layers !== 0 || this.width % this.layers !== 0)
      return false;

    for (const row of this.matrix) {
      for (const point of row) {
        if (!pointRegex.test(getSetString(point))) return false;
      }
    }
    return true;
  },
  clearIds() {
    for (const row of this.matrix) {
      for (const point of row) {
        point.threeDId = undefined;
        point.pixelId = undefined;
      }
    }
  },
};

const pointRegex = new RegExp(/^1*0*$/);

export function initMatrix(options) {
  matrix.height = options.height;
  matrix.width = options.width;
  matrix.layers = options.layers;

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

  matrix.changedPoints = { tubes: [], pixels: [] };
  matrix.hoveredOverPoints = [];
}

export function updateLayers() {
  if (matrix.layers === 4) matrix.layers = 1;
  else matrix.layers += 1;

  matrix.clearIds();

  ThreeDView.clearScene();
  if (matrix.testMatrix()) ThreeDView.populateScene();
  else alert(`Unable to convert current weave to ${matrix.layers} layers`);

  PixelView.clearScene();
  PixelView.populateScene();
}

export function getWarpPoints(currentPoint) {
  const currentPointHeight = getHeight(currentPoint);
  if (currentPointHeight === null) return;

  const previousPoint = getPointByCoordinates({
    y: currentPoint.coords.y - matrix.layers,
    x: currentPoint.coords.x,
  });

  const warpHeight =
    matrix.layers - (currentPoint.coords.x % matrix.layers) - 1;

  const previousPointHeight =
    previousPoint !== null ? getHeight(previousPoint) : warpHeight;

  let currentPointY =
    currentPointHeight * warpOffset + warpHeight * layerOffset;

  if (currentPointHeight < warpHeight) {
    currentPointY -= (warpHeight - currentPointHeight) * layerOffset;
  } else if (currentPointHeight > warpHeight + 1) {
    currentPointY += (currentPointHeight - warpHeight - 1) * layerOffset;
  }

  let previousPointY =
    previousPointHeight * warpOffset + warpHeight * layerOffset;

  if (previousPointHeight < warpHeight) {
    previousPointY -= (warpHeight - previousPointHeight) * layerOffset;
  } else if (previousPointHeight > warpHeight + 1) {
    previousPointY += (previousPointHeight - warpHeight - 1) * layerOffset;
  }

  let middleY =
    Math.abs(currentPointY - previousPointY) / 2 +
    Math.min(previousPointY, currentPointY);

  const x =
    ((currentPoint.coords.x - (currentPoint.coords.x % matrix.layers)) /
      matrix.layers) *
    weftLength;

  const z =
    ((currentPoint.coords.y - (currentPoint.coords.y % matrix.layers)) /
      matrix.layers) *
    warpLength;

  return [
    new THREE.Vector3(x, previousPointY, warpPoints[0] + z),
    new THREE.Vector3(x, previousPointY, warpPoints[1] + z),
    new THREE.Vector3(x, middleY, warpPoints[2] + z),
    new THREE.Vector3(x, currentPointY, warpPoints[3] + z),
    new THREE.Vector3(x, currentPointY, warpPoints[4] + z),
  ];
}

export function* getWeftPoints() {
  for (let i = 0; i < matrix.height; i++) {
    const x = [
      -tubeRadius * 2,
      ((matrix.width - 1) * weftLength) / matrix.layers + tubeRadius,
    ];
    const y =
      warpOffset * (i % matrix.layers) +
      warpOffset / 2 +
      (i % matrix.layers) * layerOffset;
    const z =
      ((i - (i % matrix.layers)) / matrix.layers) * warpLength + warpLength;
    yield [new THREE.Vector3(x[0], y, z), new THREE.Vector3(x[1], y, z)];
  }
}

function getSetString(point) {
  const set = getSetOfPoints(point);
  return set.points.reduce(
    (string, point) => (string += point.toggle.toString()),
    ''
  );
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

export function isPrimePoint(point) {
  return (
    (point.coords.x % matrix.layers) + (point.coords.y % matrix.layers) ===
    matrix.layers - 1
  );
}

function getPointByCoordinates(coords) {
  return -1 < coords.x &&
    coords.x < matrix.width &&
    -1 < coords.y &&
    coords.y < matrix.height
    ? matrix.matrix[coords.y][coords.x]
    : null;
}

export function getPointById(id) {
  return matrix.matrix
    .flat()
    .find((point) => point.threeDId === id || point.pixelId === id);
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
      matrix.changedPoints.tubes.push(point);
      matrix.changedPoints.pixels.push(point);
    }
  } else {
    set.points[index + 1].toggle = 1;
    matrix.changedPoints.tubes.push(set.points[index + 1]);
    matrix.changedPoints.pixels.push(set.points[index + 1]);
  }
}

export function updateTubeHeights() {
  for (const point of matrix.changedPoints.tubes) {
    const set = getSetOfPoints(point);
    updateTubeOfSet(set);

    const nextSet = getNextSet(set);
    if (!nextSet) continue;
    updateTubeOfSet(nextSet);
  }
  matrix.changedPoints.tubes = [];
}

export function updatePixelColors() {
  for (const point of matrix.changedPoints.pixels) {
    const set = getSetOfPoints(point);
    updatePixelColorOfSet(set);
  }
  matrix.changedPoints.pixels = [];
}

function updateTubeOfSet(set) {
  const primePoint = set.points[set.primePointIndex];
  const curve = getWarpPoints(primePoint);

  const tube = ThreeDView.scene.getObjectById(primePoint.threeDId);
  updateTube(tube, curve);
}

function updatePixelColorOfSet(set) {
  for (const point of set.points) {
    PixelView.scene
      .getObjectById(point.pixelId)
      .material.color.set(getPixelColor(point));
  }
}
