<template>
  <div class="home">
    <!--头部组件-->
    <MainHead/>
    <!--导航-->
    <!--<van-tabs v-model="selectProductType" title-active-color="#fff" background="#fed700" color="#fff" @click="tabClick">-->
    <van-tabs v-model="selectProductType" title-active-color="#fed700" color="#fed700" @click="tabClick">
      <van-tab title="首页" class="home_tab">
        <!--默认主界面-->
        <MainBody
          ref="homeMain"
          :key="homeMainCount"
        />
      </van-tab>
      <van-tab :title="item.name" :key="item.id" :name="item.id"  v-for="item in productTypes" class="home_tab_producttype">
        <MainProductTypeOfPage
          :ref="'productType'+item.id"
          :productTypeId="productTypeIdByTab"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
    MainHead: () => import('@/views/main/MainHead.vue'), // 引入首页头部的组件
    MainBody: () => import('@/views/main/MainBody.vue'), // 引入首页默认的主组件
    // MainProductTypeOfScoll: () => import('@/views/main/MainProductTypeOfScoll.vue'), // 引入各栏目组件（不分页，滑动到底部更新）的对象
    MainProductTypeOfPage: () => import('@/views/main/MainProductTypeOfPage.vue') // 引入各栏目组件(分页)的对象
  },
  data () {
    return {
      homeMainCount: 1, // 作为key计时器，用来达到刷新该首页组件的效果
      selectProductType: '', // 选中的标签
      productTypes: [], // 获取栏目集合
      productTypeIdByTab: null // 当前tab所在的选项卡
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
          } else {
            this.$dialog.alert(msg.msg);
          }
        });
    },
    tabClick (name, title) { // 点击选项卡事件
      if (name === 0) { // 如果是首页
        this.productTypeIdByTab = null;
        this.homeMainCount++; // 用key来重置该组件，达到刷新效果
      } else {
        this.productTypeIdByTab = name;
        this.$nextTick(() => {
          const refName = 'productType' + name;// 获取要刷新的组件对象
          this.$refs[refName][0].initProducts();// 调用子组件的产品数据刷新方法
        })
      }
    }
  },
  mounted () {
    this.getProductTypes();// 获取产品栏目集合
  }
}
</script>
<style scoped>
  .home_tab{
    background-color:#DDDDDD;
    padding:5px 5px 55px 5px;
  }
  .home_tab_producttype{
    background-color:#DDDDDD;
    padding:5px 0 55px 0;
  }
</style>
