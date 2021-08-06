<template>
  <div class="apply-msg msg-page">
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
    <div class="next-phase" v-if="showNextphase">
      <div class="shadow-box">
        <van-cell-group title="后续申请" :border="false">
          <van-field label="患者姓名" readonly :value="this.userInfo.patient.name" />
          <van-field label="手机号码" readonly :value="this.userInfo.patient.mobile" />
        </van-cell-group>
      </div>
      <div class="msg-tips">{{nextTitle}}</div>
    </div>
    <div class="msg-ft">
      <van-button v-for="(item, index) in msgButtons" :key="index" :type="item.type" :plain="item.plain"
        :hairline="item.plain?true:false" round block @click="item.onClick">{{item.txt}}</van-button>
    </div>
    <div v-if="showProgress" class="msg-progress">
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
  </div>
</template>

<script>
  import Vue from "vue";
  import {
    Dialog,
    Toast
  } from 'vant'
  import {
    zjQueryApplyProgress,
    zjGetPatient,
    zjGetReceiveInfo,
    zjnewPhase
  } from '../../api/zj'
  import {
    mapState
  } from "vuex";
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
        msg: {
          status: '', // 绿: success;黄: warn;蓝: info;红: error
          icon: '', // 成功: checked;警告: warning;中性信息: info;叉叉: clear
          png: '', // png有值则无需前两项
          title: '',
          desc: ''
        },
        msgButtons: [],
        papid: '',
        name: '',
        idsn: '',
        showProgress: false,
        progress: [],
        receiveInfo: {},
        showNextphase: false,
        submitisabled: false,
        nextTitle: '您当前阶段援助领药已完成，可点击开启下一阶段药品援助'
      }
    },
    computed: {
      ...mapState(['userInfo']),
      hasMedicine() {
        return this.receiveInfo.drugs.length > 0 ? true : false
      }
    },
    async created() {
      // console.log(this.userInfo)
      this.papid = this.userInfo.patient.papid
      await this.getData()
    },
    methods: {
      change() {
        this.$router.replace({
          path: '/zj/manage'
        });
      },
      toIndex() {
        // this.$wechat.closeWindow()
        this.$router.replace({path:'/'})
      },
      toUplad(val) {
        let rdata = {
          name: "zjUpload"
        }
        if (val) {
          if (val == 'follow') {
            rdata.query = {
              follow: true
            }
          } else if (val == 'review') {
            rdata.query = {
              category: '后续复核'
            }
          }else if (val == 'first') {
            rdata.query = {
              category: '入组医学审核'
            }
          }
        }
        this.$router.replace(rdata);
      },
      toUpladFollow() {
        this.$router.replace({
          name: "zjUpload",
          query: {
            follow: true,
          }
        });
      },
      toExpress() {
        this.$router.replace({
          name: "zjMsg",
          query: {
            value: '初审通过'
          }
        });
      },
      toUpladFuhe() {
        this.$router.replace({
          name: "zjUpload",
          query: {
            category: '后续复核'
          }
        });
      },
      toNextphase() {
        if (this.submitisabled) {
          return
        }
        this.submitisabled = true
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true
        });
        zjnewPhase({
          papid: this.papid
        }).then(res => {
          this.$router.replace({
            name: "zjBlank"
          });
          this.submitisabled = false
          Toast.clear()
        }).catch(err => {
          this.submitisabled = false
          Toast.clear()
          Toast(err.response.data.message)
        })
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
      async getData() {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true
        });
        const patient = await zjGetPatient({
          papid: this.papid
        })
        let query = await zjQueryApplyProgress({
          name: patient.name,
          idsn: patient.idsn
        })
        this.progress = query.progress
        // let re_info = await zjGetReceiveInfo({
        //   papid: this.papid
        // })
        // this.receiveInfo = re_info
        if (patient.status == "初始") {
          if (patient.statusing == '申请中' || patient.statusing == '') {
            this.toUplad('first')
          } else if (patient.statusing == "待初审") {
            this.$router.replace({
              name: "zjMsg",
            });
          } else if (patient.statusing && patient.statusing != '申请中' && patient.statusing != '初审通过') {
            this.msg.title = '审核未通过'
            this.msg.png = msgerror
            this.msg.status = 'error'
            this.msgButtons = [{
              txt: '重新提交审核材料',
              type: 'info',
              plain: true,
              onClick: this.toUplad.bind(this,'first')
            }]
            this.showProgress = true
          }
        } else if (patient.status == "未入组") {
          if (patient.phase.status == '等待审核') {
            if(patient.express.length > 0) {
              this.$router.replace({
                name: "zjMsg",
                query: {
                  value: 'express'
                }
              });
            }else {
              this.$router.replace({
                name: "zjMsg",
                query: {
                  value: '初审通过'
                }
              });
            }
          } else if(patient.phase.status != '等待审核' || patient.phase.status != '审核通过') {
            this.msg.title = '审核未通过'
            this.msg.png = msgerror
            this.msg.status = 'error'
            this.msgButtons = [{
              txt: '重新提交审核材料',
              type: 'info',
              plain: true,
              onClick: this.toExpress.bind(this)
            }]
            this.showProgress = true
          } else {
            this.toUplad('first')
          }
        } else if (patient.status == "在组") { //纸质审核通过入组
          if (patient.phase.status == '审核通过' && patient.phase.fake_money == '1') {
            this.msgButtons = []
            this.msgButtons = [{
              txt: '开启下一阶段',
              type: 'info',
              onClick: this.toNextphase.bind(this)
            }]
            this.nextTitle = '您当前阶段打款已完成，可点击开启下一阶段'
            this.showNextphase = true
            Toast.clear();
            return
          }
          if (patient.phase.phase == 1) {
            if(patient.phase.status == '审核通过' && patient.phase.fake_money == '0') {
              this.msg.title = '审核通过待打款'
              this.msg.png = msgsuccess
              this.msg.status = 'success'
              this.msgButtons = [{
                txt: '返回首页',
                type: 'info',
                onClick: this.toIndex.bind(this)
              }]
              this.showProgress = true
            }
          }

          if (patient.phase.phase >= 2) {
            if(patient.phase.statusing == '1') {
              if (patient.phase.statusop == '待初审') {
                this.$router.replace({
                  name: "zjMsg",
                });
              } else if (patient.phase.statusop == '初审驳回') {
                this.msg.title = '审核未通过'
                this.msg.png = msgerror
                this.msgButtons = [{
                  txt: '重新提交审核材料',
                  type: 'info',
                  plain: true,
                  onClick: this.toUpladFollow.bind(this)
                }]
                this.showProgress = true
              } else {
                this.$router.replace({
                  name: "zjUpload",
                  query: {
                    follow: true,
                  }
                });
              }
            }else if(patient.phase.statusing == '2') {
              if(patient.phase.status == '已拒绝' || patient.phase.status == '资料不全') {
                this.msg.title = '审核未通过'
                this.msg.png = msgerror
                this.msg.status = 'error'
                this.msgButtons = [{
                  txt: '重新提交审核材料',
                  type: 'info',
                  plain: true,
                  onClick: this.toExpress.bind(this)
                }]
                this.showProgress = true
                return
              }
              if(patient.phase.status == '等待审核') {
                if(patient.express.length > 0) {
                  this.$router.replace({
                    name: "zjMsg",
                    query: {
                      value: 'express'
                    }
                  });
                }else {
                  this.$router.replace({
                    name: "zjMsg",
                    query: {
                      value: '初审通过'
                    }
                  });
                }
                return
              }
            }else if(patient.phase.statusing == '3' || patient.phase.statusing == '4') {
              if (patient.phase.status == '审核通过') {
                if(patient.phase.fake_money == '0') {
                  this.msg.title = '审核通过待打款'
                  this.msg.png = msgsuccess
                  this.msg.status = 'success'
                  this.msgButtons = [{
                    txt: '返回首页',
                    type: 'info',
                    onClick: this.toIndex.bind(this)
                  }]
                  this.showProgress = true
                }else if(patient.phase.fake_money == '1') {
                  this.msgButtons = []
                  this.msgButtons = [{
                    txt: '开启下一阶段',
                    type: 'info',
                    onClick: this.toNextphase.bind(this)
                  }]
                  this.nextTitle = '您当前阶段打款已完成，可点击开启下一阶段'
                  this.showNextphase = true
                  Toast.clear();
                  return
                }
              }
            }
            
          }
        } else if (patient.status == "出组") {
          this.$router.replace({
            path: "/zj/out",
          });
          Toast.clear();
          return;
        }
        Toast.clear();
      }
    }

  }
</script>

<style lang="less">
  .apply-msg {
    background: #fff;
    position: relative;

    &::after {
      content: "";
      display: block;
      position: absolute;
      z-index: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 1) 50%, rgba(247, 248, 255, 1) 100%);
    }

    &>* {
      position: relative;
      z-index: 10;
    }

    .msg-progress {
      margin: 20px 12% 30px;
    }

    .msg-medicine {
      margin: -20px 3% 16px;

      .van-cell-group__title {
        background: @theme-color;
        color: #fff;
        padding: 10px;
      }
    }

    .next-phase {
      margin: 16px 3%;

      .van-cell-group__title {
        background: @theme-color;
        color: #fff;
        padding: 10px;
      }
    }
  }
</style>