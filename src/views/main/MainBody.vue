<template>
  <!--用于首页中间展示的主界面-->
<!--  <div style="background-color:#DDDDDD;padding:5px 5px 60px 5px;">-->
  <div>
    <!--轮播-->
    <ProductSwipe/>
    <!---今日新品-->
    <ProductOfNew style="margin-top: 5px;"/>
    <!--热门商品-->
    <ProductOfHot style="margin-top: 5px;"/>
    <!--推荐商品-->
    <ProductOfRecommendationMarquee style="margin-top: 5px;"/>
  </div>
</template>

<script>
export default {
  // 热门商品组件
  name: 'HomeMain',
  components: {
    ProductSwipe: () => import('@/views/main/ProductSwipe.vue'), // 引入轮播商品
    ProductOfHot: () => import('@/views/main/ProductOfHot.vue'), // 引入热门商品
    ProductOfRecommendationMarquee: () => import('@/views/main/ProductOfRecommendationMarquee.vue'), // 引入热门商品
    ProductOfNew: () => import('@/views/main/ProductOfNew.vue') // 引入新品上市
  }
}
</script>
