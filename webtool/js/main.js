let app;
window.onload = function() {
  app = new Application({ layers: 2 }, plain_double);
  window.onresize = function() {
    pv.onWindowResize();
    tv.onWindowResize();
  };
};
