<template>
  <!--用于首页中间展示的产品分类界面-->
<!--  <div style="background-color:#DDDDDD;padding:5px 5px 60px 5px;">-->
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      :immediate-check="immediateCheck"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!---产品展示-->
      <van-grid
        :gutter="5"
        :column-num="2">
        <van-grid-item style="text-align: center;" class="van-ellipsis" v-for="product in products" :key="product.id" :to="{path:'/Product',query:{productId:product.id}}">
          <ProductComponent
            :product="product"
            :imageHeight="imageHeight"
          />
        </van-grid-item>
      </van-grid>
    </van-list>
  </div>
</template>

<script>
export default {
  // 用滑动到底部更新来展示产品栏目的信息
  name: 'MainProductTypeOfScoll',
  components: {
    ProductComponent: () => import('@/components/ProductComponent.vue') // 引入单个产品展示的组件
  },
  props: {
    productTypeId: { // 获取从父组件传递过来的当前选择的值
      type: Number,
      default () {
        return null;
      }
    },
    imageHeight: { // 图片高度
      type: String,
      default () {
        return '30vw';
      }
    }
  },
  data () {
    return {
      loading: false, // van-list是否在加载中
      finished: false, // van-list是否加载完成
      immediateCheck: false, // 第一次进入页面时是否出发加载时间，false表示不触发
      pagination: { // 记录分页数据
        // 分页-传递到服务端的数值
        limit: 10, // 每页的最大记录数
        page: 1, // 当前页
        total: 0, // 总记录数，分页-服务端返回的数值
        hideOnSinglePage: false // 如果只有一页，则隐藏分页栏，隐藏之后无法再选择恢复（例如改变每页的最大记录数为单页后，无法再修改每页记录数，因为分页栏已经消失）。false为不隐藏，如果不隐藏可以不在分页插件设置该属性。
      },
      products: [] // 获取产品集合
    }
  },
  methods: {
    initProducts () { // 用于第一次加载，表示初始化该组件数据
      this.finished = true; // 重置完成状态，这里必须设置为已加载完，否则onLoad在父组件调用该方法时，可能在该方法执行到一半时执行，导致一些逻辑上的问题。该属性必须this.getProducts()中的判断来解除完成状态
      this.pagination.page = 1; // 初始化页码为1
      this.pagination.total = 0; // 初始化记录为0
      this.products = []; // 初始化产品集合
      this.getProducts(); // 加载产品集合
    },
    getProducts () { // 获取产品集合
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
            this.pagination.total = msg.count; // 获取总记录数
            // 遍历服务端传递过来的产品集合，用push来添加
            for (const product of msg.data) {
              this.products.push(product);
            }
            this.loading = false;
            // eslint-disable-next-line eqeqeq
            if (this.pagination.total <= this.products.length) { // 如果加载到客户端的产品数量与服务器的总数一致
              this.finished = true; // 将加载状态改为已经加载完
            } else { // 特意加上，避免onLoad在父组件直接调用初始化方法时如果第一个执行，这里要重新解封
              this.finished = false; // 解封完成状态，必须存在
            }
          } else {
            this.$dialog.alert(msg.msg);
          }
        });
    },
    onLoad () { // 加载数据。如果是父组件第二次调用方法重置，则onload可能第一个执行
      if (this.pagination.total > this.products.length) { // 如果还有记录没有读取完
        this.pagination.page++; // 让页码加1
        this.getProducts(); // 加载服务端的数据
      } else { // 如果已经加载完
        this.finished = true; // 表示加载完成
      }
    }
  },
  mounted () {
    // this.getProducts();
  }
}
</script>
