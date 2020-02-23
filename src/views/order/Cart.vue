<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="我的购物车"
      fixed
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      @click-right="$router.push('/')"
    >
      <van-icon name="wap-home-o" slot="right" />
    </van-nav-bar>
    <!--中间内容-->
    <div style="margin-top:50px;">
      <!--空购物车界面-->
      <div v-if="cart==''||cart==null" style="margin-top:50%;">
        <img :src="cartPic" style="width: 80%;"/>
        <div style="margin-top: 20px;color:#666666;">购物车没有任何商品</div>
      </div>
      <!--包含内容的购物车-->
      <div v-else style="padding-bottom: 50px;">
        <template v-for="(shoppingCartItem,index) in cart.list">
        <!--商品基本信息-->
        <van-row :key="index" style="padding:5px;border-bottom:1px solid #ebedf0;">
          <!--商品图片-->
          <van-col span="12">
            <router-link :to="{path:'/Product',query:{productId:shoppingCartItem.product.id}}">
            <img :src="shoppingCartItem.product.picUrl" style="width:90%;height: 120px;"/>
            </router-link>
            <!--<van-image :src="product.picUrl" lazy-load width="100%" fit="scale-down"/>-->
          </van-col>
          <!--商品数据-->
          <van-col span="12">
            <div class="van-multi-ellipsis--l2" style="text-align: left;line-height: 24px;height:48px;" @click="$router.push({path:'/Product',query:{productId:shoppingCartItem.product.id}})">{{shoppingCartItem.product.name}}</div>
            <div style="text-align: left;font-size: 14px;color:red;line-height: 30px;">￥{{shoppingCartItem.product.price}}</div>
            <div style="text-align: left;margin-top:5px;line-height: 20px;height:20px;">
              <van-stepper v-model="shoppingCartItem.number" input-width="40px" integer/>
            </div>
          </van-col>
        </van-row>
        </template>
        <!--订单总计-->
        <van-cell-group>
          <van-cell title="商品金额" :value="cart.originalPriceTotal" />
          <van-cell title="优惠" :value="cart.priceTotalRuduce" />
        </van-cell-group>
      </div>
      <van-submit-bar
        :price="cart.priceTotal*100"
        safe-area-inset-bottom
        button-text="提交订单"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Cart',
  data () {
    return {
      cartPic: require('@/assets/cart.png'), // cart图片
      cart: {} // 购物车信息
    }
  },
  methods: {
    getCart () { // 获取产品
      this.$axios
        .get('/api/shop/cart')
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.cart = msg.data;
          } else {
            this.$dialog.alert(msg.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onClickLeft () { // 当点击返回时
      this.$router.go(-1);
    }
  },
  mounted () {
    this.getCart(); // 获取购物车集合
  }
}
</script>
<style>

</style>
