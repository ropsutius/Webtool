let changed3D = null;
let changedPixel = null;
let pv, tv, canvasP, canvas3d;
let layerCount = 3;
let matrix;
if (layerCount == 1) {
  matrix = plain_single;
} else if (layerCount == 2) {
  matrix = plain_double;
} else if (layerCount == 3) {
  matrix = plain_triple;
}

function to3dView() {
  document.getElementById("pixel-view").style.display = "none";
  document.getElementById("3d-view").style.display = "block";
  document.getElementById("3d-view").style.width = "100%";
  tv.onWindowResize();
}

function toPixelView() {
  document.getElementById("3d-view").style.display = "none";
  document.getElementById("pixel-view").style.display = "block";
  document.getElementById("pixel-view").style.width = "100%";
  pv.onWindowResize();
}

function toDualView() {
  document.getElementById("3d-view").style.display = "block";
  document.getElementById("3d-view").style.width = "50%";
  document.getElementById("pixel-view").style.display = "block";
  document.getElementById("pixel-view").style.width = "50%";
  pv.onWindowResize();
  tv.onWindowResize();
}

function loadLayer() {
  if (layerCount == 1) {
    layerCount = 2;
  } else if (layerCount == 2) {
    layerCount = 3;
  } else if (layerCount == 3) {
    layerCount = 1;
  }

  pv.layers = layerCount;
  tv.layers = layerCount;
  pv.reset();
  tv.reset();

  // canvas3d.removeChild(canvas3d.childNodes[0]);
  // canvas3d = document.getElementById("3d-view");
  // tv = new ThreeDView(canvas3d, { Layers: layerCount });
}

function exportTIFF() {
  let name = prompt("Please enter the name of the file", "Example");
  if (name != null && name != "") {
    let colorMatrix = new Uint32Array(matrix.length * matrix[0].length);
    let index = 0;
    for (let i = 0; i < matrix.length; i++) {
      for (let k = 0; k < matrix[i].length; k++) {
        if (matrix[i][k] == 0) {
          colorMatrix[index] = 0xffffffff;
        } else {
          colorMatrix[index] = 0xff000000;
        }
        index++;
      }
    }
    let file = UTIF.encodeImage(
      colorMatrix.buffer,
      matrix[0].length,
      matrix.length
    );

    var saveTIFF = (function() {
      let element = document.createElement("a");
      document.body.appendChild(element);
      element.style = "display: none";
      return function(data, name) {
        let blob = new Blob(data, { type: "octet/stream" }),
          url = window.URL.createObjectURL(blob);
        element.href = url;
        element.download = name;
        element.click();
        window.URL.revokeObjectURL(url);
      };
    })();
    saveTIFF([file], name + ".tif");
  }
}
