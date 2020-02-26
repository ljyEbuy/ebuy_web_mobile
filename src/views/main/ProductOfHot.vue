<template>
      <!---今日新品-->
      <div style="background-color:#ffffff">
        <div style="color: gold;text-align: left;padding-left: 5px;padding-top: 3px;">热门商品</div>
        <van-grid
          :gutter="10"
          type="flex"
          justify="space-between"
          :column-num="2">
          <van-grid-item  class="van-ellipsis" style="text-align: center;" v-for="product in products" :key="product.id" :to="{path:'/Product',query:{productId:product.id}}">
            <ProductComponent
              :product="product"
            />
          </van-grid-item>
        </van-grid>
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
</template>

<script>
export default {
  // 热门商品组件
  name: 'ProductOfHot',
  components: {
    ProductComponent: () => import('@/components/ProductComponent.vue') // 引入单个产品展示的组件
  },
  data () {
    return {
      pagination: { // 记录分页数据
        // 分页-传递到服务端的数值
        limit: 6, // 每页的最大记录数
        page: 1, // 当前页
        total: 0 // 总记录数，分页-服务端返回的数值
      },
      products: [] // 获取产品集合
    }
  },
  methods: {
    getProducts () { // 获取产品栏目集合
      this.$axios
        .get('/api/shop/product/hitProducts', {
          params: {
            page: this.pagination.page,
            limit: this.pagination.limit
          }
        })
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.pagination.total = msg.count;
            this.products = msg.data;
          } else {
            this.$dialog.alert(msg.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    pageChange (value) { // 获取当前页码
      this.pagination.page = value;
      this.getProducts();// 获取产品栏目集合
    }
  },
  mounted () {
    this.getProducts();// 获取产品栏目集合
  }
}
</script>
