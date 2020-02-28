<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="个人中心"
      fixed
    >
    </van-nav-bar>
    <!--中间内容-->
    <div style="margin-top:50px;padding-bottom: 50px;">
      <van-row  style="padding:5px;border-bottom:1px solid #ebedf0;">
        <!--个人头像-->
        <van-col span="8" gutter="20" style="text-align: center;">
          <img v-if="customer!=null&&customer.picUrl!=null&&customer.picUrl!=''" :src="customer.picUrl" style="width:90%;height: 100px;" @click="showPhoto(customer.picUrl)"/>
          <img v-else :src="noPic" style="width:90%;height: 100px;"/>
          <!--<van-image :src="product.picUrl" lazy-load width="100%" fit="scale-down"/>-->
        </van-col>
        <!--个人数据-->
        <van-col span="16" style="text-align: left;font-size: 14px;line-height: 24px;">
          <div class="van-multi-ellipsis" style="font-size: 20px;line-height: 30px;" >
            <template v-if="customer.username!=null">
              {{customer.username}}
            </template>
            <template v-else>
              未知用户
            </template>
          </div>
          <div class="van-multi-ellipsis">
            <template v-if="customer.name!=null">
              {{customer.name}}
            </template>
            <template v-else>
              未知用户
            </template>
          </div>
          <div style="font-size: 12px;">
            <template v-if="customer.sex==1">男</template>
            <template v-else-if="customer.sex==2">女</template>
            <template v-else>未知性别</template>
          </div>
          <div style="font-size: 12px;">
            订单数：{{customer.productOrderNumber}}
          </div>
        </van-col>
      </van-row>
      <van-cell-group title="我的订单">
        <van-grid>
          <!--待付款-->
          <van-grid-item v-if="customer.payTagOrderNumber>0" :info="customer.payTagOrderNumber" icon="credit-pay" text="待付款"  :to="{path:'/Order',query:{tag:0}}"/>
          <van-grid-item v-else icon="credit-pay" text="待付款"  :to="{path:'/Order',query:{tag:0}}"/>
          <!--待发货-->
          <van-grid-item v-if="customer.sendTagOrderNumber>0" :info="customer.sendTagOrderNumber" icon="gift-o" text="待发货" :to="{path:'/Order',query:{tag:1}}"/>
          <van-grid-item  v-else icon="gift-o" text="待发货" :to="{path:'/Order',query:{tag:1}}"/>
          <!--待收货-->
          <van-grid-item v-if="customer.receiveTagOrderNumber>0" :info="customer.receiveTagOrderNumber" icon="logistics" text="待收货" :to="{path:'/Order',query:{tag:2}}"/>
          <van-grid-item v-else  icon="logistics" text="待收货" :to="{path:'/Order',query:{tag:2}}"/>
          <!--所有订单-->
          <van-grid-item icon="notes-o" text="所有订单" to="/Order"/>
        </van-grid>
      </van-cell-group>
      <van-cell-group title="我的信息">
        <van-cell title="基本信息修改" to="/Customer/CustomerEdit"/>
        <van-cell title="密码修改" to="/Customer/PasswordEdit"/>
        <van-cell title="上传头像" to="/Customer/CustomerPhoto"/>
        <van-cell title="注销用户" @click="logout"/>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';

export default {
  name: 'Login',
  data () {
    return {
      noPic: require('@/assets/nopic.jpg'), // 没有头像时的图片
      customer: {}
    }
  },
  methods: {
    getCustomer () { // 获取账户信息
      this.$axios
        .get('/api/shop/customer')
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.customer = msg.data;
            // eslint-disable-next-line eqeqeq
            if (this.customer != null && this.customer.picUrl != null && this.customer.picUrl != '') { // 如果图片不为空
              this.$set(this.customer, 'picUrl', this.customer.picUrl + '?' + Math.random());
            }
          } else { // 如果验证失败
            this.$dialog.alert({
              title: '标题',
              message: msg.msg
            }).then(() => {
              this.$router.push('/Login');
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    logout () { // 注销用户
      this.$axios
        .get('/api/shop/customer/logout')
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.$dialog.alert({
              title: '标题',
              message: msg.msg
            }).then(() => {
              this.$router.push('/Login');
            });
          }
        })
        .catch(error => {
          this.$toast(error);
        });
    },
    showPhoto (picUrl) { // 展示图片
      ImagePreview([picUrl]); // 当点击图片时，预览该图片
    }
  },
  mounted () {
    this.getCustomer();
  }
}
</script>
<style>

</style>
