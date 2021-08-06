<template>
  <div class="before-apply" @touchmove.prevent>
    <div class="canvas-title">患者知情同意书签字</div>
    <div class="canvas-box" id="canvas-box">
      <!-- <canvas id="canvas" width="300" height="600">Canvas画板</canvas> -->
      <div class="canvas-tips">若签名板功能出现异常，请尝试”刷新“页面重试。</div>
      <canvas id="canvas">Canvas画板</canvas>
    </div>

    <van-popup v-model="showUploadIdcard" style="width: 100%; height: 100%;">
      <div class="canvas-title">上传身份证照片</div>
      <div class="idcardupload" style="padding-bottom: 68px;">
        <div class="upload-box">
          <div class="upload-img" @click="chooseImage('front')">
            <div class="upload-img-b" :style="{backgroundImage: 'url('+idcard_front+')'}"></div>
          </div>
          <div class="upload-title">点击上图拍摄身份证人像面</div>
        </div>
        <div class="upload-box">
          <div class="upload-img" @click="chooseImage('back')">
            <div class="upload-img-b" :style="{backgroundImage: 'url('+idcard_back+')'}"></div>
          </div>
          <div class="upload-title">点击上图拍摄身份证国徽面</div><br />
          <!-- <div class="upload-notes">注意事项：请将身份证放置于桌面，无杂乱背景，水平或者垂直放置均可，保证卡面无反光，对焦清晰；请勿使用复印件翻拍。</div> -->
        </div>
      </div>
    </van-popup>

    <div v-if="!showUploadIdcard" class="page-ft">
      <van-row gutter="20" class="canvas-btn">
        <van-col span="8">
          <van-button @click.native="clear" block round type="warning">清除</van-button>
        </van-col>
        <van-col span="16">
          <van-button :disabled="submitBtnDisabled" @click.native="save" block round type="info">提交</van-button>
        </van-col>
      </van-row>
    </div>

    <div v-if="showUploadIdcard" class="page-ft idcard-btn">
      <van-row gutter="20">
        <van-col span="24">
          <van-button block round type="info" :disabled="idcardBtnDisabled" @click.native="nextStep">下一步</van-button>
        </van-col>
      </van-row>
    </div>
  </div>

</template>

