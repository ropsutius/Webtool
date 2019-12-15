// Return the toggle state at coordinates
function getToggle(coordinates) {
  return matrix[coordinates.y][coordinates.x];
}

// Toggle coordinates
function toggle(coordinates) {
  if (getToggle(coordinates) == 0) {
    matrix[coordinates.y][coordinates.x] = 1;
  } else {
    matrix[coordinates.y][coordinates.x] = 0;
  }
}

// Try to toggle the coordinates in set
function tryToggle(coordinates) {
  // Toggle the point at coordinates to test if it is ok
  toggle(coordinates);
  let previousCoordinates = getStartCoordinates(coordinates);
  // Test set if a 0 precedes a 1
  for (let i = 0; i < layers; i++) {
    let nextCoordinates = getNextPointInSet(previousCoordinates);
    if (
      getToggle(previousCoordinates) == 0 &&
      getToggle(nextCoordinates) == 1
    ) {
      // reset the toggle of coordinates and return
      toggle(coordinates);
      return;
    } else {
      previousCoordinates = nextCoordinates;
    }
  }
  // Toggle was successful. Add coordinates to a list of changed coordinates
  changedCoordinates.push(coordinates);
}

// Rotate the toggle state of a set
function rotateToggle(coordinates) {
  // Get the coordinates of the first point in a set
  let coordinates = getStartCoordinates(coordinates);
  // Try to toggle the first 0
  for (let i = 0; i < layers; i++) {
    if (getToggle(coordinates) == 0) {
      tryToggle(coordinates);
      return;
    }
    coordinates = getNextPointInSet(coordinates);
  }
  // All points are 1 so turn them to 0
  coordinates = getPreviousPointInSet(coordinates);
  for (let i = 0; i < layers; i++) {
    if (getToggle(coordinates) == 1) {
      tryToggle(coordinates);
    }
    coordinates = getPreviousPointInSet(coordinates);
  }
}
