<template>
  <div class="toolbar"><a href="#">P</a> <a href="#">M</a></div>
</template>

<style>
.toolbar {
  width: 46px; /* Set a specific width */
  height: calc(100% - 26px);
  background-color: #555; /* Dark-grey background */
  display: block;
  float: left;
  position: absolute;
}

.toolbar a {
  display: block; /* Make the links appear below each other instead of side-by-side */
  text-align: center; /* Center-align text */
  padding: 16px; /* Add some padding */
  color: white; /* White text color */
  font-size: 12px; /* Increased font-size */
  text-decoration: none;
}

.toolbar a:hover {
  background-color: gray; /* Add a hover color */
}

.active {
  background-color: #333; /* Add an active/current color */
}
</style>
