import UTIF from 'utif';
import UPNG from 'upng-js';
import { getMatrix } from './Matrix.js';
import { addSavedProject } from './services/projectService.js';

export function uploadProject(event) {
  event.preventDefault();

  const matrix = getMatrix();
  addSavedProject(matrix);
}

export function exportProject(event) {
  event.preventDefault();

  const fileName = event.target[0].value;
  if (fileName === null || fileName === '') return;

  const extension = event.target[1].value;

  const matrix = getMatrix();

  let url;
  switch (extension) {
    case 'png':
      const pngColorMatrix = new Uint32Array(
        matrix.matrix
          .flat()
          .map((point) => (point.toggle === 0 ? 0xffffffff : 0xff000000))
      );

      const pngFile = UPNG.encode(
        [pngColorMatrix.buffer],
        matrix.width,
        matrix.height,
        0
      );

      const pngBlob = new Blob([pngFile], { type: 'octet/stream' });
      url = window.URL.createObjectURL(pngBlob);
      break;

    case 'tif':
      const colorMatrix = new Uint32Array(
        matrix.matrix
          .flat()
          .map((point) => (point.toggle === 0 ? 0xffffffff : 0xff000000))
      );

      const tifFile = UTIF.encodeImage(
        colorMatrix.buffer,
        matrix.width,
        matrix.height
      );

      const tifBlob = new Blob([tifFile], { type: 'octet/stream' });
      url = window.URL.createObjectURL(tifBlob);
      break;

    case 'txt':
      const txtFile = matrix.getString();
      const txtBlob = new Blob([txtFile], {
        type: 'data:text/plain;charset=utf-8',
      });
      url = window.URL.createObjectURL(txtBlob);
      break;
  }

  const element = document.createElement('a');
  document.body.appendChild(element);

  element.href = url;
  element.download = `${fileName}.${extension}`;
  element.style = 'display: none';
  element.click();
  window.URL.revokeObjectURL(url);
}
