import * as Geometry from './Geometry.js';

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

  switch (options.weave) {
    case 'blank':
      for (let i = 0; i < matrix.height; i++) {
        matrix.matrix[i] = [];
        for (let k = 0; k < matrix.width; k++) {
          matrix.matrix[i][k] = { toggle: 0, id: undefined };
        }
      }
      break;

    case 'plain':
      let weave = weaves[options.weave][matrix.layers - 1];
      for (let y = 0; y < y; y++) {
        matrix.matrix[y] = [];
        for (let x = 0; x < x / weave.length; x++) {
          matrix.matrix[y] = matrix.matrix[y].concat(weave[y % weave.length]);
        }
      }
      break;
  }
}

export function getMatrix() {
  return matrix;
}

export function setMatrix(matrix) {
  if (testMatrix(matrix)) {
    matrix = matrix;
    y = matrix.length;
    x = matrix[0].length;
  }
}

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

export function getSaveData() {
  let string = '';
  for (let i = 0; i < y - 1; i++) {
    string += matrix[i].toString() + ';';
  }
  return string + matrix[y - 1].toString();
}

export function reset(options, matrix = []) {
  if (matrix.length == 0) {
    initMatrix(options);
  } else {
    setMatrix(matrix);
  }
}

export function isPrimePoint(point) {
  return (
    (point.x % matrix.layers) + (point.y % matrix.layers) === matrix.layers - 1
  );
}

export function getWarpPoints(currentPoint) {
  let currentPointHeight = getHeight(currentPoint);
  if (currentPointHeight === null) return;

  let previousPoint = getPreviousSet(currentPoint);
  let previousPointHeight;
  if (previousPoint !== null) previousPointHeight = getHeight(previousPoint);
  else
    previousPointHeight = matrix.layers - (currentPoint.x % matrix.layers) - 1;

  let warp = matrix.layers - (currentPoint.x % matrix.layers) - 1;
  let previousPointY =
    Geometry.warpHeight * previousPointHeight + warp * Geometry.layerOffset;
  let currentPointY =
    Geometry.warpHeight * currentPointHeight + warp * Geometry.layerOffset;

  if (currentPointHeight < warp) {
    currentPointY -= (warp - currentPointHeight) * layerOffset;
  } else if (currentPointHeight > warp + 1) {
    currentPointY += (currentPointHeight - warp - 1) * layerOffset;
  }

  if (previousPointHeight < warp) {
    previousPointY -= (warp - previousPointHeight) * layerOffset;
  } else if (previousPointHeight > warp + 1) {
    previousPointY += (previousPointHeight - warp - 1) * layerOffset;
  }

  let middleY =
    Math.abs(currentPointY - previousPointY) / 2 +
    Math.min(previousPointY, currentPointY);
  const x =
    ((currentPoint.x - (currentPoint.x % matrix.layers)) / matrix.layers) *
    Geometry.weftLength;
  const z =
    ((currentPoint.y - (currentPoint.y % matrix.layers)) / matrix.layers) *
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

function getHeight(coords) {
  let string = getSetString(coords);
  return okList[matrix.layers - 1].includes(string)
    ? okList[matrix.layers - 1].indexOf(string)
    : null;
}

function getSetString(coords) {
  let point = getStartPoint(coords);
  let string = getToggle(point).toString();
  for (let i = 1; i < matrix.layers; i++) {
    point = getNextPointInSet(point);
    string += getToggle(point).toString();
  }
  return string;
}

function getStartPoint(point) {
  if (isStartPoint(point)) return point;

  for (let i = 1; i < matrix.layers; i++) {
    point = getNextPointInSet(point);
    if (isStartPoint(point)) return point;
  }
}

function isStartPoint(coords) {
  return coords.y % matrix.layers === 0;
}

function getToggle(coords) {
  return matrix.matrix[coords.y][coords.x].toggle;
}

function getPreviousSet(coords) {
  return coords.y < matrix.layers
    ? null
    : { y: coords.y - matrix.layers, x: coords.x };
}

function getNextSet(coords) {
  return coords.y > matrix.y - matrix.layers - 1
    ? null
    : { y: coords.y + matrix.layers, x: coords.x };
}

export function resetChangedPoints() {
  matrix.changedPoints = [];
}

export function rotateToggle(coords) {
  console.log(coords);
  let point = getStartPoint(coords);
  for (let i = 0; i < matrix.layers; i++) {
    if (getToggle(point) == 0) {
      tryToggle(point);
      return;
    }
    point = getNextPointInSet(point);
  }
  point = getPreviousPointInSet(point);
  for (let i = 0; i < app.layers; i++) {
    if (getToggle(point) == 1) {
      tryToggle(point);
    }
    point = getPreviousPointInSet(point);
  }
}

export function getCoordinatesById(id) {
  for (let i = 0; i < matrix.height; i++) {
    const index = matrix.matrix[i].map((point) => point.id).indexOf(id);
    if (index > -1) return { y: i, x: index };
  }
  return null;
}

export function tryToggle(coords) {
  toggle(coords);
  let string = getSetString(coords);
  if (!okList[app.layers - 1].includes(string)) {
    toggle(coords);
  } else {
    app.changed3D.push(coords);
    app.changedPixel.push(coords);
  }
}

export function toggle(coords) {
  if (getToggle(coords) === 0) {
    matrix.matrix[coords.y][coords.x] = 1;
  } else {
    matrix.matrix[coords.y][coords.x] = 0;
  }
}
