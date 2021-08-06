<template>
  <div class="upload" v-wechat-title="this.text">
    <div v-if="!isLoading">
      <template v-for="(item, index) in checkItems">
        <div class="upload-list" :key="index" v-if="active == index">
          <!-- <van-cell-group :title="'上传'+item.name+'材料'" :border="false"> -->
          <van-cell-group :title="text" :border="false">
            <van-cell v-for="(citem, cindex) in item.data" :key="cindex" is-link @click="goUpload(citem, item.name)">
              <template #title>
                <span
                  :style="{color:'red','margin-right':citem.is_required!='1'?'12px':'5px'}">{{citem.is_required!='1'?'':'*'}}</span>
                <span class="custom-title"
                  :style="{color:citem.status=='审核不通过'?'red':''}">{{citem.name+'（'+ citem.attach.length +'张）'}}</span>
              </template>
              <div>
                <span
                  :class="citem.status=='审核不通过'?'warn':(citem.status=='审核通过'?'success':(citem.status=='待审核'?'loading':''))">{{citem.status}}</span>
              </div>
            </van-cell>
          </van-cell-group>
        </div>
      </template>
      <div class="btn">
        <van-button type="default" class="up" @click="goNext" :disabled="disabled">{{btntxt}}</van-button>
        <!-- <van-button v-if="active != 0" type="default" class="back" @click="toPrev()">上一步</van-button> -->
      </div>
    </div>
  </div>
</template>

<script>
  var jweixin = require('jweixin-module')
  import {
    zjGetPatient,
    zjGetCheckItem,
    zjUploadPatientStatus
  } from '../../api/zj';
  import Vue from 'vue';
  import {
    mapState
  } from "vuex";
  import {
    Toast
  } from 'vant';

  Vue.use(Toast);
  export default {
    data() {
      return {
        isLoading: true,
        papid: '',
        patient_id: '',
        category: '',
        checkItems: [],
        active: 0,
        list: [],
        btntxt: '下一步',
        disabled: false,
        checked: false,
        text: '',
        showcheck: false,
        follow: false,
        receive_phase: ''
      }
    },
    computed: {
      ...mapState(['patientOne', 'userInfo']),
    },
    async mounted() {
      if (this.$route.query.active) {
        this.active = parseInt(this.$route.query.active);
      }
      if (this.$route.query.follow) {
        this.follow = this.$route.query.follow;
        this.category = '阶段审核';
      }
      if (this.$route.query.category) {
        this.category = this.$route.query.category;
      }
      // console.log(this.active, this.$route.query)
      if (this.userInfo.patient) {
        this.papid = this.userInfo.patient.papid
        this.patient_id = this.userInfo.patient.id
      }
      // if(window.localStorage.getItem('check')){
      //   if(window.localStorage.getItem('check') === 'false'){
      //     this.checked = false
      //   }else{
      //     this.checked = true
      //   }
      // }
      await this.getData()
      window.localStorage.setItem('ischeck', 'true')
      this.$forceUpdate()
    },
    methods: {
      // toPrev() {
      //   let item = this.checkItems[this.active].data
      //   this.active = this.active - 1
      //   this.text='上传'+item.name+'材料'
      // },
      async getData() {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true
        });
        let res = await zjGetPatient({
          papid: this.papid
        })
        this.receive_phase = res.receive_phase
        let params = {
          papid: this.papid,
          category: this.category
        }
        if(this.follow) {
          params = {
            ...params,
            phase: res.receive_phase
          }
          console.log(params,'---1----')
        }
        this.checkItems = await zjGetCheckItem(params)
        this.text = '上传' + this.checkItems[this.active].name + '材料'
        // if (this.category == '后续复核') {
        //   this.text = '上传处方材料'
        //   let arr = []
        //   let st = ''
        //   if (this.checkItems.length > 0) {
        //     arr = this.checkItems[0].data.filter(item => item.type == '电子处方')
        //     if (arr.length > 0) {
        //       st = arr[0].status
        //     }
        //   }
        // }
        if (this.active == (this.checkItems.length - 1)) {
          this.btntxt = "提交审核材料"
          // console.log(this.active, this.btntxt, this.checkItems.length, this.checkItems)
        }
        Toast.clear()
        this.isLoading = false
      },
      goUpload(item, name) {
        this.$router.push({
          name: 'zjUploadItem',
          query: {
            id: item.id,
            papid: this.papid,
            category: name,
            active: this.active,
            follow: this.follow,
            name: item.name,
            phase: this.receive_phase
          }
        })
      },
      checkchange() {
        // console.log(this.checked)
        window.localStorage.setItem('check', this.checked)
        // console.log( window.localStorage.getItem('check'))
      },
      async goNext() {
        let item = this.checkItems[this.active].data
        let allup = true
        for (let i in item) {
          let ele = item[i]
          if (ele.status == "未上传" || ele.attach.length < 1) {
              allup = false
              Toast('请完善资料')
              return
          } else if (ele.status == "审核不通过") {
            Toast('您有驳回的材料，请重新上传')
            allup = false
            return
          }
        }
        if (this.active == (this.checkItems.length - 1)) {
          Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true
          });
          zjUploadPatientStatus({
            papid: this.papid,
            category: this.checkItems[this.active].name,
            phase: this.receive_phase
          }).then(res => {
            this.$router.replace({
              name: "zjMsg",
              query: {
                category: this.category
              }
            });
            Toast.clear();
          }).catch(err => {
            this.disabled = false;
            Toast.clear();
            Toast(err.response.data.message);
          })
        } else if (this.active == (this.checkItems.length - 2)) {
          this.btntxt = "提交审核材料"
          this.active = this.active + 1
          this.disabled = false;
          this.text = '上传' + this.checkItems[this.active].name + '材料'
        } else {
          this.active = this.active + 1
          this.disabled = false;
          this.text = '上传' + this.checkItems[this.active].name + '材料'
        }
      }
    },
  }
