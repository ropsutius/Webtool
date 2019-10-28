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
