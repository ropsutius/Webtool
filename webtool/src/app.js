import * as Matrix from './matrix.js';
//import * as PixelView from './pixelView.js';
import * as ThreeDView from './threeDView.js';

export let changed3D,
  changedPixel,
  layers,
  canvasPixel,
  matrix,
  threeDView,
  pixelView;

export function init(options) {
  changed3D = [];
  changedPixel = [];

  layers = options.layers;
  canvasPixel = document.getElementById('pixel-view');

  matrix = Matrix.initMatrix(options);
  threeDView = ThreeDView.init();
  //pixelView = new PixelView(this, canvasPixel);
}

export function loadLayer() {
  if (layers == 4) {
    layers = 1;
  } else {
    layers += 1;
  }
  pixelView.reset();
  threeDView.reset();
}

export function createNewCanvas() {
  closeNew();
  let layers = parseInt(document.getElementById('layers').value);
  let width = parseInt(document.getElementById('width').value);
  let height = parseInt(document.getElementById('height').value);
  let weave = document.getElementById('weave').value;

  if (width % layers != 0 || height % layers != 0) {
    alert('Canvas dimensions must match layers');
    return;
  }

  layers = parseInt(layers);
  matrix.reset({ Weave: weave, Width: width, Height: height });
  pixelView.reset();
  threeDView.reset();
}

export function openFile(e) {
  closeOpen();
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function (e) {
    var contents = e.target.result;
    app.parseFile(contents);
  };
  reader.readAsText(file);
}

export function parseFile(contents) {
  let array = contents.split(';');
  for (let i = 0; i < array.length; i++) {
    array[i] = array[i].split(',');
    for (let k = 0; k < array[i].length; k++) {
      array[i][k] = parseInt(array[i][k]);
    }
  }
  layers = 1;
  matrix.reset({}, array);
  pixelView.reset();
  threeDView.reset();
}

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
