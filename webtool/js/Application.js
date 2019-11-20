class Application {
  changed3D = [];
  changedPixel = [];

  constructor(options, matrix) {
    this.layers = options.layers;
    this.canvasPixel = document.querySelector("#pixel-view");
    this.canvas3D = document.querySelector("#threeD-view");

    this.matrix = new Matrix(this, options, matrix);
    this.threeDView = new ThreeDView(this, this.canvas3D);
    this.pixelView = new PixelView(this, this.canvasPixel);
  }

  to3dView() {
    document.getElementById("pixel-view").style.display = "none";
    document.getElementById("3d-view").style.display = "block";
    document.getElementById("3d-view").style.width = "100%";
    this.threeDView.onWindowResize();
  }

  toPixelView() {
    document.getElementById("3d-view").style.display = "none";
    document.getElementById("pixel-view").style.display = "block";
    document.getElementById("pixel-view").style.width = "100%";
    this.pixelView.onWindowResize();
  }

  toDualView() {
    document.getElementById("3d-view").style.display = "block";
    document.getElementById("3d-view").style.width = "50%";
    document.getElementById("pixel-view").style.display = "block";
    document.getElementById("pixel-view").style.width = "50%";
    this.threeDView.onWindowResize();
    this.pixelView.onWindowResize();
  }

  openNew() {
    document.getElementById("modal").style.display = "block";
  }

  closeNew() {
    document.getElementById("modal").style.display = "none";
  }

  createNewCanvas() {
    let weave = document.getElementById("weave").value;
    let width = parseInt(document.getElementById("width").value);
    let height = parseInt(document.getElementById("height").value);
    let layers = parseInt(document.getElementById("layers").value);

    this.closeNew();

    if (width % layers != 0 || height % layers != 0) {
      alert("Canvas dimensions must match layers");
      return;
    }

    this.pixelView.reset({
      Layers: layers,
      Width: width,
      Height: height,
      Weave: weave
    });
    this.threeDView.reset({
      Layers: layers,
      Width: width,
      Height: height,
      Weave: weave
    });
  }

  loadLayer() {
    if (this.layers == 4) {
      this.pixelView.reset({ Layers: 1 });
      this.threeDView.reset({ Layers: 1 });
    } else {
      this.pixelView.reset({ Layers: pv.layers + 1 });
      this.threeDView.reset({ Layers: tv.layers + 1 });
    }
  }

  exportTIFF() {
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
}
