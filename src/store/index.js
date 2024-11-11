import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);  // 使用 Vuex 插件

// 创建 Vuex store
const store = new Vuex.Store({
  state: {  
   connectedAddress : "",
   privateKey : "",
  },
  mutations: {
    setConnectedAddress(state, payload) {
        state.connectedAddress = payload;
    },
    setPrivateKey(state, payload) {
        state.privateKey = payload;
    }
  },
  actions: {
    
  },

});

export default store;
