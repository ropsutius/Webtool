function main() {
  const canvas = document.querySelector(".gl_canvas");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  gl.canvas.width = document.getElementById("canvas").clientWidth;
  gl.canvas.height = document.getElementById("canvas").clientHeight;
  // Set clear color to black, fully opaque
  gl.clearColor(0.5, 0.5, 0.5, 3);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}
