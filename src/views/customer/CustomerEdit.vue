<template>
  <div>
    <!--顶部-->
    <van-nav-bar
      title="基本信息修改"
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
          v-model="form.email"
          name="email"
          label="电子邮箱"
          required
          clearable
          :rules="[{ required: true, message: '请填写电子邮箱' }]"
        />
        <van-field
          v-model="form.intro"
          name="intro"
          type="textarea"
          rows="5"
          maxlength="250"
          label="个人简介"
          required
          clearable
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            修改基本信息
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
      form: {}
    }
  },
  methods: {
    initForm (customer) { // 初始化表单条件
      this.$set(this.form, 'name', customer.name);
      this.$set(this.form, 'sex', String(customer.sex));
      this.$set(this.form, 'tel', customer.tel);
      this.$set(this.form, 'address', customer.address);
      this.$set(this.form, 'zip', customer.zip);
      this.$set(this.form, 'email', customer.email);
      this.$set(this.form, 'intro', customer.intro);
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
    onSubmit (values) { // 修改密码
      this.$axios // 将更新后的值传到服务端保存
        .put('/api/shop/customer', JSON.stringify(this.form))
        .then(response => { // 获取返回数据
          const msg = response.data;
          if (msg.code === 0) {
            this.$dialog.alert({
              title: '系统提示',
              message: msg.msg
            });
          } else { // 如果修改失败
            this.$toast(msg.msg);
          }
        });
    },
    validateName (value) { // 验证密码格式：长度
      if (value.length > 100) {
        return false; // 验证不通过
      }
    }
  },
  mounted () {
    this.getCustomer();
  }
}
</script>
<style>

</style>
