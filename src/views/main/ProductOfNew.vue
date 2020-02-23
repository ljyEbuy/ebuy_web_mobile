<template>
      <!---今日新品-->
      <div style="background-color:#ffffff">
        <div style="color: gold;text-align: left;padding-left: 5px;padding-top: 3px;">新品上市</div>
        <van-grid
          :gutter="10"
          type="flex"
          justify="space-between"
          :column-num="2">
          <van-grid-item  class="van-ellipsis" style="text-align: center;" v-for="product in products" :key="product.id" :to="{path:'/Product',query:{productId:product.id}}">
            <van-image ref="vantImage" :src="product.picUrl" lazy-load height="100" fit="scale-down"/>
            <div style="width: 90%;" class="van-ellipsis">{{product.name}}</div>
            <van-row gutter="10" style="font-size: 12px;">
              <van-col span="12"><span style="color:red;">￥{{product.price}}</span></van-col>
              <van-col span="12"><span style="color: darkgrey;text-decoration:line-through;">￥{{product.originalPrice}}</span></van-col>
            </van-row>
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
  name: 'ProductOfNew',
  data () {
    return {
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
    getProducts () { // 获取产品栏目集合
      this.$axios
        .get('/api/shop/product/newProducts', {
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
            /* this.$nextTick(() => {
              for (const vantImage of this.$refs.vantImage) {
                const image = vantImage.$refs.image; // 获取图片对象
                image.onload = () => { // 图片加载完成时
                  if (image.width > 1) { // 表示已经加载
                    // this.$set(image, 'height', 200)
                    image.height = 200;
                    this.$set(image, 'height', 200)
                  }
                };
              }
            }); */
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
      this.getProducts();// 获取产品集合
    }
  },
  mounted () {
    this.getProducts(); // 获取产品集合
  }
}
</script>
