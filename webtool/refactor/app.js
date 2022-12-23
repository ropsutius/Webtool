import * as Matrix from './Matrix.js';
import * as ThreeDView from './threeDView.js';

export function init(options) {
  Matrix.initMatrix(options);
  ThreeDView.init();
}
