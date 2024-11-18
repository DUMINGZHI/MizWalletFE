<template>
    <div class="send-page"  v-loading="loading">
      <!-- Header -->
      <div class="header">
        <span class="back-arrow" @click="back">&lt;</span>
        <h1>Send</h1>
      </div>
  
      <!-- From Account Section -->
      <div class="input-section">
        <label>From</label>
        <div class="account-selector" @click="toggleAccountDropdown">
          <div class="account-info">
            <div class="account-avatar orange"></div>
            <div class="account-details">
              <div class="account-name">Account 1</div>
              <div class="account-address">{{ whatAddress() }}</div>
            </div>
          </div>
          <span class="dropdown-arrow">▼</span>
        </div>
        <!-- From Account Drop list-->
        <div v-show="showAccountDropdown" style="background-color: rgb(255, 255, 255);border: 1px solid rgb(204, 204, 204);box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 8px;">
          <el-card>
            <div class="account-info" style="display: flex;">
              <div class="account-avatar orange"></div>
              <div class="account-details" style="width: 83%;text-align: left;">
                <div class="account-name">Account 1</div>
                <div class="account-address">{{ whatAddress() }}</div>
              </div>
              <i class="el-icon-circle-check"></i>
            </div>
          </el-card>
        </div>
      </div>

      <!-- To Address Section -->
      <div class="input-section">
        <label>To</label>
        <div class="address-input">
          <input 
            type="text" 
            placeholder="Enter public address (0x) or domain name"
            style="font-size: 13px;"
             @blur="handleBlur"
            v-model="toAddress"
          >
          <button class="scan-button">
            <span class="scan-icon" @click="readText()" title="粘贴"><i class="el-icon-document-copy"></i></span>
          </button>
        </div>

        <p style="text-align: left;font-size: 10px;" :style="validAddress ? 'color:green;' :'color:red;font-weight: bold;' ">{{ validAddressRes }}</p>

        <input 
            v-if="validAddress"
            type="number" 
            placeholder="Enter transfer amount"
            style="font-size: 13px;"
            v-model="transferAmount"
          >
      </div>
  
      <!-- Account Lists -->
      <div class="accounts-section">
        <div class="tab-header">
          <button 
            :class="['tab-button', { active: activeTab === 'your-accounts' }]"
            @click="activeTab = 'your-accounts'"
          >
            Your accounts
          </button>
          <button 
            :class="['tab-button', { active: activeTab === 'contacts' }]"
            @click="activeTab = 'contacts'"
          >
            Contacts
          </button>
        </div>
  
        <div class="account-list" v-if="activeTab === 'your-accounts'">
          <div class="account-item">
            <div class="account-avatar orange"></div>
            <div class="account-details">
              <div class="account-name">Account 1</div>
              <div class="account-address">{{ whatAddress() }}</div>
            </div>
            <div class="account-balance">
              <div>${{ usdtBalance }} USD</div>
              <div class="eth-balance">{{ balance }} ETH</div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="cancel-button" @click="back">Cancel</button>
        <button class="continue-button" @click="checkBeforeSend">Continue</button>
      </div>
    </div>
  </template>
  
  <script>

  import axios from 'axios';

  export default {
    name: 'SendPage',
    data() {
      return {
        loading:true,
        toAddress: '',
        activeTab: 'your-accounts',
        showAccountDropdown: false,
        address:"",
        usdtBalance:"",
        balance:"",
        validAddress:false,
        validAddressRes:"",
        transferAmount:0
      }
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
    methods: {
      toggleAccountDropdown() {
        this.showAccountDropdown = !this.showAccountDropdown
      },
      back(){
        this.$router.push('/wallet');
      },
      whatAddress(){
        return this.address.substring(0,5) + "..." + this.address.substring(this.address.length-4,this.address.length)
      },
      handleBlur(){
        axios.get('http://localhost:8080/isValidAddress/'+this.toAddress)
        .then(res => {
          this.validAddress = res.data;
          if(res.data){
            this.validAddressRes = "Correctly formatted address"
          }else{
             this.validAddressRes = "Address in illegal format"
          }
        })
        .catch(error => {
          this.loading = false;
          console.error('请求失败:', error);
          return;
        });
      },
      async readText(){
        try {
          // 读取剪贴板中的文本
          const text = await navigator.clipboard.readText();
          this.toAddress = text;
        } catch (err) {
          console.error("无法读取剪贴板内容：", err);
        }
      },
      checkBeforeSend(){
        this.loading = true;
        if(this.toAddress == ''){
          this.$notify.error({
            title: '转账失败',
            message: '请填写正确的地址.'
          });
          this.loading = false;
          return;
        }

        if(this.transferAmount <= 0){
          this.$notify.error({
            title: '转账失败',
            message: '请填写正确的转账金额.'
          });
          this.loading = false;
          return;
        }

        if(this.balance == 0){
          this.$notify.error({
            title: '转账失败',
            message: '没有足够的余额进行转账.'
          });
          this.loading = false;
          return;
        }

      
        let transaction = {
          value:this.transferAmount,
          fromAddress:this.address,
          toAddress:this.toAddress
        };

        this.$alert('确认转账吗?此操作不可逆转,且无法追踪地址信息.', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            axios.post('http://localhost:8080/sendTransaction',transaction)
            .then(res => {
              this.$notify({
                title: '成功',
                message: '已成功转账,Gas费用为:.' + res.data,
                type: "success"
              });
            }).catch(error => {
              console.error('请求失败:', error);
            });
          }
        });

      }
    }
  }
  </script>
  
  <style scoped>
  .send-page {
    padding: 16px;
    max-width: 600px;
    margin: 0 auto;
    box-shadow: 10px 10px 15px rgba(0, 0, 0, 0.5);
  }
  
  .header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .back-arrow {
    font-size: 24px;
    margin-right: 16px;
    cursor: pointer;
  }
  
  h1 {
    font-size: 20px;
    margin: 0;
  }
  
  .input-section {
    margin-bottom: 24px;
  }
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  .account-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .account-info {
    display: flex;
    align-items: center;
  }
  
  .account-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
  }
  
  .orange {
    background: linear-gradient(135deg, #ff9f43, #ff6b6b);
  }
  
  .account-details {
    display: flex;
    flex-direction: column;
  }
  
  .account-name {
    font-weight: 500;
  }
  
  .account-address {
    color: #666;
    font-size: 14px;
  }
  
  .address-input {
    position: relative;
    display: flex;
  }
  
  input {
    flex: 1;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 16px;
  }
  
  .scan-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 20px;
    color: #1a73e8;
  }
  
  .tab-header {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 16px;
  }
  
  .tab-button {
    padding: 12px 24px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-size: 16px;
  }
  
  .tab-button.active {
    border-bottom-color: #1a73e8;
    color: #1a73e8;
  }
  
  .account-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 8px;
  }
  
  .account-balance {
    margin-left: auto;
    text-align: right;
  }
  
  .eth-balance {
    color: #666;
    font-size: 14px;
  }
  
  .action-buttons {
    display: flex;
    gap: 16px;
    margin-top: 32px;
  }
  
  .cancel-button, .continue-button {
    flex: 1;
    padding: 12px;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .cancel-button {
    background: white;
    border: 1px solid #e0e0e0;
  }
  
  .continue-button {
    background: #1a73e8;
    border: none;
    color: white;
  }
  
  .dropdown-arrow {
    color: #666;
  }
  </style>