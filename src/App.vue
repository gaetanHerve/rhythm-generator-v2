<template>
  <div id="logoSection" class="w3-row">
    <img alt="logo" src="@/assets/logo_small2.png" style="scale:50%" />
  </div>
  <Rhythm class="w3-row" />
</template>

<script>
import Rhythm from './views/Rhythm.vue'

export default {
  name: 'App',
  components: {
    Rhythm
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

</style>
