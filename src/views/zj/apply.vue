<template>
  <div class="reg_one">
    <p class="form-title">个人信息</p>
    <div class="form-cell">
      <van-cell-group :border="false">
        <van-cell title="姓名" v-model="formData.name" placeholder="请输入您的姓名" class="inputone" />
        <van-cell title="手机号码" v-model="formData.mobile" class="inputone" readonly />
        <van-cell title="证件号码" v-model="formData.idsn" placeholder="请输入您的身份证号码" class="inputone" />
        <van-cell title="性别" v-model="formData.gender" class="inputone" readonly />
        <van-cell title="生日" v-model="formData.birthday" class="inputone" readonly />
      </van-cell-group>
    </div>
    <p class="form-title">项目信息</p>
    <div class="form">
      <van-cell-group :border="false">
        <van-cell :value="provinceName" class="inputone" is-link arrow-direction="down" @click="openProvince">
          <template #title>
            <span style="color:red;margin-right:5px;">*</span>
            <span class="custom-title">居住地所在省份</span>
          </template>
        </van-cell>
        <van-cell :value="cityName" class="inputone" is-link arrow-direction="down" @click="openCity">
          <template #title>
            <span style="color:red;margin-right:5px;">*</span>
            <span class="custom-title">居住地所在城市</span>
          </template>
        </van-cell>
        <van-cell :value="modeProvinceName" class="inputone" is-link arrow-direction="down" @click="openModeProvince">
          <template #title>
            <span style="color:red;margin-right:5px;">*</span>
            <span class="custom-title">申请援助所在省份</span>
          </template>
        </van-cell>
        <van-cell :value="modeCityName" class="inputone" is-link arrow-direction="down" @click="openModeCity">
          <template #title>
            <span style="color:red;margin-right:5px;">*</span>
            <span class="custom-title">申请援助所在城市</span>
          </template>
        </van-cell>
        <van-cell :value="hospitalName" class="inputone" is-link arrow-direction="down" @click="openHospital">
          <template #title>
            <span style="color:red;margin-right:5px;">*</span>
            <span class="custom-title">项目医院</span>
          </template>
        </van-cell>
        <div class="inputbank">
          <van-cell-group class="inputone inputtwo">
            <!-- <van-field input-align="right" v-model="formData.field_6" type="digit" required label="银行卡号" placeholder="请输入银行卡号" /> -->
            
            <div class="van-cell van-cell--required van-field">
              <div class="van-cell__title van-field__label">
                <span>银行卡号</span>
              </div>
              <div class="van-cell__value van-field__value">
                <div class="van-field__body">
                  <input v-model="formData.field_6" type="tel" required label="银行卡号" placeholder="请输入银行卡号" style="border: none;text-align: right; width: 100%; overflow-x: scroll;">
                  <!-- <div class="inputContent" contenteditable="true" data-text='请输入银行卡号'>{{formData.field_6}}</div> -->
                </div>
              </div>
            </div>
          </van-cell-group>
          <span class="scan" @click="scancode"><img src="../../assets/scan.svg" alt=""></span>
        </div>
        <van-cell-group class="inputone inputtwo">
          <van-field input-align="right" v-model="formData.field_2" required label="持卡人姓名" placeholder="请输入持卡人姓名" />
        </van-cell-group>
        <van-cell-group class="inputone inputtwo">
          <van-field input-align="right" v-model="formData.field_4" required label="开户行" placeholder="请输入开户行" />
        </van-cell-group>
        <van-cell-group class="inputone inputtwo">
          <van-field input-align="right" v-model="formData.field_5" required label="开户支行" placeholder="XXX省XX市XX支行" />
        </van-cell-group>

      </van-cell-group>
    </div>
    <div class="btn">
      <van-button :disabled="submitBtnDisabled" @click="next" class="up">下一步</van-button>
    </div>
    
    <van-popup v-model="showProvince" round position="bottom">
      <van-picker show-toolbar :columns="provinceArr" @cancel="showProvince = false" @confirm="onProvince" />
    </van-popup>
    <van-popup v-model="showCity" round position="bottom">
      <van-picker show-toolbar :columns="cityArr" @cancel="showCity = false" @confirm="onCity" />
    </van-popup>
    <van-popup v-model="showModeProvince" round position="bottom">
      <van-picker show-toolbar :columns="modeProvinceArr" @cancel="showModeProvince = false" @confirm="onModeProvince" />
    </van-popup>
    <van-popup v-model="showModeCity" round position="bottom">
      <van-picker show-toolbar :columns="modeCityArr" @cancel="showModeCity = false" @confirm="onModeCity" />
    </van-popup>
    <van-popup v-model="showHospital" round position="bottom">
      <van-picker show-toolbar :columns="hospitalArr" value-key="name" @cancel="showHospital = false"
        @confirm="onHospital" />
    </van-popup>
  </div>
