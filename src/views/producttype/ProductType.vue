<template>
  <div class="home">
    <Head/>
    <!--主体部分-->
    <van-row  style="padding:5px;padding-bottom: 50px;">
      <!--产品栏目列表-->
      <van-col span="6">
        <van-sidebar v-model="activeKey" style="width: 100%;">
          <van-sidebar-item
            class="van-ellipsis"
            @click="tabClick($event,item.id)"
            :title="item.name"
            :key="item.id"
            :name="item.id"
            v-for="item in productTypes"/>
        </van-sidebar>
      </van-col>
      <!--产品栏目对应的产品列表-->
      <van-col span="18" style="padding:0 3px;">
        <MainProductTypeOfScoll
          ref="productView"
          :productTypeId="productTypeIdByTab"
          @hook:mounted="getProductTypes"
          imageHeight="22vw"
        />
      </van-col>
    </van-row>
  </div>
</template>

<script>

export default {
  name: 'ProductType',
  components: {
    Head: () => import('@/views/Head.vue'), // 引入头部的组件
    MainProductTypeOfScoll: () => import('@/views/main/MainProductTypeOfScoll.vue') // 用滑动到底部更新来展示产品栏目的信息
  },
  data () {
    return {
      productTypes: [], // 获取栏目集合
      productTypeIdByTab: null, // 当前tab所在的选项卡
      activeKey: 0 // 选项卡
    }
  },
  methods: {
    getProductTypes () { // 获取产品栏目集合
      this.$axios
        .get('/api/shop/producttype')
        .then(response => { // 获取返回数据
          const msg = response.data;
          // eslint-disable-next-line
          if (msg.code == 0) {
            this.productTypes = msg.data;
            if (this.productTypeIdByTab == null) { // 如果当前没有选中项，即第一次打开该页面
              this.productTypeIdByTab = this.productTypes[0].id;
              this.$refs.productView.initProducts(); // 手动刷新右侧内容。注意，这里必须配合 @hook:mounted="getProductTypes"使用。否则子组件还未加载完的话，这里调用会出现错误
            }
          } else {
            this.$toast(msg.msg);
          }
        });
    },
    tabClick (index, productTypeId) { // 点击选项卡事件
      this.productTypeIdByTab = productTypeId;
      this.$nextTick(() => {
        this.$refs.productView.initProducts();// 调用子组件的产品数据刷新方法
      })
    }
  },
  mounted () {
    // this.getProductTypes();// 获取产品栏目集合
  }
}
</script>
<style scoped>

</style>
