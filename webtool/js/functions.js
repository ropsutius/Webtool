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
