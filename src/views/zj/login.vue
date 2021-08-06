<template>
  <div class="applyLogin">
    <div class="login-kv">
      <img src="../../assets/kv.jpg" />
    </div>
    <div class="login">
      <input class="login-input" type="tel" pattern="[0-9]*" maxlength="11" name="mobile" placeholder="请输入您的电话号码"
        placeholder-class="login-txtStyle" v-model.trim="mobile" />
      <div class="login-item">
        <input class="login-input2" type="digit" pattern="[0-9]*" maxlength="6" name="code" placeholder="请输入验证码"
          placeholder-class="login-txtStyle" v-model.trim="code" />
        <div class="send_code" @click="getSms">
          <p class="code_txt">{{btnText}}</p>
        </div>
      </div>
    </div>
    <div class="btn">
      <!-- <van-button :disabled="submitBtnDisabled" @click="formLogin" class="up">注册/登录</van-button> -->
      <van-button @click="openContract()" class="up">注册/登录</van-button>
    </div>

    <van-popup class="contract-popup" v-model="showContract" closeable close-icon-position="top-left" position="bottom">
      <div class="contract-box">
        <div class="contract-title">《患者知情同意书》</div>
        <div class="contract-text" v-html="contractText"></div>
        <div class="contract-btn">
          <div class="agree-box">
            <van-checkbox v-model="checked" icon-size="16px">我已阅读并同意《患者知情同意书》</van-checkbox>
          </div>
          <van-button v-if="checked" type="info" :disabled="submitBtnDisabled" block @click="formLogin">下一步</van-button>
          <van-button v-else type="info" :disabled="true" block>下一步</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import {
    zjLogin,
    zjPatientConfig,
    zjSendVerifyCode
  } from '../../api/zj';
  import {
    checkCellphone
  } from '../../utils/utils';
  import Vue from 'vue';
  import {
    Toast
  } from 'vant';

  Vue.use(Toast);
  let hostname = location.hostname;
  hostname = hostname.substring(hostname.indexOf('.'));
  const baseUrlImg = `${location.protocol}//api${hostname}`;
  export default {
    name: "ApplyLogin",
    data() {
      return {
        baseFileUrl: baseUrlImg,
        mobile: "",
        code: "",
        kv_image: "",
        tempKv: "",
        btnText: "获取验证码",
        btnDisabled: false,
        submitBtnDisabled: false,
        seconds: 60,
        checked: false,
        contractText: '', // 知情同意书内容
        showContract: false, // 显示知情同意书
      }
    },
    mounted() {
      zjPatientConfig()
        .then(res => {
          this.contractText = res.zj_contract_text;
        })
        .catch(err => {
          Toast(err.response.data.message);
        });
    },
    methods: {
      getSms() {
        let self = this;
        if (self.btnDisabled) {
          return false;
        }
        if (!self.mobile) {
          Toast('请输入手机号')
          return false;
        } else {
          if (!checkCellphone(self.mobile)) {
            Toast('手机号格式有误')
            return false;
          }
        }

        const reqData = {
          mobile: self.mobile
        };
        zjSendVerifyCode(reqData)
          .then((res) => {
            if (res.isValid) {
              Toast(res.resultContent)
              self.startTimer();
            } else {
              Toast(res.resultContent)
            }
          })
          .catch((err) => {
            Toast('手机号格式有误')
          });
      },
      startTimer() {
        this.btnDisabled = true;
        this.btnText = this.seconds + 's';
        this.timer = setTimeout(() => {
          this.seconds = this.seconds - 1;
          if (this.seconds <= 0) {
            clearTimeout(this.timer);
            this.seconds = 60;
            this.btnText = '发送验证码';
            this.btnDisabled = false;
          } else {
            this.startTimer();
          }
        }, 1000);
      },
      openContract() {
        var reg = /^\d{6}$/
        if (!this.mobile) {
          Toast('请输入手机号')
          return false
        } else if (!checkCellphone(this.mobile)) {
          Toast('手机号格式有误')
          return false;
        } else if (!this.code || !reg.test(this.code)) {
          Toast('验证码错误')
          return false;
        }
        this.showContract = true
      },
      formLogin() {
        const self = this;
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true
        });
        self.submitBtnDisabled = true
        zjLogin({
            mobile: self.mobile,
            verifycode: self.code
          })
          .then((res) => {
            Toast.clear()
            Toast('登录成功')
            let userInfo = this.$store.getters.getUserInfo;
            userInfo.patient = res
            this.$store.commit("setUserInfo", userInfo);
            this.$router.replace({
              path: '/zj',
            })
            self.submitBtnDisabled = false
          })
          .catch((err) => {
            self.submitBtnDisabled = false
            Toast.clear()
            Toast(err.response.data.message)
          });
      }
    }
  }
</script>
<style lang="less">
  .applyLogin {
    height: 100%;
    width: 100%;

    .login-kv {
      height: 178px;
      width: 100%;
      margin-bottom: 20px;

      img {
        height: 100%;
        width: 100%;
      }
    }

    .login {
      width: 90%;
      height: 145px;
      line-height: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0);
      padding: 18px 0;
      margin: 0 auto;
      background: white;

      .login-input {
        width: 90%;
        height: 46px;
        // border-radius: 5px;
        color: rgba(136, 136, 136, 1);
        font-size: 14px;
        text-align: left;
        border: none;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        margin: 0 auto;
        padding-left: 10px;
        box-sizing: border-box;
        margin-bottom: 14px;
      }
    }

    .login-item {
      height: 46px;
      width: 90%;
      margin: 0 auto;
      display: flex;
      align-items: center;

      .login-input2 {
        padding-left: 10px;
        box-sizing: border-box;
        // width: 65%;
        height: 46px;
        // border-radius: 5px;
        color: rgba(136, 136, 136, 1);
        font-size: 14px;
        text-align: left;
        border: none;
        border-bottom: 1px solid rgba(232, 232, 232, 1);
        flex: 1;
        min-width: 0;
      }

      .send_code {
        height: 30px;
        min-width: 100px;
        border-radius: 5px;
        background-color: @yellow;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.01);
        border: 1px solid rgba(255, 255, 255, 0);
        margin: 0;
        margin-left: 10px;
        padding: 0 10px;

        .code_txt {
          color: rgba(246, 248, 255, 1);
          line-height: 30px;
          font-size: 14px;
          text-align: center;
        }
      }
    }

    .contract-popup {
      height: 60%;
      margin: 15px;
      width: auto;
      box-sizing: border-box;
      overflow: hidden;
    }

    .contract-box {
      position: relative;
      height: 100%;
      display: flex;
      flex-direction: column;

      .contract-title {
        background: #fff;
        box-sizing: content-box;
        width: auto;
        line-height: 24px;
        height: 24px;
        font-size: 1.6rem;
        text-align: center;
        padding: 20px 50px 10px;
        background: #fff;
      }

      .contract-text {
        flex: 1;
        height: 50%;
        font-size: 1.4rem;
        text-align: justify;
        text-align-last: left;
        line-height: 1.5;
        height: 100%;
        padding: 15px;
        padding-bottom: 90px;
        overflow-y: auto;
        transition: transform .3s;
        -webkit-overflow-scrolling: touch;
      }

      .contract-btn {
        background: #fff;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;

        .agree-box {
          height: 40px;
          line-height: 20px;
          padding: 10px;
          text-align: center !important;
          vertical-align: middle;

          .van-checkbox {
            justify-content: center;
          }
        }
      }
    }
  }

  input::-webkit-input-placeholder {
    color: #aab2bd;
    font-size: 14px;
  }
</style>