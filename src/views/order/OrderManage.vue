<template>
  <div>
    <!--顶部-->
    <van-sticky>
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      @click-right="$router.push('/Customer')"
    >
      <van-icon name="user-o" slot="right" />
    </van-nav-bar>
    <van-dropdown-menu>
      <van-dropdown-item v-model="tag" :options="tagOption" @change="changeOrderQuery" />
      <van-dropdown-item v-model="paymentType" :options="paymentTypeOption" @change="changeOrderQuery"/>
    </van-dropdown-menu>
    </van-sticky>
    <!--中间内容-->
    <div style="padding-bottom:50px;">
      <template v-for="(order,index) in orders">
        <!--订单基本信息-->
        <div :key="index" style="font-size: 12px;" @click="toOrderDetail(order.orderNo)">
          <van-row >
            <van-col span="20" class="van-ellipsis">
              订单编号：{{order.orderNo}}
            </van-col>
            <van-col span="4">
            </van-col>
          </van-row>
          <!--订单详细信息-->
          <div style="padding:5px;border-bottom:1px solid #ebedf0;border-top:1px solid #ebedf0;display:-webkit-flex;display: flex;">
            <!--商品图片-->
            <div style="width: 120px;height: 100px;">
              <!--<img :src="order.productOrderDetails[0].product.picUrl" style="width:90%;height: 100px;"/>-->
              <van-image :src="order.productOrderDetails[0].product.picUrl" lazy-load width="100%" height="100%" fit="fill"/>
            </div>
            <!--订单数据-->
            <div style="width:calc(100% - 130px);">
              <div class="van-multi-ellipsis">订单状态：
                {{myVariable.orderTagMap[order.tag]}}
              </div>
              <div class="van-multi-ellipsis">
                付款状态：
                <van-tag v-if="order.paymentStatus==0" type="danger">未付款</van-tag>
                <van-tag v-else-if="order.paymentStatus==1"  type="success">已付款</van-tag>
                <van-tag v-else type="warning">已退款</van-tag>
              </div>
              <div class="van-multi-ellipsis">付款方式：
                <template v-if="order.paymentType==1">网上支付</template>
                <template v-if="order.paymentType==2">货到付款</template>
              </div>
              <div>订单数：<span style="color:red;">{{order.productOrderDetails.length}}</span></div>
              <div v-if="order.strikePrice!=null">成交金额：<span style="color:red;">￥{{order.strikePrice}}</span></div>
              <div v-else>商品总价：<span style="color:red;">￥{{order.totalPrice}}</span></div>
              <div class="van-ellipsis">下单时间：{{order.createTime}}</div>
            </div>
          </div>
        </div>
      </template>
      <!--分页组件-->
      <van-pagination
        style="margin-top: 10px;"
        show-page-size="3"
        force-ellipses
        v-model="pagination.page"
        :total-items="pagination.total"
        :items-per-page="pagination.limit"
        @change="pageChange"
      />
    </div>
  </div>
</template>

<script>

export default {
  name: 'OrderManage',
  data () {
    return {
      pagination: { // 记录分页数据
        // 分页-传递到服务端的数值
        limit: 5, // 每页的最大记录数
        page: 1, // 当前页
        total: 0 // 总记录数，分页-服务端返回的数值
      },
      tag: '', // 订单状态的选项
      paymentType: '', // 付款方式列表选项值
      tagOption: [
        { text: '全部订单', value: '' },
        { text: '待付款', value: '0' },
        { text: '待发货', value: '1' },
        { text: '待收货', value: '2' },
        { text: '已收货', value: '3' },
        { text: '已完成', value: '4' }
      ],
      paymentTypeOption: [
        { text: '选择付款方式', value: '' },
        { text: '网上支付', value: 1 },
        { text: '货到付款', value: 2 }
      ],
      orders: [] // 订单信息
    }
  },
  methods: {
    getOrders () { // 获取订单集合
      this.$axios
        .get('/api/shop/order', {
          params: {
            page: this.pagination.page,
            limit: this.pagination.limit,
            tag: this.tag,
            paymentType: this.paymentType
          }
        })
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.pagination.total = msg.count;
            this.orders = msg.data;
          } else {
            this.$dialog.alert(msg.msg);
          }
        });
    },
    pageChange (value) { // 获取当前页码
      this.pagination.page = value;
      this.getOrders();// 刷新集合数据
    },
    changeOrderQuery () { // 当订单下拉列表的值修改
      this.getOrders();// 刷新集合数据
    },
    onClickLeft () { // 当点击返回时
      this.$router.go(-1);
    },
    toOrderDetail (orderNo) { // 跳转到订单详情页面
      this.$router.push({ path: '/order/OrderDetail', query: { orderNo: orderNo } });
    }
  },
  mounted () {
    if (this.$route.query.tag != null) {
      this.tag = String(this.$route.query.tag);
    }
    this.getOrders(); // 获取订单集合
  }
}
</script>
<style>

</style>
