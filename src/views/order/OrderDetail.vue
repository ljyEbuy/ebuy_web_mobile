<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="订单详情"
      fixed
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    >
      <van-icon name="wap-home-o" slot="right" />
    </van-nav-bar>
    <!--中间内容-->
    <div style="margin-top:50px;padding-bottom: 50px;background-color: #DDDDDD;">
      <!--地址信息-->
      <div style="padding: 5px 20px;background-color: white;line-height: 20px;font-size: 12px;">
        <div style="font-weight: bold;">
          <span>{{productOrder.sendName}}</span>
          <span style="margin-left: 15px;">{{productOrder.sendTel}}</span>
        </div>
        <div style="color: #666666;">地址：{{productOrder.sendAddress}}</div>
      </div>
      <!--子订单信息-->
      <div  style="margin-top: 10px;background-color: white;">
        <template v-for="(productOrderDetail,index) in productOrder.productOrderDetails">
        <!--商品基本信息-->
        <div :key="index" style="padding:5px;border-bottom:1px solid #ebedf0;display:-webkit-flex;display: flex;">
          <!--商品图片-->
          <div style="width: 140px;height: 120px;">
            <router-link :to="{path:'/Product',query:{productId:productOrderDetail.product.id}}">
            <img :src="productOrderDetail.product.picUrl" style="width:100%;height: 100%;"/>
            </router-link>
            <!--<van-image :src="product.picUrl" lazy-load width="100%" fit="scale-down"/>-->
          </div>
          <!--商品数据-->
          <div style="font-size: 14px;width:calc(100% - 160px);padding-left:20px;">
            <div class="van-multi-ellipsis--l2" style="text-align: left;line-height: 24px;height:48px;" @click="$router.push({path:'/Product',query:{productId:productOrderDetail.product.id}})">{{productOrderDetail.product.name}}</div>
            <div style="text-align: left;cline-height: 30px;">
              <span style="font-size: 14px;color:red;">￥{{productOrderDetail.product.price}}</span>
              <span style="font-size: 14px;margin-left: 10px;">×{{productOrderDetail.productNumber}}份</span>
            </div>
            <div style="text-align: left;font-size: 14px;line-height: 30px;margin-top:20px;">
              总价:<span style="color:red;">￥{{productOrderDetail.priceTotal}}</span>
            </div>
          </div>
        </div>
        </template>
      </div>

      <!--订单详情-->
      <van-cell-group style="margin-top: 10px;">
        <van-cell title="订单编号" class="van-ellipsis">
          <template slot="default">
            <span>{{productOrder.orderNo}}</span>
          </template>
        </van-cell>
        <van-cell title="下单日期">
          <template slot="default">
            <span>{{productOrder.createTime}}</span>
          </template>
        </van-cell>
        <van-cell title="订单状态">
          <template slot="default">
            {{myVariable.orderTagMap[productOrder.tag]}}
          </template>
        </van-cell>
        <van-cell title="支付方式">
          <template slot="default">
            <span v-if="productOrder.paymentType==1">网上支付</span>
            <span v-if="productOrder.paymentType==2">货到付款</span>
          </template>
        </van-cell>
        <van-cell title="付款状态">
          <template slot="default">
            <van-tag v-if="productOrder.paymentStatus==0" type="danger">未付款</van-tag>
            <van-tag v-else-if="productOrder.paymentStatus==1"  type="success">已付款</van-tag>
            <van-tag v-else type="warning">已退款</van-tag>
          </template>
        </van-cell>
        <van-cell title="物流状态">
          <template slot="default">
            {{myVariable.orderDeliverStatusMap[productOrder.deliverStatus]}}
          </template>
        </van-cell>
        <van-cell title="总价">
          <template slot="default">
            <span style="color: red;">￥{{productOrder.totalPrice}}</span>
          </template>
        </van-cell>
        <van-cell title="成交价">
          <template slot="default">
            <span style="color: red;" v-if="productOrder.strikePrice!=null">￥{{productOrder.strikePrice}}</span>
            <span v-else>无</span>
          </template>
        </van-cell>
      </van-cell-group>
      <van-row type="flex" justify="end" style="background: white;padding: 5px 12px;">
          <van-button  v-if="productOrder.tag>=0&&productOrder.tag<=1"  round  type="default" size="small" @click="cancelOrder" style="margin-left: 5px;">取消订单</van-button>
          <!--如果是在线支付，未付款状态-->
          <van-button v-if="productOrder.paymentType==1&&productOrder.tag==0&&productOrder.paymentStatus==0" round  type="default" size="small" @click="payOrder" style="margin-left: 5px;">立即付款</van-button>
          <!--如果已经发货-->
          <van-button v-if="productOrder.tag==2" round  type="default" size="small" @click="confirmReceive" style="margin-left: 5px;">确认收货</van-button>
      </van-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'OrderDetail',
  data () {
    return {
      orderNo: '', // 订单编号
      productOrder: {} // 订单信息
    }
  },
  methods: {

    getOrder () { // 获取购物车信息
      this.$axios
        .get('/api/shop/order/' + this.orderNo)
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.productOrder = msg.data;
          } else { // 如果是其他错误信息
            this.$dialog.alert(msg.msg);
          }
        });
    },
    onClickLeft () { // 当点击返回时
      this.$router.go(-1);
    },
    payOrder () { // 确认付款
      const toast = this.$toast.loading({ // 定义组件
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        message: '正在准备支付环境……',
        loadingType: 'spinner'
      });
      let second = 5; // 表示4秒
      const timer = setInterval(() => {
        second--;
        if (second >= 2) {
          toast.message = '正在支付中……'
        } else if (second >= 1) {
          toast.message = '支付完成'
        } else {
          clearInterval(timer); // 清空计时器
          this.$axios // 执行支付
            .patch('/api/shop/order/' + this.orderNo + '/payment')
            .then(response => { // 获取返回数据
              const msg = response.data;
              if (msg.code === 0) {
                this.$toast.clear(); // 去掉模拟支付加载
                this.getOrder(); // 获取更新后的订单信息
              } else { // 如果修改失败
                this.$toast(msg.msg);
              }
            });
        }
      }, 1000);
    },
    confirmReceive () { // 确认收货
      this.$dialog.confirm({
        title: '系统提示',
        message: '确认收货吗？此操作无法恢复'
      }).then(() => { // 如果确认收货
        this.$axios // 将更新后的值传到服务端保存
          .patch('/api/shop/order/' + this.orderNo + '/reception')
          .then(response => { // 获取返回数据
            const msg = response.data;
            if (msg.code === 0) {
              this.getOrder();
              // this.$router.replace({ path: '/order/OrderDetail', query: { orderNo: this.orderNo } });
            } else { // 如果修改失败
              this.$toast(msg.msg);
            }
          });
      }).catch(() => {
        // on cancel
      });
    },
    cancelOrder () { // 取消订单
      this.$dialog.confirm({
        title: '系统提示',
        message: '确认取消订单吗？此操作无法恢复'
      }).then(() => { // 如果确认收货
        this.$axios // 将更新后的值传到服务端保存
          .patch('/api/shop/order/' + this.orderNo + '/cancel')
          .then(response => { // 获取返回数据
            const msg = response.data;
            if (msg.code === 0) {
              this.getOrder();
            } else { // 如果修改失败
              this.$toast(msg.msg);
            }
          });
      }).catch(() => {
        // on cancel
      });
    }
  },
  mounted () {
    if (this.$route.query.orderNo != null) {
      this.orderNo = this.$route.query.orderNo;
    }
    this.getOrder(); // 获取详细订单信息
  }
}
</script>
<style>

</style>
