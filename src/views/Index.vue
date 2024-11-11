<template>
  <div class="hello" v-loading="loading">
    <div>
      <div class="address-container">
        <span class="address-text">{{ whatAddress() }}</span>
        <div><i class="el-icon-document-copy" @click="doCopyAddress" title="点击复制地址" style="cursor: pointer"></i></div>
      </div>

      <p style="font-weight: bold;">{{ balance.toFixed(4) }} ETH</p>
      <p style="margin-top: -12px;font-size: 12px;">${{ usdtBalance.toFixed(2) }} USD</p>
    </div>
    
    <div>
      <div class="icon-container">
        <IconButton label="Buy">
          <span><i class="el-icon-circle-plus-outline"></i></span> 
        </IconButton>
        <IconButton label="Send">
          <span>↗️</span>
        </IconButton>
        <IconButton label="Swap">
          <span>🔄</span>
        </IconButton>
        <IconButton label="Bridge">
          <span>🔁</span>
        </IconButton>
        <IconButton label="Portfolio">
          <span>📈</span>
        </IconButton>
      </div>
    </div>

    <TokenDisplay :ethValue="balance" :ethUsdtValue="usdtBalance"/>

  </div>
</template>

<script>

import axios from 'axios';
import IconButton from '../components/IconButton.vue';
import TokenDisplay from '../components/TokenDisplay.vue';

export default {
  components: {
    IconButton,
    TokenDisplay
  },
  name: 'IndexPage',
  data() {
    return {
      loading:true,
      address:"",
      usdtBalance:"",
      balance:""
    };
  },
  mounted(){
    axios.get('http://localhost:8080/walletBalance/')
        .then(res => {
          this.balance = res.data.balance;
          this.address = res.data.address;
          this.usdtBalance = res.data.usdtBalance;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          console.error('请求失败:', error);
      });
  },
  methods:{
    whatAddress(){
      return this.address.substring(0,5) + "..." + this.address.substring(this.address.length-4,this.address.length)
    },
    doCopyAddress(){
      navigator.clipboard.writeText(this.address);
    },

  
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .address-container {
      display: inline-flex;
      align-items: center;
      background-color: #e8f0fe; /* Light blue background */
      border-radius: 20px;
      padding: 5px 10px;
      font-family: Arial, sans-serif;
      color: #1a73e8; /* Blue text color */
      font-weight: bold;
      font-size: 14px;
    }
    .address-text {
      margin-right: 8px;
    }
    .copy-icon {
      width: 16px;
      height: 16px;
      background-color: #1a73e8;
      cursor: pointer;
    }
    .icon-container {
      display: flex;
      justify-content: space-around;
      padding: 20px;
    }
</style>
