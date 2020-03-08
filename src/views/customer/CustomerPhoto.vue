<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="上传头像"
      fixed
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    >
    </van-nav-bar>
    <!--中间内容-->
    <div style="margin-top:50px;padding-bottom: 50px;">
      <img v-if="customer!=null&&customer.picUrl!=null&&customer.picUrl!=''" :src="customer.picUrl" style="width:100%;"/>
      <img v-else :src="noPic" style="width:100%;"/>
      <van-form>
        <div style="margin: 16px;text-align: center;">
          <van-uploader
            v-model="fileList"
            name="file"
            :after-read="afterRead"
            :max-count="1"/>
         <van-button round block type="info" @click="uploadPhoto">
            上传头像
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CustomerEdit',
  data () {
    this.nameRules = [
      { required: true, message: '请填写姓名' },
      { validator: this.validateName, message: '姓名长度不能超过10个字符' }
    ];
    return {
      file: null, // 获取上传的图片对象
      noPic: require('@/assets/nopic.jpg'), // 没有头像时的图片
      fileList: [], // 存储本地选择上传图片的路径
      customer: {}
    }
  },
  methods: {
    initForm (customer) { // 初始化表单条件
      // eslint-disable-next-line eqeqeq
      if (customer != null && customer.picUrl != null && customer.picUrl != '') { // 如果图片不为空
        this.$set(this.customer, 'picUrl', customer.picUrl + '?' + Math.random());
      }
    },
    getCustomer () { // 获取账户信息
      this.$axios
        .get('/api/shop/customer')
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.initForm(msg.data); // 初始化表单信息
          }
        });
    },
    afterRead (file) { // 将图片上传
      this.file = file;
    },
    uploadPhoto () { // 执行图片上传
      // 此时可以自行将文件上传至服务器
      const data = new FormData(); // 创建form对象
      data.append('file', this.file.file); // 通过append向form对象添加数据
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }; // 添加请求头
      this.$axios
        .post('/api/shop/customer/uploadPhoto', data, config)
        .then(response => {
          const msg = response.data;
          if (msg.code === 0) {
            this.fileList.splice(0); // 清空数组
            this.getCustomer(); // 成功之后重新读取账户信息
            this.$toast('上传成功');
          } else {
            this.$toast(msg.msg);
          }
        })
    }
  },
  mounted () {
    this.getCustomer();
  }
}
</script>
<style>

</style>
