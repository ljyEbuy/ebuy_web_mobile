<template>
  <div style="background-color:#ffffff">
    <!--栏目标题-->
    <div style="color: gold;text-align: left;padding-left: 5px;padding-top: 3px;">店长推荐</div>
    <!--栏目内容，注意下面的id不能与其他组件的重复-->
    <div id="recommendationProducts">
      <!--用于放置要滚动的元素，必须要足够长，长度必须大于里面的所有元素宽度2倍（其中一个是复制另一个的DOM）总和-->
      <div id="recommendationProductsScoll">
        <!--防止要滚动的元素-->
        <div id="recommendationProductsScoll1">
          <template v-for="item in products">
            <div :key="item.id" style="text-align: center;" @click="clickProduct(item.id)">
              <img :src="item.picUrl" border="0"/><br/>
              {{item.name}}
            </div>
          </template>
          </div>
          <!--这里用于在JS中复制要滚动的元素，但要保持key和赋值元素不变(这里暂时没有找到保持key不变的方法，所以用两个一样的保存)-->
          <div id="recommendationProductsScollCopy" ref="copy">
            <template v-for="item in products">
              <div :key="item.id+'copy'" style="text-align: center;" @click="clickProduct(item.id)">
                <img :src="item.picUrl" border="0"/><br/>
                {{item.name}}
              </div>
            </template>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  // 代码参考http://120.76.118.101/ebuy_web_mobile/#/
  name: 'ProductOfRecommendationMarquee',
  data () {
    return {
      pagination: { // 记录分页数据
        // 分页-传递到服务端的数值
        limit: 3, // 每页的最大记录数
        page: 1, // 当前页
        total: 0 // 总记录数，分页-服务端返回的数值
      },
      products: [] // 获取产品集合
    }
  },
  methods: {
    getProducts () { // 获取产品栏目集合
      this.$axios
        .get('/api/shop/product/recommendationProducts', {
          params: {
            page: this.pagination.page,
            limit: this.pagination.limit
          }
        })
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.products = msg.data;
            this.$nextTick(() => { // 必须增加这个，让所有dom元素加载完后再执行滚动，否则如果元素较多未加载完就开始滚动，会出现问题
              this.play();
            });
          } else {
            this.$dialog.alert(msg.msg);
          }
        });
    },
    play () {
      var speed = 20; // 数字越大速度越慢
      var tab = document.getElementById('recommendationProducts');
      var tab1 = document.getElementById('recommendationProductsScoll1');
      var tab2 = document.getElementById('recommendationProductsScollCopy');
      // tab2.innerHTML = tab1.innerHTML; // 复制tab1的html给tab2
      // console.log(this.$refs.copy);
      // console.log(tab1.innerHTML);
      function Marquee () {
        if (tab2.offsetWidth - tab.scrollLeft <= 0) {
          tab.scrollLeft -= tab1.offsetWidth;
        } else {
          tab.scrollLeft++;
        }
      }
      setInterval(Marquee, speed);
      /* var MyMar = setInterval(Marquee, speed);
      tab.onmouseover = function () {
        clearInterval(MyMar)
      };
      tab.onmouseout = function () {
        MyMar = setInterval(Marquee, speed)
      }; */
    },
    clickProduct (productId) {
      this.$router.push({ path: '/Product', query: { productId: productId } });
    }
  },
  mounted () {
    this.getProducts(); // 获取数据接口方法
  }
}
</script>
<style  scoped>
  #recommendationProducts {
    margin-top: 5px;
    background: #FFF;
    overflow:hidden;
    width: 100%;
    margin-bottom: 5px;
  }
  #recommendationProducts img {
    border: 3px solid #F2F2F2;
    height: 23vw;
    margin-right: 1vw;
    width: 30vw;
  }
  #recommendationProductsScoll {
    float: left;
    width:1400%; /*尽可能设置长，为滚动容器的两倍以上*/
  }
  #recommendationProductsScoll1,#recommendationProductsScollCopy {
    float: left;
    display:-webkit-flex; /*用弹性布局来展示每个单项滚动列的内容，可以不让单项列使用float*/
    display: flex;/*用弹性布局来展示每个单项滚动列的内容，可以不让单项列使用float*/
  }
</style>
