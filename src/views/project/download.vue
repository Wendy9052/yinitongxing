<template>
  <div class="downlaod-page">
    <div class="top-img"><img src="@/assets/download.jpg" alt=""></div>
    <van-cell
      clickable
      @click="checkAll"
      class="checkAll"
    >
      <span >全选所有项目</span>
      <template #icon="props">
        <!-- <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" /> -->
        <van-checkbox checked-color="#FF9615" v-model="allcheck"/>
      </template>
    </van-cell>
    <div class="btn">
      <van-button type="default"  @click="gogo" class='up' >发送到邮箱</van-button>
      <van-button type="default"  @click="back" class='back' >返回</van-button>
    </div>
    <van-checkbox-group v-model="result" ref="checkboxGroup" class='project'>
      <van-cell-group>
        <van-cell
          v-for="(item, index) in list"
          clickable
          :key="index"
          @click="toggle(index)"
        >
          <!-- <span @click.stop="showpop(item)">{{item.name}}</span> -->
          <div class="right-icon">
            <img src="@/assets/download-icon.jpg" alt=""  @click.stop="showpop(item)">
            <span>{{item.name}}</span>
          </div>
          <template #icon>
            <van-checkbox :name="item.id" checked-color="#FF9615" ref="checkboxes" />
          </template>
          <!-- <div class="right-icon" slot="right-icon" @click.stop="showpop(item)">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#wxicon-icon-download"></use>
            </svg>
          </div> -->
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
    <van-popup v-model="showPopup" closeable close-icon-position="top-left" close-icon="clear" class="pdfview">
    <iframe ref="iframe" v-if="document.filepath" :src="'/static/pdfjs/web/viewer.html?file=' + encodeURIComponent(baseUrl+document.filepath)" frameborder="0"></iframe>
      <!-- <div class="page-ft">
        <van-icon name="clear" @click="clear"/>
      </div> -->
    </van-popup>
    <van-dialog v-model="showdialog" title="请输入电子邮箱地址"  show-cancel-button @confirm="confirm" @cancel='cancel'>
      <van-cell-group>
        <p class="message">系统自动将资料文件发送至您的邮箱</p>
        <van-field
          v-model="value"
          label="email"
          left-icon="smile-o"
          placeholder="请输入电子邮箱地址"
        />
      </van-cell-group>
    </van-dialog>
  </div>

</template>

<script>
var jweixin = require('jweixin-module')  
let hostname = location.hostname;
hostname = hostname.substring(hostname.indexOf('.'));
let appHost = `${location.protocol}//api${hostname}`;
const baseUrl = `${appHost}`;
import {documents, sendEmail} from '../../api/api'
import Vue from 'vue';
import { Popup, Dialog, Toast} from 'vant';

Vue.use(Popup);
Vue.use(Dialog);
Vue.use(Toast);

