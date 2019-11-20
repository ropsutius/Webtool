class Application {
  changed3D = [];
  changedPixel = [];

  constructor(options, matrix) {
    this.layers = options.layers;
    this.canvasPixel = document.getElementById("pixel-view");
    this.canvas3D = document.getElementById("threeD-view");

    this.matrix = new Matrix(this, options, matrix);
    this.threeDView = new ThreeDView(this, this.canvas3D);
    this.pixelView = new PixelView(this, this.canvasPixel);

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  loadLayer() {
    if (this.layers == 4) {
      this.layers = 1;
    } else {
      this.layers += 1;
    }
    this.pixelView.reset();
    this.threeDView.reset();
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
    document.getElementById("new").style.display = "block";
  }
  closeNew() {
    document.getElementById("new").style.display = "none";
  }

  openExport() {
    document.getElementById("export").style.display = "block";
  }
  closeExport() {
    document.getElementById("export").style.display = "none";
  }

  openSave() {
    document.getElementById("save").style.display = "block";
  }
  closeSave() {
    document.getElementById("save").style.display = "none";
  }

  createNewCanvas(layers, weave, width, height) {
    this.closeNew();

    if (width % layers != 0 || height % layers != 0) {
      alert("Canvas dimensions must match layers");
      return;
    }

    this.layers = parseInt(layers);
    this.matrix.reset({
      Weave: parseInt(weave),
      Width: parseInt(width),
      Height: parseInt(height)
    });
    this.pixelView.reset();
    this.threeDView.reset();
  }

  saveProject(name) {
    this.closeSave();
    let file = this.matrix.getSaveData();
    let element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(file)
    );
    element.setAttribute("download", name + ".txt");

    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  exportTIFF(name) {
    this.closeExport();
    if (name != null && name != "") {
      let colorMatrix = new Uint32Array(this.matrix.y * this.matrix.x);
      let index = 0;
      for (let i = 0; i < this.matrix.y; i++) {
        for (let k = 0; k < this.matrix.x; k++) {
          if (this.matrix.matrix[i][k] == 0) {
            colorMatrix[index] = 0xffffffff;
          } else {
            colorMatrix[index] = 0xff000000;
          }
          index++;
        }
      }
      let file = UTIF.encodeImage(
        colorMatrix.buffer,
        this.matrix.x,
        this.matrix.y
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

  onWindowResize(pv, tv) {
    this.pixelView.onWindowResize();
    this.threeDView.onWindowResize();
  }
}
