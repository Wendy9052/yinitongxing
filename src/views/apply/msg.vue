<template>
  <div class="apply-msg msg-page">
    <div class="msg-hd">
      <!-- <van-icon :class="msg.status" size="120" :name="msg.icon" /> -->
      <div class="msg-png" style="height: auto;">
        <img :src="msg.png" alt="">
      </div>
    </div>
    <div class="msg-bd">
      <div class="title">{{msg.title}}</div>
      <div class="desc">{{msg.desc}}</div>
    </div>
    <div class="msg-bd" v-if="is_show">
      <label for="" class="login-label">快递单号录入：</label><input class="login-input" type="text" placeholder="请输入"
        placeholder-class="login-txtStyle" v-model.trim="sn" />
    </div>
    <div class="msg-ft">
      <van-button type="info" round block @click="submit" v-if="is_show">提交</van-button>
      <van-button v-for="(item, index) in msgButtons" :key="index" :type="item.type" round block @click="item.onClick" v-else>
        {{item.txt}}</van-button>
    </div>
  </div>
</template>

<script>
  import msgupload from "@/assets/msg_upload.png";
  import { CreateExpress } from '../../api/api'
  import { Toast } from 'vant';
  import {
    mapState
  } from "vuex";

  export default {
    data() {
      return {
        msgupload: msgupload,
        msg: {
          status: 'info', // success;warn;info;error
          icon: 'info', // vant-ui Icon name
          png: '',
          title: '',
          desc: ''
        },
        msgButtons: [],
        is_show: false,
        sn: ''
      }
    },
    computed: {
      ...mapState(['userInfo']),
    },
    created() {
      this.msgButtons = [{
        txt: '返回首页',
        type: 'info',
        onClick: this.toIndex.bind(this)
        // },
        // {
        //   txt: '返回首页',
        //   type: 'default',
        //   onClick: this.toIndex.bind(this)
      }]
      this.msg.png = this.msgupload

      this.msg.status = 'success'
      if (this.$route.query.value == '初审通过') {
        this.msg.title = '初审通过'
        this.msg.desc = '您好，您当前阶段电子材料已初审通过，请将相关纸质材料邮寄至项目办，若有问题，请联系电话：02089879'
        this.is_show = true
      } else {
        this.msg.title = '审核材料上传成功'
        // this.msg.icon = 'checked'
        this.msg.desc = '请耐心等待项目办工作人员审核，审核工作将在3个工作日内完成。'

        if(this.$route.query.value == 'express') {
          this.msg.desc = '请耐心等待项目办工作人员审核，审核工作将在3个工作日内完成。请谨慎保存好快递单号！'
        }

        if (this.$route.query.category == '后续复核') {
          this.msg.title = '处方上传成功等待审核'
        }
      }

    },
    methods: {
      toIndex() {
        // this.$wechat.closeWindow()
        this.$router.replace({path:'/'})
      },
      submit() {
        if(!this.sn) {
          Toast('请先填写快递单号')
          return
        }
        CreateExpress({sn: this.sn, papid: this.userInfo.patient.papid}).then(res => {
          this.$router.replace({
            name: "Query",
          });
          this.sn = ''
        }).catch(err => {
          this.sn = ''
          Toast(err.response.data.message)
        })
      }
    }

  }
</script>

<style lang="less">
  .apply-msg {
    .login-label {
      text-align: justify; text-align-last: left; font-size: 14px; color: rgb(36, 36, 36);
    }
    .login-input {
      height: 36px;
      // border-radius: 5px;
      color: rgba(136, 136, 136, 1);
      font-size: 14px;
      text-align: left;
      border: 1px solid rgba(232, 232, 232, 1);
      margin: 0 auto;
      padding-left: 10px;
      box-sizing: border-box;
      margin-bottom: 14px;
    }
  }
</style>