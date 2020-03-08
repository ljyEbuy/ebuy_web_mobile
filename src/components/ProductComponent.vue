<template>
      <div class="van-ellipsis" style="width: 100%;">
       <!-- <van-image :src="product.picUrl" lazy-load height="100" fit="scale-down"/>-->
        <van-image :src="product.picUrl" lazy-load :height="imageHeight" style="width: 100%;" fit="fill"/>
        <div style="width: 90%;" class="van-ellipsis">{{product.name}}</div>
        <van-row gutter="10" style="font-size: 1.2rem;">
          <van-col span="12"><span style="color:red;">￥{{product.price | decimalFilter}}</span></van-col>
          <van-col span="12">
            <span v-if="product.price!=product.originalPrice" style="color: darkgrey;text-decoration:line-through;">
              ￥{{product.originalPrice | decimalFilter}}
            </span>
          </van-col>
        </van-row>
      </div>
</template>

<script>
export default {
  // 单个产品组件
  name: 'ProductComponent',
  props: {
    product: { // 产品对象
      type: Object,
      default () {
        return {};
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
    return {}
  },
  methods: {
  }
}
</script>
