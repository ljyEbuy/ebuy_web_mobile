<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="登陆页面"
      fixed
    >
    </van-nav-bar>
    <!--中间内容-->
    <div style="margin-top:50px;padding-bottom: 50px;">
      <van-form @submit="onSubmit">
        <van-field
          v-model="form.username"
          name="username"
          label="用户名"
          placeholder="用户名"
          required
          clearable
        />
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          required
          clearable
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            登陆
          </van-button>
        </div>
      </van-form>
      <div style="text-align: right;padding-right: 24px;"><router-link to="/Reg">没有账户？请先注册</router-link></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit (values) { // 登陆
      this.$axios
        .get('/api/shop/customer/login', { params: values })
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.$router.push('/Customer');
          } else { // 如果登陆失败
            this.$toast(msg.msg);
          }
        })
        .catch(error => {
          this.$toast(error);
        });
    }
  }
}
</script>
<style>

</style>
