import { getMatrix } from './Matrix.js';

export const backgroundColor = 0xf5f5f5;
export const highlightColor = [0xee9999, 0xcc4444];
export const tubeHighlightColor = 0xcc4444;

export const warpColor = 0x4444ff;
export const weftColor = 0x77cc77;
export const lightColor = 0x404040;

export const multilayeredCanvasColors = [
  0xffffdd, 0xffdddd, 0xddddff, 0xddffdd, 0xddffff, 0xffddff,
];
export const toggledPixel = 0x303030;
export const unToggledPixel = 0xffffff;
export const lineColor = 0x000000;

let pixelColors;

export function updatePixelColors() {
  const matrix = getMatrix();
  switch (matrix.layers) {
    case 1:
      pixelColors = [
        [
          [unToggledPixel, toggledPixel],
          [unToggledPixel, toggledPixel],
        ],
        [
          [unToggledPixel, toggledPixel],
          [unToggledPixel, toggledPixel],
        ],
      ];
      break;
    default:
      pixelColors = [[], []];
      for (let i = 0; i < (matrix.layers - (matrix.layers % 2)) / 2; i++) {
        pixelColors[0].push([multilayeredCanvasColors[0], toggledPixel]);
        pixelColors[0].push([multilayeredCanvasColors[1], toggledPixel]);
        pixelColors[1].push([multilayeredCanvasColors[2], toggledPixel]);
        pixelColors[1].push([multilayeredCanvasColors[3], toggledPixel]);
      }
      if (matrix.layers % 2 === 1) {
        pixelColors[0].push([multilayeredCanvasColors[4], toggledPixel]);
        pixelColors[1].push([multilayeredCanvasColors[5], toggledPixel]);
      }
      break;
  }
}

export function getPixelColor(point) {
  const matrix = getMatrix();
  if (point.coords.y % matrix.layers < point.coords.y % (matrix.layers * 2)) {
    return pixelColors[1][point.coords.x % matrix.layers][point.toggle];
  } else {
    return pixelColors[0][point.coords.x % matrix.layers][point.toggle];
  }
}
