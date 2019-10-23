let changed3D = null;
let changedPixel = null;

window.onload = function() {
  canvasP = document.querySelector("#pixel-view");
  canvas3d = document.getElementById("3d-view");
  pv = new PixelView(canvasP);
  tv = new ThreeDView(canvas3d, pv);
  window.onresize = pv.onWindowResize.bind(pv);
};
