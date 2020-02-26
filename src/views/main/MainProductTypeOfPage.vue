<template>
  <!---今日新品-->
  <div style="background-color:#ffffff">
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
  // 用分页展示产品栏目的信息
  name: 'MainProductTypeOfPage',
  components: {
    ProductComponent: () => import('@/components/ProductComponent.vue') // 引入单个产品展示的组件
  },
  props: {
    productTypeId: { // 获取从父组件传递过来的当前选择的值
      type: Number,
      default () {
        return null;
      }
    }
  },
  data () {
    return {
      pagination: { // 记录分页数据
        // 分页-传递到服务端的数值
        limit: 10, // 每页的最大记录数
        page: 1, // 当前页
        total: 0 // 总记录数，分页-服务端返回的数值
      },
      products: [] // 获取产品集合
    }
  },
  methods: {
    initProducts () { // 用于第一次加载，表示初始化该组件数据
      this.pagination.page = 1; // 初始化页码为1
      this.pagination.total = 0; // 初始化记录为0
      this.products = []; // 初始化产品集合
      this.getProducts(); // 加载产品集合
    },
    getProducts () { // 获取产品栏目集合
      this.$axios
        .get('/api/shop/product/normalProducts', {
          params: {
            productTypeId: this.productTypeId,
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
  }
}
</script>
