<template>
  <div>
    <!--轮播-->
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(item, index) in products" :key="index" >
        <router-link :to="{path:'/Product',query:{productId:item.id}}">
        <van-image :src="item.picUrl" style="width: 100%;" height="70vw"  fit="fill"/>
        </router-link>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  // 热门商品组件
  name: 'ProductSwipe',
  data () {
    return {
      products: [] // 获取产品集合
    }
  },
  methods: {
    getProducts () { // 获取产品栏目集合
      this.$axios
        .get('/api/shop/product/hitProducts', {
          params: {
            page: 1,
            limit: 5
          }
        })
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.products = msg.data;
          } else {
            this.$dialog.alert(msg.msg);
          }
        });
    }
  },
  mounted () {
    this.getProducts();// 获取产品集合
  }
}
</script>
