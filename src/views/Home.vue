<template>
  <div class="hello">
    <h1>Miz Wallet</h1>
    <div>
      <el-row v-if="showHome">
        <el-button type="primary" plain @click="showCreate">创建钱包</el-button>
        <el-button type="success" plain @click="showCreateWallet = false,connectWalletM=true,showHome=false">助记词导入钱包</el-button>
        <el-button type="success" plain @click="showCreateWallet = false,connectWallet=true,showHome=false">私钥导入钱包</el-button>
      </el-row>
    </div>

   <!-- 助记词导入钱包 -->
   <div v-if="connectWalletM">
      <el-card>

        <div class="container">
          <span><h3>请填写助记词</h3> </span>
          <span style="margin-top: -10px;">  <i class="el-icon-close" @click="hideKeyConnect" style="cursor: pointer"></i></span>
        </div>

        <div class="word-grid" style="margin-top: 10px;">
            <div v-for="(_, index) in 12" :key="index">
              <span> 
                <el-input
                  style="width:80px;"
                  v-model="inputConnectMnemonic[index]"
                  >
                </el-input>
              </span>
            </div>
          </div>

        <el-button style="margin-top: 30px;" type="success" @click="doNext('connectM')">导入钱包</el-button>

      </el-card>
    </div>

    <!-- 私钥导入钱包 -->
    <div v-if="connectWallet">
      <el-card>

        <div class="container">
          <span><h3>请输入私钥</h3> </span>
          <span style="margin-top: -10px;">  <i class="el-icon-close" @click="hideKeyConnect" style="cursor: pointer"></i></span>
        </div>

        <div style="margin-top: 30px;">
            <el-input
              type="textarea"
              autosize
              v-model="privateKey">
            </el-input>
        </div>

        <el-button style="margin-top: 30px;" type="success" @click="doNext('connect')">导入钱包</el-button>

      </el-card>
    </div>


    <!-- 助记词 -->
    <div v-if="showCreateWallet">
      <el-card >

        <div class="container">
          <span><h3>助记词</h3> </span>
          <span style="margin-top: -10px;">  <i class="el-icon-close" @click="hideCreate" style="cursor: pointer"></i></span>
        </div>

        <div v-if="loading">
          <i class="el-icon-loading"></i>
        </div>
        <div v-else>
          <p>助记词是您恢复钱包的方法,请保存至私密位置,防止泄露.</p>
          <div class="word-grid">
            <div class="word-item" v-for="(word, index) in words" :key="index">{{ word }}</div>
          </div>
          <div style="display: flex;margin-top: 10px;">
            <i class="el-icon-document-copy" v-if="!copy" @click="copyText" title="点击复制助记词" style="cursor: pointer"></i>
            <i class="el-icon-document-checked" v-else>已复制到粘贴板</i>
          </div>

          <el-button style="margin-top: 10px;" type="success" @click="doNext('mnemonic')">下一步</el-button>
        </div>
      </el-card>
    </div>

    <!-- 验证助记词 -->
    <div v-if="showMnemonic">
      <el-card >
        <div class="container">
          <span><h3>验证助记词</h3> </span>
          <span style="margin-top: -10px;">  <i class="el-icon-close" @click="hideMnemonic" style="cursor: pointer"></i></span>
        </div>

        <div v-if="loading">
          <i class="el-icon-loading"></i>
        </div>
        <div v-else>
          <p>请输入空缺的助记词进行安全验证.</p>
          <div class="word-grid">
            <div class="word-item" v-for="(word, index) in words" :key="index">
              <span v-if="checkMnemonic(index)"> 
                <el-input
                  style="width: 70px;"
                  v-model="inputMnemonic[index]"
                  >
                </el-input>
              </span>
              <span v-else>{{ word }}</span>
            </div>
          </div>

          <el-button type="primary" style="margin-top: 10px;" @click="doNext('privateKey')">下一步</el-button>
        </div>
      </el-card>
    </div>

    <!-- 地址和公私钥 -->
    <div v-if="showKey" >
      <el-card>

        <div class="container">
          <span><h3>钱包信息</h3> </span>
          <span style="margin-top: -10px;">  <i class="el-icon-close" @click="hideKeyPage" style="cursor: pointer"></i></span>
        </div>

        <p>以下是创建的钱包信息,请不要在任何地方给任何人泄漏您的私钥,防止钱包被盗.</p>
    
        <p>钱包地址</p>
        <p>{{ address }}</p>

        <p>公钥</p>
        <p>{{ publicKey }}</p>

        <div>
          <p>私钥</p>
          <p style="color: red;" v-if="showPrivateKey" >{{ privateKey }}</p>
          <p v-else>************************************************************ <i class="el-icon-unlock" @click="doShowPrivateKey" title="显示私钥" style="cursor: pointer"></i></p>
          <i class="el-icon-document-copy" v-if="!copyPrivateKey" @click="doCopyPrivateKey" title="点击复制私钥" style="cursor: pointer"></i>
          <i class="el-icon-document-checked" v-else>已复制私钥到粘贴板</i>

      </div>
 
        
        <el-button style="margin-top: 10px;" type="success" @click="doNext('connect')">连接钱包</el-button>

      </el-card>
    </div>

  </div>
</template>

<script>