</template>

<script>
  import { GetAdminProvince, GetAdminCity, DownloadImage } from '@/api/api'
  import { QueryBankcard } from '@/api/zj'
  import {
    zjcheckin,
    zjApply,
    zjGetProvince,
    zjGetCity,
    zjGetHospital,
    zjGetDrugstore,
    zjGetMode
  } from "../../api/zj";
  import {
    checkCellphone
  } from "../../utils/utils";
  import Vue from "vue";
  import {
    Toast
  } from "vant";

  Vue.use(Toast);
  export default {
    data() {
      return {
        formData: {
          patient_id: '',
          name: '',
          idsn: '',
          mobile: '',
          gender: '',
          birthday: '',
          province: '',
          city: '',
          hospital_id: '',
          // drugstore_id: '',
          // mode_id: '',
          field_7: '', // 居住地所在省份
          field_8: '', // 居住地所在城市
          field_6: '', // 银行卡号
          field_2: '', // 持卡姓名
          field_4: '', // 开户行
          field_5: '', // 开户支行

        },
        provinceArr: [],
        provinceName: '请选择居住地省份',
        showProvince: false,
        cityArr: [],
        cityName: '请选择居住地城市',
        showCity: false,
        modeProvinceArr: [],
        modeProvinceName: '请选择援助省份',
        showModeProvince: false,
        modeCityArr: [],
        modeCityName: '请选择援助城市',
        showModeCity: false,
        hospitalArr: [],
        hospitalName: '请选择项目医院',
        showHospital: false,
        // doctorArr: [],
        // doctorName: '请选择项目医生',
        // showDoctor: false,
        // drugstoreArr: [],
        // drugstoreName: '请选择领药药房',
        // showDrugstore: false,
        // modeArr: [],
        // modeName: '请选择援助模式',
        // showMode: false,
        submitBtnDisabled: false,
      };
    },
    async mounted() {
      Toast.loading({
        duration: 0, // 持续展示 toast
        overlay: true,
        forbidClick: true
      });
      await this.GetPatient();
      await this.GetData();
    },
    methods: {
      async GetPatient() {
        let {
          id,
          mobile,
          name,
          birthday,
          gender,
          idsn,
          pap,
          papid
        } = await zjcheckin();
        this.formData.patient_id = id;
        this.formData.mobile = mobile;
        this.formData.name = name
        this.formData.birthday = birthday
        this.formData.gender = gender
        this.formData.idsn = idsn
        if (papid) {
          this.formData.field_7 = pap.field_7
          this.provinceName = pap.field_7
          this.formData.field_8 = pap.field_8
          this.cityName = pap.field_8
          this.formData.province = pap.province
          this.modeProvinceName = pap.province
          this.formData.city = pap.city
          this.modeCityName = pap.city
          this.formData.hospital_id = pap.hospital_id
          this.hospitalName = pap.hospital.name
          this.formData.field_6 = pap.field_6
          this.formData.field_2 = pap.field_2
          this.formData.field_4 = pap.field_4
          this.formData.field_5 = pap.field_5
          // this.formData.drugstore_id = pap.drugstore.id
          // this.drugstoreName = pap.drugstore.name
          // this.formData.mode_id = pap.patient.mode_id
        }
      },
      async GetData() {
        let presAdmin = await GetAdminProvince()
        this.provinceArr = []
        this.provinceArr = Object.values(presAdmin)
        let pres = await zjGetProvince()
        const parr = pres
        this.modeProvinceArr = []
        this.modeProvinceArr = Object.values(parr)
        if (this.formData.city) {
          let cres = await zjGetCity({
            province: this.modeProvinceName
          })
          const carr = cres
          this.modeCityArr = []
          this.modeCityArr = Object.values(carr)
          if (carr.length < 1) {
            this.modeCityArr.unshift('该省份下暂无城市')
          }
          let hres = await zjGetHospital({
            province: this.modeProvinceName,
            city: this.modeCityName
          })
          this.hospitalArr = []
          this.hospitalArr = hres
          if (this.hospitalArr.length < 1) {
            this.hospitalArr.unshift({
              name: '该城市下暂无项目医院',
              id: ''
            })
          }
          // let drres = await zjGetDrugstore({
          //   province: this.modeProvinceName,
          //   city: this.modeCityName
          // })
          // this.drugstoreArr = []
          // this.drugstoreArr = drres
          // if (this.drugstoreArr.length < 1) {
          //   this.drugstoreArr.unshift({
          //     name: '该城市下暂无领药药房',
          //     id: ''
          //   })
          // }
          // this.modeName = await this.modeArr.filter(item => item.value == this.formData.mode_id)[0].name
        }
        Toast.clear();
      },
      openProvince() {
        this.showProvince = true
      },
      async onProvince(value, index) {
        this.formData.field_7 = value
        this.provinceName = value
        Toast.loading({
          duration: 0, // 持续展示 toast
          overlay: true,
          forbidClick: true
        });
        this.showProvince = false
        let cres = await GetAdminCity({
          province: value
        })
        this.cityArr = []
        this.formData.field_8 = ''
        this.cityName = '请选择居住地城市'
        this.cityArr = Object.values(cres)
        if (cres.length < 1) {
          this.cityArr.unshift('该省份下暂无城市')
        }
      },
      openCity() {
        if (this.cityArr.length < 1) {
          Toast('请先选择“居住地所在省份”')
          return
        }
        this.showCity = true
      },
      async onCity(value, index) {
        this.formData.field_8 = value
        this.cityName = value
        this.showCity = false
      },
      openModeProvince() {
        this.showModeProvince = true
      },
      async onModeProvince(value, index) {
        this.formData.province = value
        this.modeProvinceName = value
        Toast.loading({
          duration: 0, // 持续展示 toast
          overlay: true,
          forbidClick: true
        });
        this.showModeProvince = false
        let cres = await zjGetCity({
          province: value
        })
        const carr = cres
        this.modeCityArr = []
        this.formData.city = ''
        this.modeCityName = '请选择援助城市'
        this.hospitalArr = []
        this.formData.hospital_id = ''
        this.hospitalName = '请选择项目医院'
        // this.drugstoreArr = []
        // this.formData.drugstore_id = ''
        // this.drugstoreName = '请选择领药药房'
        this.modeCityArr = Object.values(carr)
        if (carr.length < 1) {
          this.modeCityArr.unshift('该省份下暂无城市')
        }
        await Toast.clear()
      },
      openModeCity() {
        if (this.modeCityArr.length < 1) {
          Toast('请先选择“申请援助所在省份”')
          return
        }
        this.showModeCity = true
      },
      async onModeCity(value, index) {
        this.formData.city = value
        this.modeCityName = value
        Toast.loading({
          duration: 0, // 持续展示 toast
          overlay: true,
          forbidClick: true
        });
        this.showModeCity = false
        let hres = await zjGetHospital({
          province: this.formData.province,
          city: value
        })
        // const harr = hres
        this.hospitalArr = []
        this.formData.hospital_id = ''
        this.hospitalName = '请选择项目医院'
        this.hospitalArr = hres
        if (this.hospitalArr.length < 1) {
          this.hospitalArr.unshift({
            name: '该城市下暂无项目医院',
            id: ''
          })
        }
        // let drres = await zjGetDrugstore({
        //   province: this.formData.province,
        //   city: value
        // })
        // this.drugstoreArr = []
        // // const drarr = drres
        // this.drugstoreArr = drres
        // this.formData.drugstore_id = ''
        // this.drugstoreName = '请选择领药药房'
        // for(let i in drarr) {
        //   this.drugstoreArr.push({
        //     name: drarr[i],
        //     value: i
        //   })
        // }
        // if (this.drugstoreArr.length < 1) {
        //   this.drugstoreArr.unshift({
        //     name: '该城市下暂无领药药房',
        //     id: ''
        //   })
        // }
        await Toast.clear()
      },
      openHospital() {
        if (this.hospitalArr.length < 1) {
          Toast('请先选择“申请援助所在城市”')
          return
        }
        this.showHospital = true
      },
      async onHospital(value, index) {
        this.formData.hospital_id = value.id
        this.hospitalName = value.name
        Toast.loading({
          duration: 0, // 持续展示 toast
          overlay: true,
          forbidClick: true
        });
        this.showHospital = false
        await Toast.clear()
      },
      next() {
        console.log(this.formData, 'this.formData')
        for (let [k, v] of Object.entries(this.formData)) {
          if(!v && k != "hospital_id") {
            Toast("请完善信息");
            return false;
          }
        }
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true
        });
        this.submitBtnDisabled = true;
        zjApply(this.formData)
          .then(res => {
            this.$router.replace({
              name: "zjBlank"
            });
            Toast.clear();
            this.submitBtnDisabled = false;
          })
          .catch(err => {
            this.submitBtnDisabled = false;
            Toast.clear();
            Toast(err.response.data.message);
          });
      },

      scancode() {
        this.chooseImage()
      },
      chooseImage(event) {
          this.wx.ready(() => {
            console.log('ready')
            this.wx.chooseImage({
              count: 1,
              sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: async (res) => {
                try {
                  for (let index = 0; index < res.localIds.length; index++) {
                    const serverId = res.localIds[index];
                    let imgUrl = await this.uploadImage(serverId);
                    console.log(imgUrl,'---2---')
                    QueryBankcard({ bankcard_url: this.baseUrl + imgUrl }).then((res) => {
                      this.formData.field_6 = res.data.bank_card_number
                    })
                  }
                } catch (err) {
                  Toast(err.response.data.message);
                }
              },
              fail: function (err) {
                Toast('选图失败');
                console.log(err)
              }
            })
          })
        },
        uploadImage(serverId) {
          return new Promise((resolve, reject) => {
            this.wx.uploadImage({
              localId: serverId,
              isShowProgressTips: 1,
              success: (res) => {
                var serverId = res.serverId; // 返回图片的服务器端ID
                this.isLoading = true
                DownloadImage({
                    params: {
                      serverId: serverId
                    }
                  }).then((res) => {
                    this.isLoading = false
                    resolve(res)
                  })
                  .catch((err) => {
                    console.log(err)
                    this.isLoading = false
                    reject(err)
                  })
              }
            });
          });
        },
    }
  };
