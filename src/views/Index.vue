<template>
  <div class="wallet" v-loading="loading">
    <div>
      <div class="address-container">
        <span class="address-text">{{ whatAddress() }}</span>
        <div><i class="el-icon-document-copy" @click="doCopyAddress" title="点击复制地址" style="cursor: pointer"></i></div>
      </div>

      <p style="font-weight: bold;">{{ balance }} ETH</p>
      <p style="margin-top: -12px;font-size: 12px;">${{ usdtBalance }} USD</p>
    </div>
    
    <div>
      <div class="icon-container">
        <IconButton label="Buy">
          <span><i class="el-icon-circle-plus-outline"></i></span> 
        </IconButton>
        <IconButton style="cursor: pointer;" label="Send" >
          <span @click="handleSendClick">↗️</span>
        </IconButton>
        <IconButton style="cursor: pointer;" label="Swap">
          <span>🔄</span>
        </IconButton>
        <IconButton style="cursor: pointer;" label="Bridge">
          <span>🔁</span>
        </IconButton>
        <IconButton style="cursor: pointer;" label="Portfolio">
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
      balance:"",

      showSendPage:false
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
    handleSendClick(){
      console.log("gotosend");
      
      this.$router.push('/send');
    },

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
    .wallet{
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
      height: 500px;
    }
</style>
