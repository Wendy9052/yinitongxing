<template>
  <div class="apply-out msg-page">
    <div class="msg-hd" v-if="msg.icon || msg.png">
      <!-- <van-icon :class="msg.status" size="120" :name="msg.icon" /> -->
      <div class="msg-png">
        <img :src="msg.png" alt="">
      </div>
    </div>
    <div class="msg-bd">
      <div class="title">{{msg.title}}</div>
      <div v-if="msg.desc" class="desc">{{msg.desc}}</div>
    </div>
    <div class="msg-ft">
      <van-button v-for="(item, index) in msgButtons" :key="index" :type="item.type" :plain="item.plain" :hairline="item.plain?true:false" round block @click="item.onClick">{{item.txt}}</van-button>
    </div>
  </div>
</template>

<script>
import msgerror from "@/assets/msg_error.png";

export default {
  data(){
    return {
      msgerror: msgerror,
      msg: {
        status: '', // 绿：success;黄：warn;蓝：info;红：error
        icon: '', // 成功：success;警告：warning；中性信息：info；叉叉：clear
        png: '',
        title: '',
        desc: ''
      },
      msgButtons: [],
    }
  },
  created() {
    this.msg.title = '您已出组'
    // this.msg.icon = 'warning'
    this.msg.png = msgerror
    this.msg.status = 'error'
    this.msgButtons = [
      {
        txt: '返回首页',
        type: 'default',
        onClick: this.back.bind(this)
      }
    ]
  },
  methods:{
    back(){
      // this.$wechat.closeWindow()
      this.$router.replace({path:'/'})
    }
  }
}
</script>

<style lang="scss" scoped>
.out{
  width: 100%;
  height: 100%;
  padding-top:40px;
}
  .notice{
    height: 127px;
    width: 92%;
    margin: 0 auto;
    margin-top: 10px;
    border-radius: 6px;
    padding-top: 20px;
    box-sizing: border-box;
    box-shadow:#C3C3C3 0px 0px 10px;
    .icon{
      float:left;
      margin-left: 20px;
      margin-right: 15px;
    }
     .text{
        line-height: 87px;
        color: rgba(16, 16, 16, 1);
        font-size: 26px;
      }

  }
</style>