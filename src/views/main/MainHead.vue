<template>
  <div>
    <!--头部-->
    <Head/>
    <img :src="bannerPic" style="width: 100%;"/>
  </div>
</template>

<script>
export default {
  // 首页头部组件
  name: 'HomeHead',
  components: {
    Head: () => import('@/views/Head.vue') // 引入头部的组件
  },
  data () {
    return {
      bannerPic: require('@/assets/BANNER.png') // banner图片
    }
  }
}
</script>
