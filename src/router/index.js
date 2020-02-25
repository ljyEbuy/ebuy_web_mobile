import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const MyLayer = () => import('@/components/Layer') // 提供给有children的路由组件（并且没有要展示视图的容器展示）。特别说明：如果没有，则该路由组件的子路由将无法展示

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
      {
        path: '', // 默认界面
        name: 'Main',
        component: () => import('@/views/main/Main.vue')
      },
      {
        path: '/ProductType', // 产品
        name: 'ProductType',
        component: () => import('@/views/producttype/ProductType.vue')
      },
      {
        path: '/Cart', // 购物车
        name: 'Cart',
        component: () => import('@/views/cart/Cart.vue')
      },
      {
        path: '/BuyCart', // 提交订单界面
        name: 'BuyCart',
        component: () => import('@/views/cart/BuyCart.vue')
      },
      {
        path: 'Login', // 登陆界面
        name: 'Login',
        component: () => import('@/views/customer/Login.vue')
      },
      {
        path: 'Reg', // 注册界面
        name: 'Reg',
        component: () => import('@/views/customer/Reg.vue')
      },
      {
        path: 'Customer', // 个人中心
        component: MyLayer,
        children: [ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
          {
            path: '', // 默认界面
            name: 'Customer',
            component: () => import('@/views/customer/Customer.vue')
          },
          {
            path: 'PasswordEdit', // 密码修改
            name: 'PasswordEdit',
            component: () => import('@/views/customer/PasswordEdit.vue')
          },
          {
            path: 'CustomerEdit', // 基本修改
            name: 'CustomerEdit',
            component: () => import('@/views/customer/CustomerEdit.vue')
          },
          {
            path: 'CustomerPhoto', // 上传头像
            name: 'CustomerPhoto',
            component: () => import('@/views/customer/CustomerPhoto.vue')
          }
        ]
      },
      {
        path: 'Order', // 订单中心
        component: MyLayer,
        children: [ // 使用 children 属性，实现子路由，同时，子路由的 path 前面，不要带 / ，否则永远以根路径开始请求，这样不方便我们用户去理解URL地址
          {
            path: '', // 默认界面
            name: 'OrderManage',
            component: () => import('@/views/order/OrderManage.vue')
          },
          {
            path: 'OrderDetail', // 订单详情页面
            name: 'OrderDetail',
            component: () => import('@/views/order/OrderDetail.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/Product',
    name: 'Product',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/product/Product.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
