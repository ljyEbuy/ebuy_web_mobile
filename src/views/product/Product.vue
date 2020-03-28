<template>
  <div>
    <van-nav-bar
      :title="product.name"
      fixed
      left-text="返回"
      right-text="详情"
      left-arrow
      @click-left="onClickLeft"
      @click-right="toProductContent"
    />
   <!-- <van-image ref="vantImage" :src="product.picUrl" width="100%" fit="fill" style="margin-top: 50px;"/>-->
    <van-swipe @change="onChangePreviewPicture">
      <van-swipe-item v-for="(item, index) in product.previewPictures" :key="index"  @click="showPreviewPicture(product.previewPictures,index)">
          <van-image :src="item" style="width: 100%;" height="70vw"  fit="fill"/>
      </van-swipe-item>
      <template #indicator>
        <div class="custom-indicator">
          {{ current+1 }}/{{product.previewPictures.length}}
        </div>
      </template>
    </van-swipe>
    <!--商品基本信息信息-->
    <!--如果有价格优惠-->
    <template v-if="product.price!=product.originalPrice">
      <div style="background: crimson;padding: 5px;padding-left:5%;text-align: left;font-size: 14px;color:#ffffff;">
        <div>￥<span  style="font-weight: bold;font-size: 20px;">{{product.price}}</span></div>
        <div><del>￥<span style="font-size: 12px;">{{product.originalPrice}}</span></del></div>
      </div>
    </template>
    <div style="padding:0 12px;text-align: left;">
      <!--如果没有价格优惠-->
      <template v-if="product.price==product.originalPrice">
        <div style="text-align: left;font-size: 28px;font-weight: bold;color:red;">￥{{product.price}}</div>
      </template>
      <div style="margin-top:5px;font-size: 18px;font-weight: bold;">{{product.name}}</div>
      <div style="margin-top:5px;font-size: 12px;line-height: 20px;height:20px;">库存：{{product.repository}}</div>
      <div style="font-size: 12px;line-height: 20px;height:20px;">销量：{{product.salesVolume}}</div>
      <div style="font-size: 12px;line-height: 20px;height:20px;">人气：{{product.click}}</div>
      <div style="font-size: 12px;line-height: 20px;height:20px;">
        推荐指数：<van-rate v-model="product.recommendation" readonly :size="16" style="height: 20px;padding-top: 2px;"/>
      </div>
      <div style="margin-top:5px; text-align: justify;font-size: 12px;line-height: 20px;color: darkgrey;">{{product.description}}</div>
    </div>
    <!--商品描述信息-->
    <div id="product_content_div" style="padding-bottom: 50px;margin-top: 20px;">
      <div style="background: #f2f2f2;line-height: 36px;height: 36px;">商品详情</div>
      <div id="product_content" v-html="product.content">
      </div>
    </div>

    <!--商品购买弹出框-->
    <ProductBuy v-model="showCart" :product="product"/>
    <!--底部-->
    <van-goods-action>
      <van-goods-action-icon icon="wap-home-o" to="/" text="首页"/>
<!--      <van-goods-action-icon icon="cart-o" text="购物车" info="5" to="/Cart"/>-->
      <van-goods-action-icon icon="cart-o" text="购物车"  to="/Cart"/>
      <van-goods-action-button type="warning" @click="showCartDialog" text="加入购物车"/>
      <!--<van-goods-action-button type="danger" text="立即购买"/>-->
    </van-goods-action>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
export default {
  name: 'Product',
  components: {
    ProductBuy: () => import('@/views/product/ProductBuy.vue') // 引入首页头部的组件
  },
  data () {
    return {
      current: 0, // 用于产品预览图切换
      showCart: false, // 显示是否购买的对话框
      product: { // 获取产品
        previewPictures: [] // 这里加上，避免在从服务端读取到指定数组的时候，因为没定义无法在dom处{{product.previewPictures.length}}读取长度
      }
    }
  },
  methods: {
    getProduct () { // 获取产品
      const productId = this.$route.query.productId; // 获取传递过来的产品id
      if (productId !== '') { // 如果该ID存在
        this.$axios
          .get('/api/shop/product/' + productId)
          .then(response => { // 获取返回数据
            const msg = response.data;
            if (msg.code === 0) {
              this.product = msg.data;
            } else {
              this.$dialog.alert(msg.msg);
            }
          });
      }
    },
    onClickLeft () { // 当点击返回时
      this.$router.go(-1);
    },
    toProductContent () { // 跳转到产品内容的锚点
      document.querySelector('#product_content_div').scrollIntoView(true);
    },
    showCartDialog () { // 当点击购物车时，显示购物车购物界面
      this.showCart = true;
    },
    onChangePreviewPicture (index) { // 当预览图改变时
      this.current = index;
    },
    showPreviewPicture (previewPictures, startPosition) { // 展示产品预览图
      ImagePreview(previewPictures, startPosition); // 当点击图片时，预览该图片
    }
  },
  mounted () {
    this.getProduct(); // 获取产品集合
  }
}
</script>
<style >
  .custom-indicator {
    position: absolute;
    right: 5px;
    bottom: 5px;
    padding: 2px 5px;
    font-size: 12px;
    color:#FFFFFF;
    background: rgba(0, 0, 0, 0.7);;
  }
  /*设置文章内容（富文本）中的图片最大不超过手机屏幕*/
  #product_content{
    /*font-size:1.2rem!important;*/
    font-size: 14px;
    text-align: justify;
    padding: 0 12px
  }
  /*设置文章内容（富文本）中的图片最大不超过手机屏幕*/
  #product_content img{
    width:100%;
    /*max-width: 100%;*/
    height:auto;
  }
  /*设置文章内容（富文本）中的视频最大不超过手机屏幕*/
  #product_content embed{
    max-width:100%;
  }
  /*设置文章内容（富文本）中的表格最大不超过手机屏幕*/
  #product_content table{
    max-width: 100%;
    table-layout: fixed; /*列宽由表格宽度和列宽度设定，特别注意，使用了这个fixed之后，表格的第一行的列的宽度将会直接决定后面行的列的宽度，务必注意*/
  }
  /*设置文章内容（富文本）中的表格最大不超过手机屏幕*/
  #product_content table td{

  }
</style>
