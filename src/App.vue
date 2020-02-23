<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
/*  text-align: center;*/
  color: #2c3e50;
}

/* 设置了浏览器宽度不大于599时要采用的样式 */
@media screen and (max-width: 500px){
  body{
    width:100%;
  }
}
/* 设置了浏览器宽度不小于600时要采用的样式*/
@media screen and (min-width: 501px) {
  html,body{
    width:500px;
    margin:0 auto;
    -webkit-box-shadow: 0px 0px 50px #ff9a00 ;
    -moz-box-shadow: 0px 0px 50px #ff9a00 ; /* 老的 Firefox */
    box-shadow: 0px 0px 50px #ff9a00 ;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
