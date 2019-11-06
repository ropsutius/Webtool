let changed3D = null;
let changedPixel = null;
let pv, tv;

window.onload = function() {
  canvasP = document.querySelector("#pixel-view");
  canvas3d = document.getElementById("3d-view");
  pv = new PixelView(canvasP, { Layers: 2 });
  tv = new ThreeDView(canvas3d, { Layers: 2 });
  window.onresize = function() {
    pv.onWindowResize();
    tv.onWindowResize();
  };
};
