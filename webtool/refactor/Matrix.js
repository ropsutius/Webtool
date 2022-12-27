import * as Geometry from './Geometry.js';
import { scene } from './threeDView.js';

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
          matrix.matrix[i][k] = {
            toggle: 0,
            id: undefined,
            coords: { x: i, y: k },
          };
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

function getStartPoint(point) {
  if (isStartPoint(point)) return point;

  for (let i = 1; i < matrix.layers; i++) {
    point = getNextPointInSet(point);
    if (isStartPoint(point)) return point;
  }
}

export function getPointByCoordinates(coords) {
  return matrix.matrix[coords.y][coords.x];
}

function isStartPoint(point) {
  return point.coords.y % matrix.layers === 0;
}

function getPreviousSet(point) {
  return point.coords.y < matrix.layers
    ? null
    : getPointByCoordinates({
        y: point.coords.y - matrix.layers,
        x: point.coords.x,
      });
}

function getNextSet(point) {
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

export function getPointById(id) {
  return matrix.matrix.flat().find((point) => point.id === id);
}

export function tryToggle(point) {
  toggle(point);
  let string = getSetString(point);
  if (!okList[matrix.layers - 1].includes(string)) toggle(point);
  else matrix.changedPoints.push(point);
}

export function toggle(point) {
  if (point.toggle === 0) point.toggle = 1;
  else point.toggle = 0;
}

export function getNextPointInSet(point) {
  return !isLastPoint(point)
    ? getPointByCoordinates({ x: point.coords.x, y: point.coords.y + 1 })
    : getPointByCoordinates({
        x: point.coords.x,
        y: point.coords.y - matrix.layers + 1,
      });
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

export function getPrimePoint(point) {
  while (!isPrimePoint(point)) {
    point = getNextPointInSet(point);
  }
  return point;
}

export function updateTubes() {
  for (const point of matrix.changedPoints) {
    const curve = getWarpPoints(getPrimePoint(point));
    if (!curve) continue;

    const tube = scene.getObjectById(point.id);
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

  /*for (let i = 0; i < previous.length; i++) {
    resetTubeColor(previous[i]);
  }
  previous = [];

  let intersects = getSetByMouse();
  for (let i = 0; i < intersects.length; i++) {
    let curr = intersects[i].object;
    if (curr.name == 'Warp') {
      let currC = getCoordinatesById(curr.id);
      let nextC = getNextSet(currC);
      if (nextC != null) {
        let next = scene.getObjectById(getId(nextC));
        next.material.color.set(highlightColor[1]);
        previous.push(nextC);
      }

      curr.material.color.set(highlightColor[1]);
      previous.push(currC);
      break;
    }
  }*/
}
