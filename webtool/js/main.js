let changed3D = null;
let changedPixel = null;
let pv, tv;

window.onload = function() {
  canvasP = document.querySelector("#pixel-view");
  canvas3d = document.getElementById("3d-view");
  pv = new PixelView(canvasP);
  tv = new ThreeDView(canvas3d);
  window.onresize = function() {
    pv.onWindowResize();
    tv.onWindowResize();
  };
};
