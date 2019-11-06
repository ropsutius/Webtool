window.onload = function() {
  canvasP = document.querySelector("#pixel-view");
  canvas3d = document.getElementById("3d-view");
  pv = new PixelView(canvasP, { Layers: layerCount });
  tv = new ThreeDView(canvas3d, { Layers: layerCount });
  window.onresize = function() {
    pv.onWindowResize();
    tv.onWindowResize();
  };
};
