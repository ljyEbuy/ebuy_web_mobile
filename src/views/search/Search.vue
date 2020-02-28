<template>
  <div>
    <!--头部-->
    <van-sticky>
      <van-row justify="center" align="center" style="background-color: #fed700;">
        <van-col span="4" style="text-align: center;">
          <van-icon name="arrow-left" size="24" color="#fff" style="margin-top: 14px;" @click="$router.go(-1)"/></van-col>
        <van-col span="20">
          <van-search
            id="serachInput"
            v-model="name"
            shape="round"
            background="gold"
            placeholder="请输入商品名称"
            show-action
            @input="search"
            @clear="clearSearch"
          >
            <div slot="action" @click="submitSearch" style="color: white;">搜索</div>
          </van-search>
        </van-col>
      </van-row>
    </van-sticky>
    <!--主体部分-->
    <van-row  style="padding:5px;padding-bottom: 50px;">
      <!--搜索列表：模拟京东、苏宁。如果点击搜索列表，则搜索框的值变为搜索列表的值并重新进行搜索，同时搜索列表消失。-->
      <van-list
        v-show="show"
        v-model="loading"
        :finished="finished"
        @load="onLoad"
      >
        <van-cell v-for="product in products" :key="product.id" :title="product.name" @click="clickProductListItem(product.name)"/>
      </van-list>
      <!--产品列表：模拟京东、苏宁。如果点击搜索列表。当点击搜索按钮，或是点击搜索列表时。产品列表将展示-->
      <ProductTypeOfOneColumnScoll
        v-show="productsViewShow"
        ref="productsView"
        :name="name"
      />
    </van-row>
  </div>
</template>

<script>

export default {
  name: 'ProductType',
  components: {
    ProductTypeOfOneColumnScoll: () => import('@/components/ProductTypeOfOneColumnScoll.vue') // 引入各栏目组件(分页)的对象
  },
  data () {
    return {
      show: true, // 是否显示搜索列表，true表示显示。
      loading: false,
      finished: false, // 默认开始是完成状态。因为开始是没有输入搜索值的
      productsViewShow: false, // 是否显示搜索出的产品视图，true表示显示。
      pagination: { // 记录分页数据
        // 分页-传递到服务端的数值
        limit: 15, // 每页的最大记录数
        page: 1, // 当前页
        total: 0 // 总记录数，分页-服务端返回的数值
      },
      name: '', // 商品名称
      products: [] // 获取产品集合，用于展示产品搜索列表
    }
  },
  methods: {
    getProducts () { // 获取产品集合，用于展示产品搜索列表
      this.$axios
        .get('/api/shop/product/searchProduct', {
          params: {
            page: this.pagination.page,
            limit: this.pagination.limit,
            name: this.name
          }
        })
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.pagination.total = msg.count;
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
        })
        .catch(error => {
          this.$toast(error);
        });
    },
    search () { // 执行搜索，用于搜索框中的值变化时
      // eslint-disable-next-line eqeqeq
      if (this.name != '') { // 只有搜索框中的值不为空时，才执行搜索
        this.show = true; // 让搜索列表显示
        this.productsViewShow = false; // 让搜索出来的产品展示组件消失
        this.$nextTick(() => {
          this.getProducts();
        });
      } else { // 如果为空
        this.products = []; // 将数组清空
      }
    },
    submitSearch () { // 当点击搜索按钮时
      // eslint-disable-next-line eqeqeq
      this.show = false; // 让搜索列表消失
      this.productsViewShow = true; // 让搜索出来的产品展示组件显示
      this.$nextTick(() => {
        this.$refs.productsView.initProducts();// 调用子组件的产品数据刷新方法
      });
    },
    clearSearch () { // 当点击搜索框清空按钮时
      this.name = name; // 让搜索框的值为点击列表的值
      this.show = false; // 让搜索列表消失
      this.productsViewShow = false; // 让搜索出来的产品展示组件消失
    },
    onLoad () { // 加载
      if (this.pagination.total === 0) { // 如果当前没有输入任何值，或是搜索不到
        this.loading = false // 处于不加载状态
        this.finished = true; // 处于完成状态
      } else {
        if (this.pagination.total > this.products.length) { // 如果还有记录没有读取完
          this.pagination.page++; // 让页码加1
          this.getProducts(); // 加载服务端的数据
        } else { // 如果已经加载完
          this.finished = true; // 表示加载完成
        }
      }
    },
    clickProductListItem (name) { // 当点击搜索出来的列表框时
      this.name = name; // 让搜索框的值为点击列表的值
      this.show = false; // 让搜索列表消失
      this.productsViewShow = true;
      this.$nextTick(() => {
        this.$refs.productsView.initProducts();// 调用子组件的产品数据刷新方法
      });
    }
  },
  mounted () {
    document.getElementById('serachInput').focus(); // 打开页面的时候自动将焦点放在搜素框。因为搜索框组件包装了，res到不了input文本框
    // this.$refs.serachInput.focus(); // 因为搜索框经过包装，ref识别不到指定input
  }
}
</script>
<style scoped>

</style>