</script>

<style lang="scss" scoped>
  .reg_one {
    height: 100%;
    width: 100%;
    .form-title {
      width: 92%; margin: 0 auto;color: rgba(55, 156, 255, 100);font-size: 18px;padding-top: 5px;
    }

    .form {
      width: 92%;
      // height: 379px;
      line-height: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0);
      padding: 20px 0;
      margin: 10px auto;
      background: white;

      .inputone {
        width: 90%;
        height: auto;
        border-radius: 5px;
        color: rgba(136, 136, 136, 1);
        font-size: 14px;
        text-align: left;
        border: 1px solid rgba(232, 232, 232, 1);
        margin: 0 auto;
        margin-bottom: 18px;
      }

      .inputtwo {
        padding: 0 1px 0 7px;
      }

      .inputbank {
        display: flex; width: 90%; margin: 0 auto; align-items: center; margin-bottom: 18px;
        .inputone {
          width: 90%; margin: 0; 
        }
        .scan {
          margin-left: 10px;
        }
        .inputContent{
          user-select:text;
          -webkit-user-select:text;
          color: #323233;
          box-sizing: border-box;
          max-width: 100%;
          min-width: 100%;
          word-break: break-all;
          background: #ffffff;
          outline: none;
          &:empty:after{
            content:attr(data-text);
            color:#ccc;
            text-align: right;
          }
        }
      }

      .inputone:last-child {
        margin-bottom: 0;
      }
    }

    .form-cell {
      width: 92%;
      line-height: 20px;
      border-radius: 10px;
      box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0);
      margin: 10px auto;
      background: white;
      overflow: hidden;
    }
  }
</style>
<style lang="scss">
.inputone {
  .van-cell--required::before {
    color: red !important;
  }
  .van-field__label {
    span {
      padding-left: 5px;
    }
  }
}
</style>
