export function saveProject() {
  let name = document.getElementById('saveName').value;
  closeSave();
  let file = matrix.getSaveData();
  let element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(file)
  );
  element.setAttribute('download', name + '.txt');

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function exportTIFF() {
  let name = document.getElementById('exportName').value;
  closeExport();
  if (name != null && name != '') {
    let colorMatrix = new Uint32Array(matrix.y * matrix.x);
    let index = 0;
    for (let i = 0; i < matrix.y; i++) {
      for (let k = 0; k < matrix.x; k++) {
        if (matrix.matrix[i][k] == 0) {
          colorMatrix[index] = 0xffffffff;
        } else {
          colorMatrix[index] = 0xff000000;
        }
        index++;
      }
    }
    let file = UTIF.encodeImage(colorMatrix.buffer, matrix.x, matrix.y);

    var saveTIFF = (function () {
      let element = document.createElement('a');
      document.body.appendChild(element);
      element.style = 'display: none';
      return function (data, name) {
        let blob = new Blob(data, { type: 'octet/stream' }),
          url = window.URL.createObjectURL(blob);
        element.href = url;
        element.download = name;
        element.click();
        window.URL.revokeObjectURL(url);
      };
    })();
    saveTIFF([file], name + '.tif');
  }
}
