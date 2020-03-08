<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="填写订单"
      fixed
      left-text="返回购物车"
      left-arrow
      @click-left="$router.push('/Cart')"
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
        <div :key="index" style="padding:12px;border-bottom:1px solid #ebedf0;display:-webkit-flex;display: flex;">
          <!--商品图片-->
          <div style="width: 140px;height: 120px;">
            <router-link :to="{path:'/Product',query:{productId:shoppingCartItem.product.id}}">
            <img :src="shoppingCartItem.product.picUrl" style="width:100%;height: 100%;"/>
            </router-link>
            <!--<van-image :src="product.picUrl" lazy-load width="100%" fit="scale-down"/>-->
          </div>
          <!--商品数据-->
          <div style="font-size: 14px;width:calc(100% - 150px);padding-left:20px; ">
            <div class="van-multi-ellipsis--l2" style="text-align: left;line-height: 24px;height:48px;" @click="$router.push({path:'/Product',query:{productId:shoppingCartItem.product.id}})">{{shoppingCartItem.product.name}}</div>
            <div style="text-align: left;cline-height: 30px;">
              <span style="font-size: 14px;color:red;">￥{{shoppingCartItem.product.price}}</span>
              <span style="font-size: 14px;margin-left: 10px;">×{{shoppingCartItem.number}}份</span>
            </div>
            <div style="text-align: left;font-size: 14px;line-height: 30px;margin-top:20px;">
              总价:<span style="color:red;">￥{{shoppingCartItem.priceTotal}}</span>
            </div>
          </div>
        </div>
        </template>
        <!--订单数据-->
        <van-cell title="订单信息" style=" background-color:#DDDDDD;">
        </van-cell>
        <van-form ref="orderForm" @submit="onSubmit">
        <van-field name="paymentType" label="支付方式" :rules="[{ required: true, message: '请选择支付方式' }]">
          <template #input>
            <van-radio-group v-model="form.paymentType" direction="horizontal">
              <van-radio name="1">网上支付</van-radio>
              <van-radio name="2">货到付款</van-radio>
            </van-radio-group>
          </template>
        </van-field>
          <van-field
            v-model="form.sendName"
            name="sendName"
            label="收货人姓名"
            required
            clearable
            :rules="[{ required: true, message: '请填写收货人姓名' }]"
          />
          <van-field
            v-model="form.sendTel"
            name="sendTel"
            type="tel"
            label="联系电话"
            required
            clearable
            :rules="[{ required: true, message: '请填写联系电话' }]"
          />
          <van-field
            v-model="form.sendAddress"
            name="sendAddress"
            label="地址"
            required
            clearable
            :rules="[{ required: true, message: '请填写地址' }]"
          />
          <van-field
            v-model="form.sendZip"
            name="sendZip"
            label="邮编"
            required
            clearable
            :rules="[{ required: true, message: '请填写邮编' }]"
          />
        </van-form>
        <!--订单总计-->
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
      </div>
      <van-submit-bar
        :price="cart.priceTotal*100"
        safe-area-inset-bottom
        @submit="$refs.orderForm.submit()"
        button-text="提交订单"
        :loading="loadingButton"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Cart',
  data () {
    this.nameRules = [
      { required: true, message: '请填写姓名' },
      { validator: this.validateName, message: '姓名长度不能超过10个字符' }
    ];
    return {
      loadingButton: false, // 提交按钮是否加载中
      cartPic: require('@/assets/cart.png'), // cart图片
      form: {}, // 订单信息
      cart: {} // 购物车信息
    }
  },
  methods: {
    getCustomer () { // 获取账户信息
      this.$axios
        .get('/api/shop/customer')
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.$set(this.form, 'sendName', msg.data.name);
            this.$set(this.form, 'sendZip', msg.data.zip);
            this.$set(this.form, 'sendTel', msg.data.tel);
            this.$set(this.form, 'sendAddress', msg.data.address);
          }
        });
    },
    getCart () { // 获取购物车信息
      this.$axios
        .get('/api/shop/cart')
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            // eslint-disable-next-line eqeqeq
            if (msg.data == null || msg.data.list.length == 0) { // 如果购物车为空
              this.$dialog.alert({
                title: '系统提示',
                message: '您的购物车还没有商品，请先购物再下单'
              }).then(() => {
                this.$router.push('/Cart'); // 跳转回购物车页面
              });
            } else { // 如果购物车不为空
              this.cart = msg.data;
            }
          } else {
            this.$dialog.alert(msg.msg);
          }
        });
    },
    onClickLeft () { // 当点击返回时
      this.$router.go(-1);
    },
    onSubmit (values) { // 提交订单
      this.loadingButton = true;
      this.$axios // 将更新后的值传到服务端保存
        .post('/api/shop/order', JSON.stringify(values))
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            const orderNo = msg.data; // 获取保存后的订单号
            this.$dialog.alert({
              title: '系统提示',
              message: '您已经成功提交订单'
            }).then(() => {
              this.$router.push({ path: '/order/OrderDetail', query: { orderNo: orderNo } });
            });
          } else { // 如果修改失败
            this.loadingButton = false;
            this.$toast(msg.msg);
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(error => {
          this.loadingButton = false;
        });
    }
  },
  mounted () {
    this.getCustomer();
    this.getCart(); // 获取购物车集合
  }
}
</script>
<style>

</style>
