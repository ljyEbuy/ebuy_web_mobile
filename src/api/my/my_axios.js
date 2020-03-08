import { Toast, Dialog } from 'vant';
import axios from 'axios'
import myVariable from '@/api/my/my_variable.js'
import router from '@/router'

let toast = null;

const http = axios.create({
  baseURL: myVariable.baseUrl, // 设置初始URL
  // timeout: 60000, // 超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Methods': '*'
  },
  withCredentials: true // 跨域携带cookie
});

// 添加请求拦截器，调用时间比组件调用axios的早
http.interceptors.request.use(
  function (config) {
    toast = Toast.loading({ // 在服务器交互过程中，增加loading信息
      duration: 0, // 持续展示 toast
      forbidClick: true, // 禁用背景点击
      message: '努力加载中\n请稍后……',
      loadingType: 'spinner'
    });
    return config;
  },
  function (error) {
    if (toast != null) {
      toast.clear();
    }
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器，调用时间比组件调用axios的早
http.interceptors.response.use(
  function (response) {
    if (toast != null) {
      toast.clear();
    }
    const msg = response.data;
    // 对响应数据做点什么
    if (msg.code !== 0) { // 如果服务端返回的是错误数据
      if (msg.code === -9) { // 如果是没有登陆的请求
        Dialog.alert({
          title: '标题',
          message: msg.msg
        }).then(() => {
          router.push('/Login');
        });
      }
      // 错误信息交给各个控制器自己处理（因为移动端这里不同地方合适用不用的提示方式）
      // else {
      //   if (msg.msg != null && msg.msg !== '') { // 如果有返回错误信息
      //     Toast(msg.msg);
      //   }
      // }
    }
    return response;
  },
  function (error) {
    if (toast != null) {
      toast.clear();
    }
    Toast('网络连接错误' + error);
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default http;