<script>
  import { DownloadImage } from "../../api/api";
  import {
    zjcheckin,
    zjUploadContract,
    zjIdcardOcr,
    zjUploadPatientStatus,
  } from "../../api/zj";
  import Draw from '@/utils/draw.js'
  import {
    mapState
  } from "vuex";
  import Vue from "vue";
  import {
    Toast,
    Dialog
  } from "vant";
  import idcard_front from "@/assets/idcard_front.png";
  import idcard_back from "@/assets/idcard_back.png";

  Vue.use(Toast);
  Vue.use(Dialog);
  
  var draw;
  
  export default {
    data() {
      return {
        idcard_front: idcard_front,
        idcard_back: idcard_back,
        patient_id: "",
        reason: "",
        status: "",
        showUploadIdcard: false,
        signature_image: "",
        idcards: [{
            image: "",
            type: "人像面"
          },
          {
            image: "",
            type: "国徽面"
          }
        ],
        submitBtnDisabled: false,
        idcardBtnDisabled: false,
        is_medical_examined: 0
      };
    },
    computed: {
      ...mapState(['patientOne', 'userInfo']),
    },
    async created() {
      this.patient_id = this.$route.query.patientid;
      this.reason = this.$route.query.reason;
      this.status = this.$route.query.status;
      let {
        pap,
        papid
      } = await zjcheckin();
      this.papid = papid
      if(pap && pap.phase) this.is_medical_examined = pap.phase.is_medical_examined
      if (this.status) {
        Dialog.alert({
          title: '知情同意书签名' + this.status,
          message: '原因：' + this.reason + '<br/>请重新签名!',
        }).then(() => {
          // on close
        });
      }
      if (this.patientOne) {
        if (this.patientOne.signature_image && this.status != '未上传') this.signature_image = this
          .patientOne.signature_image
        if (this.patientOne.idcard_front) {
          this.idcard_front = this.patientOne.idcard_front
          this.idcards[0].image = this.patientOne.idcard_front
        }
        if (this.patientOne.idcard_back) {
          this.idcard_back = this.patientOne.idcard_back
          this.idcards[1].image = this.patientOne.idcard_back
        }
      }
    },
    mounted() {
      draw = new Draw("canvas");
      draw.init();
    },
    methods: {
      clear: function () {
        draw.clear();
      },
      save: async function () {
        if (draw.isDraw) {
          var data = draw.save();
          // console.log("签名", data);
          this.signature_image = data;
          let self = this;
          if (!this.signature_image) {
            Toast("请先手写签名");
            return;
          }
          self.submitBtnDisabled = true;
          Toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true
          });
          zjUploadContract({
              patient_id: self.patient_id,
              signature_image: self.signature_image
            })
            .then(res => {
              self.submitBtnDisabled = false;
              Toast.clear();
              if (this.patientOne.idcard_front && this.patientOne.idcard_back) {
                if(this.is_medical_examined == '1') {
                  zjUploadPatientStatus({
                    papid: this.papid,
                    category: '入组医学审核'
                  }).then(res => {}).catch(err => {
                    this.disabled = false;
                    Toast.clear();
                    Toast(err.response.data.message);
                  })
                }
                Toast.clear();
                this.$router.replace({
                  name: "zjBlank"
                });
                return;
              }
              self.showUploadIdcard = true;
            })
            .catch(err => {
              self.submitBtnDisabled = false;
              Toast.clear();
              Toast(err.response.data.message);
            });
        } else {
          Toast({
            message: "请先手写签名再点击“提交”",
            duration: 1000
          });
        }
      },
      mutate(word) {
        this.$emit("input", word);
      },
      touchmove: function () {
        document.body.addEventListener(
          "touchmove",
          function (e) {
            e.preventDefault();
            e.stopPropagation();
          }, {
            passive: false
          }
        );
      },
      chooseImage(side) {
        this.wx.chooseImage({
          count: 1,
          sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: async res => {
            try {
              const serverId = res.localIds[0];
              await this.uploadImage(serverId, side);
            } catch (err) {
              Toast(err.response.data.message);
            }
          },
          fail: function () {
            Toast("选图失败");
          }
        });
      },
      uploadImage(serverId, side) {
        return new Promise((resolve, reject) => {
          this.wx.uploadImage({
            localId: serverId,
            isShowProgressTips: 1,
            success: res => {
              var serverId = res.serverId; // 返回图片的服务器端ID
              Toast.loading({
                duration: 0, // 持续展示 toast
                forbidClick: true
              });
              DownloadImage({
                  params: {
                    serverId: serverId
                  }
                })
                .then(res => {
                  if (side === "front") {
                    this.idcard_front = `${this.baseUrl}${res}`;
                    this.idcards[0].image = `${this.baseUrl}${res}`;
                    // this.idcard_front = 'https://papkmbzayyc.ilvzhou.com/statics/upload/attachment/202003/05/e49a13704664b2bca22fe97a2358c9ee.jpg'
                    // this.idcards[0].image = 'https://papkmbzayyc.ilvzhou.com/statics/upload/attachment/202003/05/e49a13704664b2bca22fe97a2358c9ee.jpg'
                  } else {
                    this.idcard_back = `${this.baseUrl}${res}`;
                    this.idcards[1].image = `${this.baseUrl}${res}`;
                    // this.idcard_back = 'https://papkmbzayyc.ilvzhou.com/statics/upload/attachment/202003/05/d6593ba20a7a265a641e7fb19897314f.jpg'
                    // this.idcards[1].image = 'https://papkmbzayyc.ilvzhou.com/statics/upload/attachment/202003/05/d6593ba20a7a265a641e7fb19897314f.jpg'
                  }
                  // console.log('uploadImage', this.idcards)
                  Toast.clear();
                  resolve();
                })
                .catch(err => {
                  Toast.clear();
                  reject(err.response.data.message);
                });
            },
            fail: function () {
              Toast("图片上传失败");
            }
          });
        });
      },
      nextStep() {
        if (
          this.idcard_front === idcard_front ||
          this.idcard_back === idcard_back
        ) {
          Toast("请上传图片");
          return false;
        }
        if (!this.signature_image) {
          Toast("请先手写签名");
          return;
        }
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true
        });
        this.idcardBtnDisabled = true;
        const reqData = {};
        reqData.patient_id = this.patient_id;
        reqData.idcards = this.idcards;
        // console.log(reqData, this.idcards)
        zjIdcardOcr(reqData)
          .then(res => {
            this.$router.replace({
              name: "zjBlank"
            });
            Toast.clear();
          })
          .catch(err => {
            this.idcardBtnDisabled = false;
            Toast.clear();
            Toast(err.response.data.message);
          });
      }
    }
  };
</script>
<style lang='less'>
  .before-apply {
    text-align: center;
    padding-bottom: 74px;
    height: 100vh;
    box-sizing: border-box;
    position: relative;

    .canvas-title {
      height: 48px;
      line-height: 48px;
      font-size: 1.6rem;
      position: relative;

      &::after {
        .b-line;
      }
    }

    .canvas-box {
      height: calc(100vh - 122px);
      position: relative;

      .canvas-tips {
        line-height: 20px;
        background: rgba(@blue, 0.6);
        position: absolute;
        bottom: 14px;
        left: 15px;
        right: 15px;
        color: #fff;
      }
    }

    #canvas {
      background: lighten(@theme-color, 40%) center center no-repeat;
      background-image: url("../../assets/broad_bg.png");
      background-size: auto 75%;
      border: lighten(@theme-color, 30%) solid 1px;
      cursor: default;
      margin: 15px auto;
      // position: absolute;
      // top: 0;
      // left: 0;
      // right: 0;
      // bottom: 0;
      // margin: auto;
    }

    .canvas-btn {
      padding: 15px;
      background: #fff;
      z-index: 3002;
    }

    .idcard-btn {
      padding: 15px;
      background: #fff;
      z-index: 3003;
    }
  }
</style>