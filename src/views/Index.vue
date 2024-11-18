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
          <span>↪️</span> 
        </IconButton>
        <IconButton style="cursor: pointer;" label="Send" >
          <span @click="handleSendClick">↗️</span>
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
import Cookies from 'js-cookie';

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

    this.restoreSession();

  },
  methods:{
    restoreSession(){


      const wid = Cookies.get('wid');
      if (wid) {
          // 使用 wid 恢复登录状态
          this.checkLoginStatus(wid);
      }else{
        this.$notify.error({
          title: '失败',
          message: '连接钱包失败请重试.'
        });
        this.$router.push('/');
      }
    },

    startHeartbeat(wid) {
      setInterval(() => {
        axios.get('http://localhost:8080/heartbeat/'+wid)
          .then((response) => {
            if (response.data) {
                console.log('Heartbeat sent successfully');
            } else {
                console.error('Heartbeat failed');
                this.$notify.error({
                  title: '失败',
                  message: '连接钱包失败请重试.'
                });
                Cookies.set('wid',"");
                this.$router.push('/');
            }
          });
      }, 60000); // 每分钟发送一次

    },

    checkLoginStatus(wid) {
      axios.get('http://localhost:8080/checkLoginStatus/'+wid)
      .then(res => {
          if (res.data) {
            console.log('恢复连接成功');
            this.startHeartbeat(wid);

            axios.get('http://localhost:8080/walletBalance/'+wid)
              .then(res => {

                this.$notify({
                  title: '成功',
                  message: '钱包连接成功',
                  type: 'success'
                });

                this.balance = res.data.balance;
                this.address = res.data.address;
                this.usdtBalance = res.data.usdtBalance;
                this.loading = false;

          
              })
              .catch(error => {
                this.loading = false;
                console.error('请求失败:', error);
            });

          } else {
            console.log('连接已过期');
            this.$notify.error({
              title: '失败',
              message: '连接钱包失败请重试.'
            });
            Cookies.set('wid',"");
            this.$router.push('/');
          }
      });
    },

    handleSendClick(){
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
      padding: 10px;
    }
    .wallet{
      padding: 16px;
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
      height: 500px;
    }
</style>