</script>

<style lang='less'>
  .upload {
    height: 100%;
    width: 100%;
    padding-bottom: 50px;
    box-sizing: border-box;

    .upload-list {
      box-sizing: border-box;
      margin: 16px;
      border-radius: 10px;
      box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0);
      overflow: hidden;

      .van-cell-group__title {
        background: @yellow;
        color: #fff;
        padding: 10px;
      }

      .warn {
        color: @red;
      }

      .success {
        color: #6CF025;
      }

      .loading {
        color: #F89900;
      }
    }

    .list {
      width: 92%;
      padding-bottom: 20px;
      box-sizing: border-box;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0);
      padding: 10px 0;
      margin-bottom: 15px;

      .upload-one {
        width: 95%;
        min-height: 67px;
        border-bottom: 1px solid #DCDCDC;
        padding-left: 10px;
        box-sizing: border-box;
        display: flex;
        margin: 0 auto;
        padding-top: 8px;
        box-sizing: border-box;

        .upload-text {
          height: 100%;
          // padding: 8px 0 ;
          flex: 1;

          p {
            color: rgba(16, 16, 16, 1);
            font-size: 16px;
            line-height: 25px;
          }

          h6 {
            color: rgba(147, 147, 147, 1);
            font-size: 12px;
            font-weight: 400;
          }
        }

        .upload-notice {
          box-sizing: border-box;
          height: 51px;
          width: 56px;
          background: #3C97FF;
          font-size: 13px;
          border-radius: 8px;
          background-color: rgba(60, 151, 255, 1);
          padding-top: 13.5px;
          padding-left: 16px;
        }

        .upload-notice1 {
          width: 82px;
          height: 51px;
          border-radius: 8px;
          background-color: rgba(32, 189, 232, 1);
          color: white;
          font-size: 10px;
          padding: 5px 0;
          display: flex;

          .upload_notice_left {
            width: 25px;
            border-right: 1px solid rgba(225, 225, 225, 0.5);
            padding: 0 7px;
            line-height: 14px;
          }

          .upload_notice_right {
            flex: 1;
            padding-top: 1px;
            padding-left: 15px;
          }
        }

        .upload-notice2 {
          width: 82px;
          height: 51px;
          border-radius: 8px;
          background-color: #E85520;
          color: white;
          font-size: 10px;
          padding: 5px 0;
          display: flex;

          .upload_notice_left {
            width: 25px;
            border-right: 1px solid rgba(225, 225, 225, 0.5);
            padding: 0 7px;
            line-height: 14px;
          }

          .upload_notice_right {
            flex: 1;
            padding-top: 1px;
            padding-left: 15px;
          }
        }

        .upload-notice3 {
          width: 82px;
          height: 51px;
          border-radius: 8px;
          background-color: #57E820;
          color: white;
          font-size: 10px;
          padding: 5px 0;
          display: flex;

          .upload_notice_left {
            width: 25px;
            border-right: 1px solid rgba(225, 225, 225, 0.5);
            padding: 0 7px;
            line-height: 14px;
          }

          .upload_notice_right {
            flex: 1;
            padding-top: 1px;
            padding-left: 15px;
          }
        }
      }
    }

    .check {
      width: 92%;
      margin: 0 auto;
      font-size: 13px;

      span {
        color: #5b7096;
      }
    }
  }
</style>