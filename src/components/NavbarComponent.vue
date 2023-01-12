<template>
  <a @click="func">{{ name }}</a>
</template>

<script>
export default {
  props: {
    name: String,
    handler: { type: Function },
  },
  methods: {
    func(event) {
      if (this.handler) this.handler(event);
    },
  },
};
</script>

<style scoped>
/* Links inside the dropdown */
a {
  font-size: 12px;
  float: none;
  color: black;
  padding: 6px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
  cursor: pointer;
}

/* Add a grey background color to dropdown links on hover */
a:hover {
  background-color: #ddd;
}
</style>
