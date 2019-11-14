class View {
  sceneMatrix = [];
  backgroundColor = 0xf5f5f5;
  highlightColor = [0xee9999, 0xcc4444];
  okList = [
    ["0", "1"],
    ["00", "10", "11"],
    ["000", "100", "110", "111"],
    ["0000", "1000", "1100", "1110", "1111"]
  ];
  previous = [];
  clicked = false;

  constructor(canvas, options) {
    this.matrix = matrix;
    this.sides = [this.matrix.length, this.matrix[0].length];

    if ("Layers" in options) {
      this.layers = options.Layers;
    } else {
      this.layers = 1;
    }

    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backgroundColor);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
    this.canvas.appendChild(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.draw();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  getCoordinatesById(id) {
    for (let i = 0; i < this.sides[0]; i++) {
      let index = this.sceneMatrix[i].indexOf(id);
      if (index > -1) {
        return { y: i, x: index };
      }
    }
    return null;
  }

  getId(coords) {
    return this.sceneMatrix[coords.y][coords.x] === undefined
      ? null
      : this.sceneMatrix[coords.y][coords.x];
  }

  getToggle(coords) {
    return this.matrix[coords.y][coords.x];
  }

  getToggleById(id) {
    return this.getToggle(this.getCoordinatesById(id));
  }

  getPreviousSet(coords) {
    return coords.y < this.layers
      ? null
      : { y: coords.y - this.layers, x: coords.x };
  }

  getNextSet(coords) {
    return coords.y > this.sides[0] - this.layers - 1
      ? null
      : { y: coords.y + this.layers, x: coords.x };
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
      : { x: coords.x, y: coords.y - this.layers + 1 };
  }

  getPreviousPointInSet(coords) {
    return !this.isStartPoint(coords)
      ? { x: coords.x, y: coords.y - 1 }
      : { x: coords.x, y: coords.y + this.layers - 1 };
  }

  getStartPoint(coords) {
    if (this.isStartPoint(coords)) {
      return coords;
    } else {
      let point = coords;
      for (let i = 1; i < this.layers; i++) {
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
      for (let i = 1; i < this.layers; i++) {
        point = this.getPreviousPointInSet(point);
        if (this.isLastPoint(point)) {
          return point;
        }
      }
    }
  }

  getHeight(coords) {
    let string = this.getSetString(coords);
    return this.okList[this.layers - 1].includes(string)
      ? this.okList[this.layers - 1].indexOf(string)
      : null;
  }

  getSetString(coords) {
    let point = this.getStartPoint(coords);
    let string = this.getToggle(point).toString();
    for (let i = 1; i < this.layers; i++) {
      point = this.getNextPointInSet(point);
      string += this.getToggle(point).toString();
    }
    return string;
  }

  getSetByMouse() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster.intersectObjects(this.scene.children);
  }

  isStartPoint(coords) {
    return coords.y % this.layers == 0 ? true : false;
  }

  isLastPoint(coords) {
    return coords.y % this.layers == this.layers - 1 ? true : false;
  }

  isPrimePoint(coords) {
    return (coords.y % this.layers) + (coords.x % this.layers) ==
      this.layers - 1
      ? true
      : false;
  }

  isEqualToPair(coords) {
    return this.getToggle(coords) ==
      this.getToggle(this.getNextPointInSet(coords))
      ? true
      : false;
  }

  isRealSet(coords) {}

  toggle(coords) {
    if (this.getToggle(coords) == 0) {
      this.matrix[coords.y][coords.x] = 1;
    } else {
      this.matrix[coords.y][coords.x] = 0;
    }
    let string = this.getSetString(coords);
    if (!this.okList[this.layers - 1].includes(string)) {
      if (this.getToggle(coords) == 0) {
        this.matrix[coords.y][coords.x] = 1;
      } else {
        this.matrix[coords.y][coords.x] = 0;
      }
    } else {
      changed3D.push(coords);
      changedPixel.push(coords);
    }
  }

  rotateToggle(coords) {
    let point = this.getStartPoint(coords);
    for (let i = 0; i < this.layers; i++) {
      if (this.getToggle(point) == 0) {
        this.toggle(point);
        return;
      }
      point = this.getNextPointInSet(point);
    }
    point = this.getPreviousPointInSet(point);
    for (let i = 0; i < this.layers; i++) {
      if (this.getToggle(point) == 1) {
        this.toggle(point);
      }
      point = this.getPreviousPointInSet(point);
    }
  }

  // TODO:
  generatePermutations() {}

  onMouseMove(event) {
    this.mouse.x =
      ((event.clientX - this.canvas.offsetLeft) / this.canvas.offsetWidth) * 2 -
      1;
    this.mouse.y =
      -((event.clientY - this.canvas.offsetTop) / this.canvas.offsetHeight) *
        2 +
      1;
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
