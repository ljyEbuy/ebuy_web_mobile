<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="密码修改"
      fixed
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    >
    </van-nav-bar>
    <!--中间内容-->
    <div style="margin-top:50px;padding-bottom: 50px;">
      <van-form @submit="onSubmit">
        <van-field
          v-model="form.password"
          type="password"
          name="password"
          label="原密码"
          placeholder="请输入原密码"
          required
          clearable
          :rules="passwordRules"
        />
        <van-field
          v-model="form.newPass"
          type="password"
          name="password"
          label="新密码"
          placeholder="请输入新密码"
          required
          clearable
          :rules="newPassRules"
        />
        <van-field
          v-model="form.rePass"
          type="password"
          name="password"
          label="确认密码"
          placeholder="请输入确认密码"
          required
          clearable
          :rules="rePassRules"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            修改密码
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PasswordEdit',
  data () {
    this.passwordRules = [
      { required: true, message: '请填写原密码' },
      { validator: this.validatePassword, message: '密码长度必须在6-12之间' }
    ];
    this.newPassRules = [
      { required: true, message: '请填写新密码' },
      { validator: this.validatePassword, message: '密码长度必须在6-12之间' }
    ];
    this.rePassRules = [
      { required: true, message: '请填写新密码' },
      { validator: this.validatePassword, message: '密码长度必须在6-12之间' }
    ];
    return {
      form: {
        password: '',
        newPass: '',
        rePass: ''
      }
    }
  },
  methods: {
    onSubmit (values) { // 修改密码
      this.$axios // 将更新后的值传到服务端保存
        .patch('/api/shop/customer/password', JSON.stringify(this.form))
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.form = {}; // 重置表单
            this.$dialog.alert({
              title: '系统提示',
              message: msg.msg
            });
          } else { // 如果修改失败
            this.$toast(msg.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    validatePassword (value) { // 验证密码格式：长度
      if (value.length < 6 || value.length > 12) {
        return false; // 验证不通过
      }
    }
  }
}
</script>
<style>

</style>
