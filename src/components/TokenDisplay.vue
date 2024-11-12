<!-- TokenDisplay.vue -->
<template>
    <div class="token-display">
      <div class="token-nav">
        <div :class="{'active': selectedTab === 'Tokens'}" @click="selectedTab = 'Tokens'">Tokens</div>
        <div :class="{'active': selectedTab === 'NFTs'}" @click="selectedTab = 'NFTs'">NFTs</div>
        <div :class="{'active': selectedTab === 'Activity'}" @click="selectedTab = 'Activity'">Activity</div>
      </div>
  
      <div v-if="selectedTab === 'Tokens'" class="token-info">
        <div class="token-icon">
          <span> <img width="60px;" src="../assets/eth.png" /></span>
        </div>
        <div class="token-details">
          <div class="token-name">Ethereum</div>
          <div class="token-amount">{{ ethValue }} ETH</div>
        </div>
        <div class="token-price">${{ ethUsdtValue }} USD</div>
      </div>
    </div>
  </template>
  
  <script>


  export default {
    props:{
        ethValue: {
            required: true
        },
        ethUsdtValue: {
            required: true
        }
    },
    data() {
      return {
        selectedTab: 'Tokens'
      };
    }
  };
  </script>
  
  <style scoped>
  .token-display {
    font-family: Arial, sans-serif;
    color: #333;
  }
  
  .token-nav {
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid #ddd;
    margin-bottom: 20px;
  }
  
  .token-nav div {
    padding: 10px;
    cursor: pointer;
    color: #666;
  }
  
  .token-nav .active {
    font-weight: bold;
    color: #1a73e8; /* 选中标签的颜色 */
    border-bottom: 2px solid #1a73e8;
  }
  
  .token-info {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }
  
  .token-icon {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .token-details {
    flex-grow: 1;
    text-align: left;
  }
  
  .token-name {
    font-weight: bold;
  }
  
  .token-amount {
    color: #666;
  }
  
  .token-price {
    font-weight: bold;
    color: #333;
  }
  </style>
  