import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'HelloWorld',
  data() {
    return {
      loading:true,

      showHome : true,
      connectWallet : false,
      connectWalletM : false,
      showCreateWallet : false,
      showMnemonic :false,
      showKey : false,
      copy : false,
      copyPrivateKey : false,
      showPrivateKey : false,

      inputMnemonic:[],
      inputConnectMnemonic:[],
      randomIndex : [],
      text : "12344",

      words: [],
      originalWords: "",
      address: "",
      privateKey: "",
      publicKey:"",
    };
  },
  methods:{
    showKeyPage(){
      this.showMnemonic = false;
      this.showKey = true;
    },
    hideKeyPage(){
      this.inputMnemonic = [];
      this.showHome = true;
      this.showKey = false;
    },
    hideKeyConnect(){
      this.inputMnemonic = [];
      this.showHome = true;
      this.connectWallet = false;
      this.connectWalletM = false;
    },
    showMnemonicPage(){
      this.showHome = false;
      this.showMnemonic = true;
    },
    hideMnemonic(){
      this.inputMnemonic = [];
      this.showHome = true;
      this.showMnemonic = false;
    },
    showCreate(){

      this.showHome = false;
      this.showCreateWallet = true;
      axios.get('http://localhost:8080/generateMnemonic')
        .then(res => {
          this.originalWords = res.data;
          this.words = res.data.split(' ');
          this.loading = false;
        })
        .catch(error => {
          console.error('请求失败:', error);
      });
  
    },
    hideCreate(){
      this.inputMnemonic = [];
      this.showHome = true;
      this.showCreateWallet = false;
    },

    checkMnemonic(index){
      return this.randomIndex.includes(index);
    },

    generateUniqueRandomNumbers() {
      const uniqueNumbers = new Set();
      
      // 生成 3 个不重复的随机数字
      while (uniqueNumbers.size < 3) {
        const randomNum = Math.floor(Math.random() * 12);  // 生成 0 到 11 之间的随机数
        uniqueNumbers.add(randomNum);  // 添加到 Set 中，自动去重
      }

      // 将 Set 转换为数组
      return [...uniqueNumbers];
    },

    doNext(tab){
      if(tab == "mnemonic"){
        this.randomIndex = this.generateUniqueRandomNumbers();
        this.showCreateWallet = false;
        this.showMnemonicPage();
      }else if(tab == "privateKey"){
        let ok = false;
        for (let key in this.inputMnemonic) {
            if(!this.inputMnemonic[key] == ''){
              // console.log(`key: ${key}, value: ${this.inputMnemonic[key]}`);
              if(this.words[key] != this.inputMnemonic[key]){
                ok = false;
                break;
              }else{
                ok = true;
              }
            }
        }

        if(ok){
          axios.post('http://localhost:8080/generateOrRecoverWallet',this.originalWords)
            .then(res => {
              this.address = res.data.address;
              this.publicKey = res.data.publicKey;
              this.privateKey = res.data.privateKey;
              this.showMnemonic = false;
              this.showHome = false;
              this.showKeyPage();
            }).catch(error => {
              console.error('请求失败:', error);
            });
        }else{
          this.$notify.error({
            title: '验证失败',
            message: '请重新确认好您的助记词后再次重试.'
          });
        }

      }else if(tab == "connect"){
        if(this.privateKey == ''){
          this.$notify.error({
            title: '连接失败',
            message: '请输入私钥后再次重试.'
          });
        }else{
          axios.post('http://localhost:8080/importWalletByPrivateKey',this.privateKey,
          {
            headers: {
              'Content-Type': 'application/json'  // 明确设置 Content-Type
            }
          }).then(res => {

            Cookies.set('wid', res.data);
            this.$router.push('/wallet');

          }).catch(error => {
            console.error('连接失败:', error);
          });
        }
      }else if(tab == "connectM"){


        if (this.inputConnectMnemonic.length !== 12 || this.inputConnectMnemonic.every(element => element == undefined || element == null || element == '')) {
          this.$notify.error({
            title: '连接失败',
            message: '请输入正确的助记词后再次重试.'
          });
        }

        let req = this.inputConnectMnemonic.join(' ');
    
        axios.post('http://localhost:8080/generateOrRecoverWallet',req,
        {
          headers: {
            'Content-Type': 'application/json'  // 明确设置 Content-Type
          }
        }).then(res => {

          sessionStorage.setItem('wid',res.data);
          this.$router.push('/wallet');
          
        }).catch(error => {
          console.error('连接失败:', error);
        });
        
      }
    },

    doShowPrivateKey(){
      this.showPrivateKey = true;
    },

    doCopyPrivateKey(){
      navigator.clipboard.writeText(this.privateKey); // 将文本写入剪贴板
      this.copyPrivateKey = true;
    },

    copyText() {
      navigator.clipboard.writeText(this.originalWords); // 将文本写入剪贴板
      this.copy = true;
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.word-grid {
  display: grid; /* 使用 Grid 布局 */
  grid-template-columns: repeat(4, 1fr); /* 每行显示4个格子 */
  gap: 10px; /* 设置格子之间的间隙 */
  max-width: 500px; /* 设置最大宽度 */
  margin: 0 auto; /* 居中 */
}

.word-item {
  display: flex;
  justify-content: center; /* 单词水平居中 */
  align-items: center; /* 单词垂直居中 */
  background-color: #f0f0f0; /* 背景色 */
  padding: 20px; /* 内边距 */
  border: 1px solid #ddd; /* 边框 */
  border-radius: 8px; /* 边框圆角 */
  text-align: center; /* 文字居中 */
  font-size: 16px; /* 字体大小 */
}


.container {
  display: flex;          /* 使用 flexbox */
  justify-content: space-between; /* 左右分布，span 之间的空间尽可能大 */
  align-items: center;    /* 垂直居中对齐 */
  width: 100%;            /* 设置宽度为父元素宽度 */
}

.card {
  position: absolute;  /* 使卡片绝对定位 */
  top: 10%;             /* 垂直方向上居中 */
  left: 50%;            /* 水平方向上居中 */
  transform: translate(-50%, -50%); /* 精确地将卡片调整到中间 */
  width: 800px;         /* 设置卡片的宽度 */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}
h3 {
  margin: -10px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
