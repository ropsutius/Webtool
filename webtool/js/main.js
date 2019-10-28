let changed3D = null;
let changedPixel = null;

function onWindowResize(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].onWindowResize();
  }
}

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
