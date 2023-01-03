import * as Matrix from './Matrix.js';
import * as ThreeDView from './threeDView.js';
import * as PixelView from './pixelView.js';

export function init(options) {
  Matrix.initMatrix(options);
  ThreeDView.initScene();
  PixelView.initScene();
}
