<template>
  <a href="#">{{ name }}</a>
</template>

<script>
export default {
  props: {
    name: String,
  },
};
</script>

<style scoped>
a {
  display: block; /* Make the links appear below each other instead of side-by-side */
  text-align: center; /* Center-align text */
  padding: 16px; /* Add some padding */
  color: white; /* White text color */
  font-size: 12px; /* Increased font-size */
  text-decoration: none;
}

a:hover {
  background-color: gray; /* Add a hover color */
}

.active {
  background-color: #333; /* Add an active/current color */
}
</style>