export default {
   data(){
     return{
       content:'',
       column_id: 58, // 本地: 60; 测试: 86; 正式： 58;
       list:[],
       result:[],
       showPopup: false,
       config_id: window.localStorage.getItem('config_id'),
       document:'',
       baseUrl:baseUrl,
       showdialog: false,
       value:'',
       allcheck:false,
       project_id: null
     }
   },
   created() {
    if(this.$route.query.project == 'zj') {
      this.project_id = 1
    }else if(this.$route.query.project == 'yp') {
      this.project_id = 0
    }
   },
   mounted(){
    this.getlist()
   },
   methods:{
      checkAll(index) {
        if(this.allcheck == true){
          this.result = []
        }else{
           this.$refs.checkboxGroup.toggleAll(true);
        }
        this.allcheck = !this.allcheck
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    async getlist(){
      
      await documents({params:{
        config_id : this.config_id,
        "DocumentSearch[project_id]" : this.project_id
      }}).then((res)=>{
        // console.log(baseUrl,res.items,'res')
         this.list = res.items
      })
    },
    showpop(item){
       this.document = item;
       this.showPopup = true;
       this.$nextTick(()=>{
        let height = document.documentElement.clientHeight || document.body.clientHeight
        let iframe = this.$refs.iframe
        // console.log(this.document.filepath)
        iframe.height =  (height - 44)+'px';
      })
    },
    clear(){
      this.showPopup = false;
    },
    gogo(){
      if(this.result.length === 0){
       Toast('请选择要下载的资料')
       return false
      }
       this.showdialog = true
    },
    confirm(){
      if(!this.value){
        Toast("请输入邮箱地址");
        return false
      }
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(!reg.test(this.value)){
          Toast("邮箱格式不正确");
          return false
        }
      this.showdialog = false
      Toast.loading({ duration: 0 })
      // console.log(this.value,this.result)
      sendEmail({
         email: this.value,
         document_ids : this.result
      }).then((res)=>{
        Toast.success({
          duration: 2000, // 持续展示 toast
          forbidClick: true,
          message: '已发送，请注意查收。',
          onClose: () => {
            // this.$wechat.closeWindow()
            this.$router.replace({path:'/'})
          }
         })
      }).catch((err)=>{
        Toast(err)
      })
    },
    back(){
      // this.$wechat.closeWindow()
      this.$router.replace({path:'/'})
    },
    cancel(){
      this.value = ''
    }
   }

}
</script>

<style lang="scss" scoped>
  .downlaod-page {
    height: 100vh;
    width: 100%;
    padding-top: 22px;
    padding-bottom: 118px;
    box-sizing: border-box;
    background-color: #FBFBFB;
    overflow: scroll;
    .top-img {
      width: 100%; text-align: center;
      img {
        width: 70%;
      }
    }
    .project{
      width: 92%;
      margin: 0 auto;
      border-radius: 10px;
      margin-top: 15px;
      span{
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        // font-weight: bold;
        // text-decoration: underline;
        margin-left: 10px;
      }
      .right-icon > .icon {
        width: 2rem; height: 2rem; vertical-align: middle;
      }
      .right-icon {
        display: flex; align-items: center;
        img {
          width: 22px; height: 20px; margin-left: 1.5rem;
        }
      }
    }
    .checkAll{
       width: 92%;
      margin: 15px auto;
      border-radius: 30px;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11);
      span{
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        // font-weight: bold;
        margin-left: 10px;
      }
    }
    .title{
      font-size: 14px;
      color: #656565;
      padding: 20px;
      box-sizing: border-box;
    }
    .list{
      width: 100%;
      height: 100%;
      .page{
        height:26px;
        padding-left: 30px;
        display:flex;
        color: rgba(145, 145, 145, 1);
        font-size: 16px;
        margin-bottom: 12px;
        line-height: 26px;
        span{
          margin-left: 8px;
          line-height: 30px;
        }
        .left{
           flex: 1;
        }
      }
    }
    .btn{
      position: fixed;
      bottom: 0;
      left: 0;
      background: #FBFBFB ;
      z-index: 99;
      padding-bottom: 20px;
      box-sizing: border-box;
   }
  }
  .page-ft{
     position: fixed;
     top: 10px;
     right: 10px;
  }
  .message{
    font-size: 13px;
     padding:0 20px;
     box-sizing: border-box;
     color: #656565;
     text-align: center;
  }
 .van-icon-arrow::before {
     width: 40px;
     padding-top: 5px;
  }
</style>
<style lang="scss">
.downlaod-page {
  .pdfview {
    width: 100%; height:100%; position:absolute;
    iframe {
      width:100%;
    }
    .van-popup__close-icon {
      color: #fff; text-shadow: 0 0 5px rgba(black, 0.3);
    }
  }
  .van-cell-group {
    border-radius: 30px; background-color: #FBFBFB;
  }
  .van-cell {
    border-radius: 30px; padding: 14px 20px; box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.11); margin-bottom: 15px;
  }

}
</style>