import { importWeaves } from '../services/weavesService.js';

const weaves = await importWeaves();

export function initBlankWeave(matrix) {
  for (let y = 0; y < matrix.height; y++) {
    matrix.matrix[y] = [];
    for (let x = 0; x < matrix.width; x++) {
      matrix.matrix[y][x] = {
        toggle: 0,
        threeDId: undefined,
        pixelId: undefined,
        coords: { x, y },
      };
    }
  }
}

export function initPlainWeave(matrix, options) {
  const weave = weaves[options.weave][matrix.layers - 1];
  for (let y = 0; y < matrix.height; y++) {
    matrix.matrix[y] = [];
    for (let x = 0; x < matrix.width; x++) {
      matrix.matrix[y][x] = {
        toggle: weave[y % weave.length][x % weave.length],
        threeDId: undefined,
        pixelId: undefined,
        coords: { x, y },
      };
    }
  }
}

export function getPointsFromToggles(matrix) {
  return matrix.map((row, y) =>
    row.map((point, x) => ({
      toggle: point,
      threeDId: undefined,
      pixelId: undefined,
      coords: { x, y },
    }))
  );
}
