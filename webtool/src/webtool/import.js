import {
  getPointsFromToggles,
  initBlankWeave,
  initPlainWeave,
} from './weaves/weaves.js';
import { updateMatrix } from './Matrix.js';
import * as PixelView from './pixelView.js';
import * as ThreeDView from './threeDView.js';

export function importProject(event) {
  event.preventDefault();

  var file = event.target[0].files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const contents = event.target.result;
    const toggles = contents
      .split(';')
      .map((row) => row.split(',').map((toggle) => parseInt(toggle)));

    const matrix = getPointsFromToggles(toggles);

    //UPDATE SCENE WITH THE NEW MATRIX
    updateMatrix({
      matrix,
      height: matrix.length,
      width: matrix[0].length,
      layers: 1,
    });

    PixelView.clearScene();
    ThreeDView.clearScene();

    PixelView.populateScene();
    ThreeDView.populateScene();
  };

  reader.readAsText(file);
}

export function createNewProject(event) {
  event.preventDefault();

  const layers = parseInt(event.target[0].value);
  const weave = event.target[1].value;
  const width = parseInt(event.target[2].value);
  const height = parseInt(event.target[3].value);

  const newMatrix = { matrix: [], width, height, layers };

  switch (weave) {
    case 'blank':
      initBlankWeave(newMatrix);
      break;
    case 'plain':
      initPlainWeave(newMatrix, { weave });
      break;
  }

  updateMatrix(newMatrix);

  PixelView.clearScene();
  ThreeDView.clearScene();

  PixelView.populateScene();
  ThreeDView.populateScene();
}
