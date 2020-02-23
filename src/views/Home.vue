<template>
  <div class="home">
    <router-view/>
    <!--底部菜单-->
    <van-tabbar
      route
      active-color="#fed700"
      inactive-color="#000"
    >
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" to="/Cart">购物车</van-tabbar-item>
      <van-tabbar-item icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style scoped>

</style>
