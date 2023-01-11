<script setup>
import {
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  onMouseClick,
} from '../webtool/interaction';
</script>

<template>
  <div id="viewport" @mouseenter="onPointerEnter" @mouseleave="onPointerLeave">
    <canvas
      id="3d-view"
      class="webgl-content"
      @pointermove="onPointerMove"
      @click="onMouseClick"
    ></canvas>
    <canvas
      id="pixel-view"
      class="webgl-content"
      @pointermove="onPointerMove"
      @click="onMouseClick"
    ></canvas>
  </div>
</template>

<style>
#viewport {
  display: block;
  float: right;
  width: calc(100% - 46px);
  height: calc(100% - 26px);
}

.webgl-content {
  display: block;
  float: left;
  width: 50%;
  height: 100%;
}
</style>
