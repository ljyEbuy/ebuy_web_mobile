<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="注册页面"
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
          :rules="[{ required: true, message: '请填写用户名' }]"
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
        <van-field
          v-model="form.name"
          name="name"
          label="姓名"
          required
          clearable
          :rules="nameRules"
        />
        <van-field name="sex" label="性别" :rules="[{ required: true, message: '请填写性别' }]">
          <template #input>
            <van-radio-group v-model="form.sex" direction="horizontal">
              <van-radio name="1">男</van-radio>
              <van-radio name="2">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="form.tel"
          name="tel"
          type="tel"
          label="联系电话"
          required
          clearable
          :rules="[{ required: true, message: '请填写联系电话' }]"
        />
        <van-field
          v-model="form.address"
          name="address"
          label="地址"
          required
          clearable
          :rules="[{ required: true, message: '请填写地址' }]"
        />
        <van-field
          v-model="form.zip"
          name="zip"
          label="邮编"
          required
          clearable
          :rules="[{ required: true, message: '请填写邮编' }]"
        />
        <van-field
          v-if="webConfig.inviteCodeNeedOfCustomer=='true'"
          v-model="form.inviteCode"
          name="inviteCode"
          label="邀请码"
          placeholder="必须有邀请码才能注册"
          required
          clearable
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" :disabled="disabledButton">
            注册
          </van-button>
        </div>
      </van-form>
      <div style="text-align: right;padding-right: 24px;"><router-link to="/Login">已经账户？请登陆</router-link></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data () {
    this.nameRules = [
      { required: true, message: '请填写姓名' },
      { validator: this.validateName, message: '姓名长度不能超过10个字符' }
    ];
    return {
      disabledButton: false, // 按钮是否可用
      webConfig: {}, // 网站配置信息
      form: {
        username: '',
        password: '',
        name: '',
        sex: '',
        inviteCode: ''
      }
    }
  },
  methods: {
    onSubmit (values) { // 注册
      this.disabledButton = true; // 将按钮改为不可用，防止客户多次提交
      this.$axios
        .post('/api/shop/customer/reg', JSON.stringify(values), {
          params: {
            inviteCode: this.form.inviteCode
          }
        })
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.$dialog.alert({
              title: '系统提示',
              message: '注册成功'
            }).then(() => {
              this.$router.push('/Customer');
            });
          } else { // 如果注册失败
            this.disabledButton = false; // 将按钮改为可用状态
            this.$toast(msg.msg);
          }
        })
        .catch(error => {
          this.disabledButton = false; // 将按钮改为可用状态
          this.$toast(error);
        });
    },
    getWebConfig () { // 读取网站配置信息
      this.$axios
        .get('/api/shop/webconfig')
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            // this.webConfig = msg.data;
            this.$set(this.webConfig, 'inviteCodeNeedOfCustomer', String(msg.data.inviteCodeNeedOfCustomer));
          }
        })
        .catch(error => {
          this.$toast(error);
        });
    }
  },
  mounted () {
    this.getWebConfig(); // 读取配置信息
  }
}
</script>
<style>

</style>
