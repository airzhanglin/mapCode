<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: "app",
    methods:{
      Indicatorclose(){
        this.Indicator.close();
      }
    },
    watch:{
      "$route": "Indicatorclose"
    }
  };
</script>
<style lang="scss">
  @import "./assets/sass/_mixins.scss";
  @import "./assets/sass/_parameters.scss";

  html,
  body,
  #app {
    height: 100%;
    margin: 0;
  }

  .mint-header {
    background: $enclosure-color!important;
  }

  .mint-cell {
    padding: 0 15px;
  }
</style>

