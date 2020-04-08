<template>
  <div id="app">
    <h3>App</h3>
    <p>accessToken: {{$store.state.accessToken}}</p>
    <p>refreshToken: {{$store.state.refreshToken}}</p>
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
        name: 'App',
        components: {}
    }
</script>

<style>

</style>
