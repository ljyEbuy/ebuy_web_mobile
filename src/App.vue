<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
  html {
    font-size: 62.5%;/*10 ÷ 16 × 100% = 62.5%，浏览器默认的字号16px，计算之后都是以10PX为基础进行REM设置*/
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 1.4rem;/*1.4 × 10px = 14px */
/*  text-align: center;*/
  color: #2c3e50;
}

/* 设置了浏览器宽度不大于599时要采用的样式 */
@media screen and (max-width: 2000px){
  body{
    width:100%;
  }
}
/* 设置了浏览器宽度不小于600时要采用的样式*/
/*@media screen and (min-width: 501px) {
  html,body{
    width:500px;
    margin:0 auto;
    -webkit-box-shadow: 0px 0px 50px #ff9a00 ;
    -moz-box-shadow: 0px 0px 50px #ff9a00 ; !* 老的 Firefox *!
    box-shadow: 0px 0px 50px #ff9a00 ;
  }
}*/

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
