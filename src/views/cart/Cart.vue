<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="我的购物车"
      fixed
      left-text="返回"
      right-text="清空购物车"
      left-arrow
      @click-left="onClickLeft"
      @click-right="clearCart"
    >
    </van-nav-bar>
    <!--中间内容-->
    <div style="margin-top:50px;padding-bottom: 50px;">
      <!--空购物车界面-->
      <div v-if="cart==''||cart==null||cart.list.length==0" style="margin-top:35%;text-align: center;">
        <img :src="cartPic" style="width: 70%;"/>
        <div style="margin-top: 20px;color:#666666;">购物车没有任何商品</div>
      </div>
      <!--包含内容的购物车-->
      <div v-else>
        <template v-for="(shoppingCartItem,index) in cart.list">
        <!--商品基本信息-->
        <van-row :key="index" style="padding:12px;border-bottom:1px solid #ebedf0;">
          <!--商品图片-->
          <van-col span="11">
            <router-link :to="{path:'/Product',query:{productId:shoppingCartItem.product.id}}">
            <img :src="shoppingCartItem.product.picUrl" style="width:90%;height: 120px;"/>
            </router-link>
            <!--<van-image :src="product.picUrl" lazy-load width="100%" fit="scale-down"/>-->
          </van-col>
          <!--商品数据-->
          <van-col span="11" style="font-size: 14px;">
            <div class="van-multi-ellipsis--l2" style="text-align: left;font-size: 16px;line-height: 20px;height:40px;" @click="$router.push({path:'/Product',query:{productId:shoppingCartItem.product.id}})">
              {{shoppingCartItem.product.name}}
            </div>
            <div style="text-align: left;color:red;line-height: 30px;">￥{{shoppingCartItem.product.price}}</div>
            <div style="text-align: left;line-height: 16px;color:darkgrey;font-style:italic;font-size: 12px;">
              <del v-if="shoppingCartItem.product.price!=shoppingCartItem.product.originalPrice">￥{{shoppingCartItem.product.originalPrice}}</del>
              <span v-else>暂无优惠</span>
            </div>
            <div style="text-align: left;margin-top:5px;line-height: 20px;height:20px;">
              <van-stepper v-model="shoppingCartItem.number" input-width="40px" integer @change="numberChange($event,shoppingCartItem.product.id)"/>
            </div>
          </van-col>
          <!--商品数据-->
          <van-col span="2">
            <van-icon name="delete" size="20" color="red" style="margin-top:50px;" @click="removeProduct(shoppingCartItem.product.id)"/>
          </van-col>
        </van-row>
        </template>
        <!--购物车总计-->
        <van-cell-group>
          <van-cell title="商品金额">
            <template slot="default">
              <span style="color: red;">￥{{cart.originalPriceTotal}}</span>
            </template>
          </van-cell>
          <van-cell title="优惠">
            <template slot="default">
              <span style="color: red;">-￥{{cart.priceTotalRuduce}}</span>
            </template>
          </van-cell>
          <van-cell title="总价">
            <template slot="default">
              <span style="color: red;">￥{{cart.priceTotal}}</span>
            </template>
          </van-cell>
        </van-cell-group>
        <van-row>
          <van-col span="12" style="padding:0 10px;">
            <!--<van-button type="primary" round block>继续购物</van-button>-->
          </van-col>
          <van-col span="12" style="padding:5px 10px;text-align: right;">
            <van-button type="danger" to="/BuyCart">去结算</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Cart',
  data () {
    return {
      cartPic: require('@/assets/cart.png'), // cart图片
      cart: {
        list: [] // 这里定义只是为了让vue进行集合判断的时候，不出现警告信息。有没有都不影响运行
      } // 购物车信息
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
    },
    numberChange (value, productId) { // 当购买数量改变时。value是原生参数，即文本框的值；productId是手动传入的参数
      this.$axios
        .put('/api/shop/cart', null, {
          params: {
            productId: productId,
            number: value
          }
        })
        .then(response => { // 获取返回数据
          const msg = response.data;
          this.cart = msg.data; // 不管成功还是失败都获取返回数值
          if (msg.code !== 0) {
            this.$dialog.alert({
              message: msg.msg
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    removeProduct (productId) { // 移除商品
      this.$dialog.confirm({
        title: '系统提示',
        message: '是否从购物车中移除该商品'
      }).then(() => {
        this.$axios
          .delete('/api/shop/cart', {
            params: {
              productId: productId
            }
          })
          .then(response => { // 获取返回数据
            const msg = response.data;
            // eslint-disable-next-line eqeqeq
            if (msg.code == 0) {
              this.cart = msg.data;
            } else {
              this.$dialog.alert({
                message: msg.msg
              })
            }
          })
          .catch(error => {
            console.log(error);
          });
      }).catch(() => {
        // on cancel
      });
    },
    clearCart () { // 清空购物车
      if (this.cart != null && this.cart.list != null && this.cart.list.length > 0) {
        this.$dialog.confirm({
          title: '系统提示',
          message: '是否清空购物车'
        }).then(() => {
          this.$axios
            .delete('/api/shop/cart/clear')
            .then(response => { // 获取返回数据
              const msg = response.data;
              // eslint-disable-next-line eqeqeq
              if (msg.code == 0) {
                this.cart.list = []; // 清空本地购物车
              } else {
                this.$dialog.alert({
                  message: msg.msg
                })
              }
            })
            .catch(error => {
              console.log(error);
            });
        }).catch(() => {
          // on cancel
        });
      } else {
        this.$toast('购物车中没有商品可以清空');
      }
    }
  },
  mounted () {
    this.getCart(); // 获取购物车集合
  }
}
</script>
<style>

</style>
