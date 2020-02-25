<template>
  <div class="home">
    <Head/>
    <!--主体部分-->
    <van-row  style="padding:5px;padding-bottom: 50px;">
      <!--商品图片-->
      <van-col span="6">
        <van-sidebar v-model="activeKey">
          <van-sidebar-item
            class="van-ellipsis"
            @click="tabClick($event,item.id)"
            :title="item.name"
            :key="item.id"
            :name="item.id"
            v-for="item in productTypes"/>
        </van-sidebar>
      </van-col>
      <van-col span="18" style="padding:0 3px;">
        <MainProductType
          ref="productView"
          :productTypeId="productTypeIdByTab"
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
    MainProductType: () => import('@/views/main/MainProductType.vue') // 引入各栏目组件的对象
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
          if (msg.code === 0) {
            this.productTypes = msg.data;
            if (this.productTypeIdByTab == null) { // 如果当前没有选中项，即第一次打开该页面
              this.productTypeIdByTab = this.productTypes[0].id;
              this.$refs.productView.initProducts(); // 手动刷新右侧内容
            }
          } else {
            this.$dialog.alert(msg.msg);
          }
        })
        .catch(error => {
          this.$dialog.alert(error);
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
    this.getProductTypes();// 获取产品栏目集合
  }
}
</script>
<style scoped>

</style>
