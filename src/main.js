import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';

Vue.config.productionTip = false

// 引入 Element UI
import ElementUI from 'element-ui'

// 引入 Element UI 样式
import 'element-ui/lib/theme-chalk/index.css'

// 使用 Element UI 插件
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
