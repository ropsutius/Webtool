import { UTIF } from './UTIF.js';
import { getMatrix } from './Matrix.js';

export function saveProject(event) {
  event.preventDefault();

  const fileName = event.target[0].value;
  const matrix = getMatrix();
  const file = matrix.getString();

  const element = document.createElement('a');
  document.body.appendChild(element);

  const blob = new Blob([file], { type: 'data:text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);

  element.href = url;
  element.download = fileName + '.txt';
  element.style = 'display: none';
  element.click();
  window.URL.revokeObjectURL(url);
}

export function exportProject(event) {
  event.preventDefault();
  exportTIFF(event.target[0].value);
}

function exportTIFF(fileName) {
  if (fileName === null || fileName === '') return;

  const matrix = getMatrix();

  const colorMatrix = new Uint32Array(matrix.height * matrix.width);
  let index = 0;
  for (let i = 0; i < matrix.height; i++) {
    for (let k = 0; k < matrix.width; k++) {
      if (matrix.matrix[i][k].toggle === 0) colorMatrix[index] = 0xffffffff;
      else colorMatrix[index] = 0xff000000;

      index++;
    }
  }

  const file = UTIF.encodeImage(
    colorMatrix.buffer,
    matrix.width,
    matrix.height
  );

  const element = document.createElement('a');
  document.body.appendChild(element);

  const blob = new Blob([file], { type: 'octet/stream' });
  const url = window.URL.createObjectURL(blob);

  element.href = url;
  element.download = fileName + '.tif';
  element.style = 'display: none';
  element.click();
  window.URL.revokeObjectURL(url);
}
