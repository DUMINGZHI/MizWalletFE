// src/router/index.js

import Vue from 'vue';
import Router from 'vue-router';

// 导入组件
import Home from '../views/Home.vue';
import Wallet from '../views/Index.vue';
import Send from '../views/Send.vue';

// 使用 Vue Router 插件
Vue.use(Router);

// 创建路由实例并导出
export default new Router({
  mode: 'history',  // 使用 history 模式，去除 URL 中的 hash
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: Wallet
    },
    {
      path: '/send',
      name: 'send',
      component: Send
    }
  ]
});
