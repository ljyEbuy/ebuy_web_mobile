<template>
  <div>
    <!--头部-->
    <van-sticky>
      <van-row justify="center" align="center" style="background-color: #fed700;">
        <van-col span="4" style="text-align: center;">
          <van-icon name="scan" size="24" color="#fff" style="margin-top: 14px;"/></van-col>
        <van-col span="16">
          <van-search
            @focus="$router.push('/Search')"
            shape="round"
            background="gold"
            placeholder="请输入商品名称"
          />
        </van-col>
        <van-col span="4">
          <van-icon name="chat-o" size="24" color="#fff" style="margin-top: 14px;"/>
        </van-col>
      </van-row>
    </van-sticky>
  </div>
</template>

<script>
export default {
  // 首页头部组件
  name: 'Head',
  data () {
    return {
    }
  }
}
</script>
