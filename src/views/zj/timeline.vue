<template>
  <div class="apply-timeline msg-page">
    <template v-if="showSearch">
      <div class="banner">
        <div class="banner-img">
          <img src="../../assets/kv.jpg" alt="">
        </div>
      </div>
      <div class="search-timeline">
        <div class="shadow-box">
          <van-cell-group title="进度查询" :border="false">
            <van-field label="患者姓名" v-model="name" placeholder="请输入姓名" size="large" clearable />
            <van-field label="身份证号码" v-model="idsn" placeholder="请输入身份证号码" size="large" clearable />
          </van-cell-group>
        </div>
        <div class="msg-ft">
          <van-button type="info" :disabled="submitBtnDisabled" round block @click="search()">查询</van-button>
        </div>
      </div>
    </template>

    <template v-if="showProgress">
      <div class="msg-hd">
        <div class="msg-png">
          <img :src="nowpng" alt="">
        </div>
      </div>
      <div class="msg-bd" :class="nowpng==msgupload?'msg-bd-wait':''">
        <div class="title">
          <van-icon v-if="nowpng==msgupload" name="underway-o" />{{nowstatus}}</div>
      </div>
      <div class="msg-progress">
        <div class="progress-list">
          <div class="progress-title">当前进度展示</div>
          <div class="list-cells">
            <div class="list-cell" v-for="(pitem, pindex) in progress" :key="pindex">
              <div class="cell-time">
                <div>{{splitDate(pitem.created, 'before')}}</div>
                <div>{{splitDate(pitem.created, 'after')}}</div>
              </div>
              <div class="cell-point">
                <van-icon v-if="pindex == 0" size="17" name="warning" />
                <div v-else class="point"></div>
              </div>
              <div class="cell-cont">
                <div class="cell-title">{{pitem.content}}</div>
                <div v-if="pitem.remark" class="cell-desc">{{pitem.remark}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn">
        <van-button type="default" @click="back" class="up">返回首页</van-button>
      </div>
    </template>
  </div>
</template>

<script>
  import Vue from "vue";
  import {
    Dialog,
    Toast
  } from 'vant'
  import {
    isIdCardNo
  } from '../../utils/utils';
  import {
    zjcheckin,
    zjQueryApplyProgress,
    zjGetPatient
  } from '../../api/zj'
  import msgupload from "@/assets/msg_upload.png";
  import msgsuccess from "@/assets/msg_success.png";
  import msgerror from "@/assets/msg_error.png";
  Vue.use(Dialog)
  Vue.use(Toast)

  export default {
    data() {
      return {
        msgupload: msgupload,
        msgsuccess: msgsuccess,
        msgerror: msgerror,
        nowpng: '',
        msg: {
          status: '', // success;warn;info;error
          icon: '', // vant-ui Icon name
          png: '',
          title: '',
          desc: ''
        },
        msgButtons: [],
        papid: '',
        name: '',
        idsn: '',
        showSearch: true,
        showProgress: false,
        progress: [],
        submitBtnDisabled: false,
        patient: {
          status: '',
          receive_phase: '',
          statusing: '',
        },
        phase: {
          status: '',
          follow_up_status: ''
        },
        predict: null,
        showcode: false,
      }
    },
    computed: {
      nowstatus: function () {
        if (this.patient.status == '出组') {
          this.nowpng = this.msgerror
          return "出组";
        }

        // 患者状态
        if (this.phase.phase > 1) {
          if(this.phase.statusing == '1') {
            if (this.phase.statusop == '初审驳回') {
              this.nowpng = this.msgerror
              return "审核驳回";
            } else {
              this.nowpng = this.msgupload
              return "等待审核";
            }
          }else if(this.phase.statusing == '2') {
            if(this.phase.status == '已拒绝' || this.phase.status == '资料不全') {
              this.nowpng = this.msgerror
              return "审核驳回";
            }
            if(this.phase.status == '等待审核') {
              if(this.patient.express.length > 0) {
                this.nowpng = this.msgupload
                return "等待审核";
              }else {
                this.nowpng = this.msgsuccess
                return "审核通过";
              }
            }
          }else if(this.phase.statusing == '3' || this.phase.statusing == '4') {
            if (this.phase.status == '审核通过') {
              this.nowpng = this.msgsuccess
              return "审核通过";
            }
          }
        } else {
          if (this.phase.status == '资料不全' || this.phase.status == '已拒绝') {
            this.nowpng = this.msgerror
            return "审核驳回";
          }
          if (this.phase.status == '审核通过') {
            this.nowpng = this.msgsuccess
            return "审核通过";
          }

          if (this.patient.statusing == "申请中") {
            this.nowpng = this.msgupload
            return "等待审核";
          }
          if (this.patient.statusing == "初审通过") {
            this.nowpng = this.msgupload
            return "等待审核";
          }
          if (this.patient.statusing != "初审驳回" && this.patient.statusing != "申请中") {
            this.nowpng = this.msgupload
            return "等待审核";
          } else {
            this.nowpng = this.msgerror
            return "审核驳回";
          }
        }

        this.nowpng = this.msgupload
        return '等待审核'

      }
    },
    async created() {
      // this.getPatient();
    },
    methods: {
      back() {
        // this.$wechat.closeWindow()
        this.$router.replace({path:'/'})
      },
      splitDate(date, local) {
        let arr = date.trim().split(/\s+/)
        if (local == 'before') {
          return arr[0]
        }
        if (local == 'after') {
          return arr[1]
        }
      },
      async search() {
        if (!this.name || !this.idsn) {
          Toast('请完善信息')
          return false
        } else if (!isIdCardNo(this.idsn)) { //验证身份证号
          Toast('请输入正确的身份证号');
          return false
        }
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true
        });
        this.submitBtnDisabled = true
        try {
          await zjQueryApplyProgress({
              name: this.name,
              idsn: this.idsn
            }).then((res) => {
              this.progress = res.progress
              this.papid = res.phase.patient_id
              Toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true
              });
            })
          this.patient = await zjGetPatient({
            papid: this.papid
          })
          this.phase = this.patient.phase
          Toast('查询成功')
          this.showSearch = false
          this.showProgress = true
          this.submitBtnDisabled = false

        } catch(err) {
          this.submitBtnDisabled = false
          Toast(err.response.data.message)
        }
        
        console.log(this.phase.file_review_status, 'this.phase.file_review_status')
      }
    }

  }
</script>

<style lang="less">
  .apply-timeline {

    // background: #fff;
    .msg-bd-wait {
      box-sizing: border-box;
      margin: 32px 16%;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0px 1px 10px 0px rgba(0, 101, 155, 0.2);
      overflow: hidden;
      background-color: #fff;

      .title {
        margin-bottom: 0;
        color: #444;

        .van-icon {
          font-size: 24px;
          vertical-align: -5px;
          margin-right: 10px;
          color: @yellow;
        }
      }
    }

    .msg-ft {
      margin: 30px 20%;

      &>* {
        margin-bottom: 20px;
      }
    }

    .msg-tips {
      color: #999;
      text-align: center;
      margin: 10px 5% 10px;
      padding: 5px;
    }

    .msg-progress {
      margin: 20px 12% 30px;
    }

    .search-timeline {
      margin: 16px 3%;

      .van-cell-group__title {
        padding: 10px;
        background: @theme-color;
        color: #fff;
      }
    }

    .next-phase {
      margin: 16px 3%;

      .van-cell-group__title {
        padding: 10px;
        background: @theme-color;
        color: #fff;
      }
    }
  }
</style>