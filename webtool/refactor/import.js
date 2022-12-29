import { initBlankWeave, initPlainWeave } from '../weaves/weaves.js';
import { updateMatrix } from './Matrix.js';
import { clearScene, populateScene } from './threeDView.js';

export function importProject(event) {
  event.preventDefault();

  var file = event.target[0].files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const contents = event.target.result;
    const array = contents.split(';');

    const matrix = array.map((row, y) =>
      row.split(',').map((point, x) => ({
        toggle: parseInt(point),
        id: undefined,
        coords: { x, y },
      }))
    );
    const newMatrix = {
      matrix,
      height: matrix.length,
      width: matrix[0].length,
      layers: 1,
    };

    //UPDATE SCENE WITH THE NEW MATRIX
    updateMatrix(newMatrix);
    clearScene();
    populateScene();
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
  clearScene();
  populateScene();
}
