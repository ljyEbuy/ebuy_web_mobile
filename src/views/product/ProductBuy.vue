<template>
  <div>
    <!--商品购买弹出框-->
    <van-action-sheet v-model="showCart" :title="product.name" style="text-align: left;">
      <div class="content" style="padding-bottom: 50px;">
        <!--商品基本信息-->
        <van-row style="padding:5px;border-bottom:1px solid #ebedf0;">
          <!--商品图片-->
          <van-col span="8">
            <img :src="product.picUrl" style="width:90%;max-height: 120px;"/>
            <!--<van-image :src="product.picUrl" lazy-load width="100%" fit="scale-down"/>-->
          </van-col>
          <!--商品数据-->
          <van-col span="16">
            <div style="text-align: left;font-size: 20px;font-weight: bold;color:red;">￥{{product.price}}</div>
            <div style="text-align: left;margin-top:5px;font-size: 12px;line-height: 20px;height:20px;">库存：{{product.repository}}</div>
          </van-col>
        </van-row>
        <!--购买数量-->
        <van-cell title="数量" center>
          <!-- 使用 title 插槽来自定义标题 -->
          <template slot="default">
            <!--<span style="text-align: left;font-size: 14px;color:red;">(10件起售，限购15件)</span>-->
            <van-stepper v-model="buyNumber" input-width="40px" integer  @change="numberChange"/>
          </template>
        </van-cell>
        <van-goods-action>
          <van-goods-action-button type="warning"  text="加入购物车" @click="buyProductToCart"/>
        </van-goods-action>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>

export default {
  name: 'ProductBuy',
  props: {
    value: { // 获取从父组件传递过来的当前选择的值
      default () {
        return false;
      }
    },
    product: { // 获取从父组件传递过来的当前选择的值
      type: Object,
      default () {
        return {};
      }
    }
  },
  data () {
    return {
      buyNumber: 1 // 要购买的商品数量
    }
  },
  methods: {
    numberChange (value) { // 当购买数量改变时
      if (value > this.product.repository) { // 如果购买的商品数量大于库存
        this.buyNumber = this.product.repository; // 让数量等于最大库存数量
        this.$toast('购买数量不能超过商品库存');
      }
    },
    buyProductToCart () { // 提交商品和数量到服务端
      this.$axios
        .post('/api/shop/cart', null, {
          params: {
            productId: this.product.id,
            number: this.buyNumber
          }
        })
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.showCart = false; // 隐藏购买界面
            this.$dialog.alert({
              title: '系统提示',
              message: '已将商品放入购物车'
            })
          } else {
            this.$dialog.alert({
              message: msg.msg
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  computed: {
    showCart: { // 显示是否购买的对话框通过这里绑定父组件传递过来的值，双向绑定，避免组件传值的警告
      get: function () { // 通过这里获取父组件传递过来的值
        return this.value;
      },
      set: function (value) { // 如果获得新的值。
        this.$emit('input', value);// 则传递给父组件。机制学习：computed这里的值变化后，watch就会监听到
      }
    }
  }
}
</script>
<style>

</style>
