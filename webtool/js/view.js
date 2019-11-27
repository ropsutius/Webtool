class View {
  backgroundColor = 0xf5f5f5;
  highlightColor = [0xee9999, 0xcc4444];
  okList = [
    ["0", "1"],
    ["00", "10", "11"],
    ["000", "100", "110", "111"],
    ["0000", "1000", "1100", "1110", "1111"]
  ];
  previous = [];
  sceneMatrix = [];
  clicked = false;

  constructor(app, canvas) {
    this.app = app;
    this.matrix = this.app.matrix;

    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.canvas.appendChild(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );

    this.canvas.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this),
      false
    );
    this.canvas.addEventListener("click", this.onMouseClick.bind(this), false);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.draw();
    this.updateControls();
    this.renderer.render(this.scene, this.camera);
  }

  getSetByMouse() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObjects(this.scene.children);
  }

  onMouseMove(event) {
    this.mouse.x =
      ((event.clientX - this.canvas.offsetLeft) / this.canvas.offsetWidth) * 2 -
      1;
    this.mouse.y =
      -((event.clientY - this.canvas.offsetTop) / this.canvas.offsetHeight) *
        2 +
      1;
  }

  getToggle(coords) {
    return this.matrix.matrix[coords.y][coords.x];
  }

  getToggleById(id) {
    return this.getToggle(this.getCoordinatesById(id));
  }

  getId(coords) {
    return this.sceneMatrix[coords.y][coords.x] === undefined
      ? null
      : this.sceneMatrix[coords.y][coords.x];
  }

  getCoordinatesById(id) {
    for (let i = 0; i < this.matrix.y; i++) {
      let index = this.sceneMatrix[i].indexOf(id);
      if (index > -1) {
        return { y: i, x: index };
      }
    }
    return null;
  }

  getPreviousSet(coords) {
    return coords.y < this.app.layers
      ? null
      : { y: coords.y - this.app.layers, x: coords.x };
  }

  getNextSet(coords) {
    return coords.y > this.matrix.y - this.app.layers - 1
      ? null
      : { y: coords.y + this.app.layers, x: coords.x };
  }

  getPrimePoint(coords) {
    while (!this.isPrimePoint(coords)) {
      coords = this.getNextPointInSet(coords);
    }
    return coords;
  }

  getNextPointInSet(coords) {
    return !this.isLastPoint(coords)
      ? { x: coords.x, y: coords.y + 1 }
      : { x: coords.x, y: coords.y - this.app.layers + 1 };
  }

  getPreviousPointInSet(coords) {
    return !this.isStartPoint(coords)
      ? { x: coords.x, y: coords.y - 1 }
      : { x: coords.x, y: coords.y + this.app.layers - 1 };
  }

  getStartPoint(coords) {
    if (this.isStartPoint(coords)) {
      return coords;
    } else {
      let point = coords;
      for (let i = 1; i < this.app.layers; i++) {
        point = this.getNextPointInSet(point);
        if (this.isStartPoint(point)) {
          return point;
        }
      }
    }
  }

  getLastPoint(coords) {
    if (this.isLastPoint(coords)) {
      return coords;
    } else {
      let point = coords;
      for (let i = 1; i < this.app.layers; i++) {
        point = this.getPreviousPointInSet(point);
        if (this.isLastPoint(point)) {
          return point;
        }
      }
    }
  }

  getSetString(coords) {
    let point = this.getStartPoint(coords);
    let string = this.getToggle(point).toString();
    for (let i = 1; i < this.app.layers; i++) {
      point = this.getNextPointInSet(point);
      string += this.getToggle(point).toString();
    }
    return string;
  }

  isStartPoint(coords) {
    return coords.y % this.app.layers == 0 ? true : false;
  }

  isLastPoint(coords) {
    return coords.y % this.app.layers == this.app.layers - 1 ? true : false;
  }

  isPrimePoint(coords) {
    return (coords.y % this.app.layers) + (coords.x % this.app.layers) ==
      this.app.layers - 1
      ? true
      : false;
  }

  isEqualToPair(coords) {
    return this.getToggle(coords) ==
      this.getToggle(this.getNextPointInSet(coords))
      ? true
      : false;
  }

  toggle(coords) {
    if (this.getToggle(coords) == 0) {
      this.matrix.matrix[coords.y][coords.x] = 1;
    } else {
      this.matrix.matrix[coords.y][coords.x] = 0;
    }
  }

  tryToggle(coords) {
    this.toggle(coords);
    let string = this.getSetString(coords);
    if (!this.okList[this.app.layers - 1].includes(string)) {
      this.toggle(coords);
    } else {
      this.app.changed3D.push(coords);
      this.app.changedPixel.push(coords);
    }
  }

  rotateToggle(coords) {
    let point = this.getStartPoint(coords);
    for (let i = 0; i < this.app.layers; i++) {
      if (this.getToggle(point) == 0) {
        this.tryToggle(point);
        return;
      }
      point = this.getNextPointInSet(point);
    }
    point = this.getPreviousPointInSet(point);
    for (let i = 0; i < this.app.layers; i++) {
      if (this.getToggle(point) == 1) {
        this.tryToggle(point);
      }
      point = this.getPreviousPointInSet(point);
    }
  }

  disposeNode(node) {
    if (node instanceof THREE.Mesh) {
      if (node.geometry) {
        node.geometry.dispose();
      }

      if (node.material) {
        if (node.material instanceof THREE.MeshFaceMaterial) {
          $.each(node.material.materials, function(idx, mtrl) {
            if (mtrl.map) mtrl.map.dispose();
            if (mtrl.lightMap) mtrl.lightMap.dispose();
            if (mtrl.bumpMap) mtrl.bumpMap.dispose();
            if (mtrl.normalMap) mtrl.normalMap.dispose();
            if (mtrl.specularMap) mtrl.specularMap.dispose();
            if (mtrl.envMap) mtrl.envMap.dispose();
            if (mtrl.alphaMap) mtrl.alphaMap.dispose();
            if (mtrl.aoMap) mtrl.aoMap.dispose();
            if (mtrl.displacementMap) mtrl.displacementMap.dispose();
            if (mtrl.emissiveMap) mtrl.emissiveMap.dispose();
            if (mtrl.gradientMap) mtrl.gradientMap.dispose();
            if (mtrl.metalnessMap) mtrl.metalnessMap.dispose();
            if (mtrl.roughnessMap) mtrl.roughnessMap.dispose();

            mtrl.dispose();
          });
        } else {
          if (node.material.map) node.material.map.dispose();
          if (node.material.lightMap) node.material.lightMap.dispose();
          if (node.material.bumpMap) node.material.bumpMap.dispose();
          if (node.material.normalMap) node.material.normalMap.dispose();
          if (node.material.specularMap) node.material.specularMap.dispose();
          if (node.material.envMap) node.material.envMap.dispose();
          if (node.material.alphaMap) node.material.alphaMap.dispose();
          if (node.material.aoMap) node.material.aoMap.dispose();
          if (node.material.displacementMap)
            node.material.displacementMap.dispose();
          if (node.material.emissiveMap) node.material.emissiveMap.dispose();
          if (node.material.gradientMap) node.material.gradientMap.dispose();
          if (node.material.metalnessMap) node.material.metalnessMap.dispose();
          if (node.material.roughnessMap) node.material.roughnessMap.dispose();

          node.material.dispose();
        }
      }
    }
  }

  disposeHierarchy(node) {
    for (var i = node.children.length - 1; i >= 0; i--) {
      var child = node.children[i];
      this.disposeHierarchy(child);
      this.disposeNode(child);
    }
  }
}
