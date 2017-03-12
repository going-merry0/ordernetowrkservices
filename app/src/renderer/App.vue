<template>
<div id="#app">
  <router-view></router-view>
</div>
</template>

<script>
import store from 'renderer/vuex/store'
import '../assets/fonts.css'

export default {
  store
}
</script>

<style>
html {
  font-size: 10px;
}

* {
  margin: 0;
  padding: 0;
}

body {
  font-family: "SF Pro Text";
}
</style>
