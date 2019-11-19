let changed3D = [];
let changedPixel = [];
let pv, tv, canvasP, canvas3d;
let layerCount = 2;
let matrix;
if (layerCount == 1) {
  matrix = plain_single;
} else if (layerCount == 2) {
  matrix = plain_double;
} else if (layerCount == 3) {
  matrix = plain_triple;
} else if (layerCount == 4) {
  matrix = plain_quad;
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

function openNew() {
  document.getElementById("modal").style.display = "block";
}

function closeNew() {
  document.getElementById("modal").style.display = "none";
}

function createNewCanvas() {
  let weave = document.getElementById("weave").value;
  let width = parseInt(document.getElementById("width").value);
  let height = parseInt(document.getElementById("height").value);
  let layers = parseInt(document.getElementById("layers").value);

  closeNew();

  if (width % layers != 0 || height % layers != 0) {
    alert("Canvas dimensions must match layers");
    return;
  }

  pv.reset({ Layers: layers, Width: width, Height: height, Weave: weave });
  tv.reset({ Layers: layers, Width: width, Height: height, Weave: weave });
}

function loadLayer() {
  if (pv.layers == 4) {
    pv.reset({ Layers: 1 });
    tv.reset({ Layers: 1 });
  } else {
    pv.reset({ Layers: pv.layers + 1 });
    tv.reset({ Layers: tv.layers + 1 });
  }
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
