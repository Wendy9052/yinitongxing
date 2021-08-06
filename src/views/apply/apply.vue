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
      <van-cell-group>
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
        <!-- <van-cell :value="doctorName" class="inputone" is-link arrow-direction="down" @click="openDoctor">
          <template #title>
            <span style="color:red;margin-right:12px;"></span>
            <span class="custom-title">项目医生</span>
          </template>
        </van-cell> -->
        <van-cell :value="drugstoreName" class="inputone" is-link arrow-direction="down" @click="openDrugstore">
          <template #title>
            <span style="color:red;margin-right:5px;">*</span>
            <span class="custom-title">领药药房</span>
          </template>
        </van-cell>
        <van-cell :value="modeName" class="inputone" is-link arrow-direction="down" @click="openMode" v-if="modeArr.length > 1">
          <template #title>
            <span style="color:red;margin-right:5px;">*</span>
            <span class="custom-title">援助方式</span>
          </template>
        </van-cell>
        <van-cell title="援助方式" v-model="modeName" class="inputone" readonly v-else />
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
    <!-- <van-popup v-model="showDoctor" round position="bottom">
      <van-picker show-toolbar :columns="doctorArr" value-key="name" @cancel="showDoctor = false" @confirm="onDoctor" />
    </van-popup> -->
    <van-popup v-model="showDrugstore" round position="bottom">
      <van-picker show-toolbar :columns="drugstoreArr" value-key="name" @cancel="showDrugstore = false"
        @confirm="onDrugstore" />
    </van-popup>
    <van-popup v-model="showMode" round position="bottom">
      <van-picker show-toolbar :columns="modeArr" value-key="name" @cancel="showMode = false" @confirm="onMode" />
    </van-popup>
  </div>
</template>

<script>
  import {
    checkin,
    Apply,
    GetAdminProvince,
    GetAdminCity,
    GetProvince,
    GetCity,
    GetHospital,
    GetDoctor,
    GetDrugstore,
    GetMode,
    GetPatient
  } from "../../api/api";
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
          drugstore_id: '',
          // doctor_id: '',
          mode_id: '',
          field_1: '',
          field_2: ''
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
        doctorArr: [],
        doctorName: '请选择项目医生',
        showDoctor: false,
        drugstoreArr: [],
        drugstoreName: '请选择领药药房',
        showDrugstore: false,
        modeArr: [],
        modeName: '请选择援助模式',
        showMode: false,
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
        } = await checkin();
        this.formData.patient_id = id;
        this.formData.mobile = mobile;
        this.formData.name = name
        this.formData.birthday = birthday
        this.formData.gender = gender
        this.formData.idsn = idsn
        if (papid) {
          this.formData.field_1 = pap.patient.field_1
          this.provinceName = pap.patient.field_1
          this.formData.field_2 = pap.patient.field_2
          this.cityName = pap.patient.field_2
          this.formData.province = pap.patient.province
          this.modeProvinceName = pap.patient.province
          this.formData.city = pap.patient.city
          this.modeCityName = pap.patient.city
          this.formData.hospital_id = pap.hospital.id
          this.hospitalName = pap.hospital.name
          this.formData.drugstore_id = pap.drugstore.id
          this.drugstoreName = pap.drugstore.name
          // this.formData.doctor_id = pap.doctor.id
          // this.doctorName = pap.doctor.name
          this.formData.mode_id = pap.patient.mode_id
        }
      },
      async GetData() {
        let presAdmin = await GetAdminProvince()
        this.provinceArr = []
        this.provinceArr = Object.values(presAdmin)
        let pres = await GetProvince()
        const parr = pres
        this.modeProvinceArr = []
        this.modeProvinceArr = Object.values(parr)
        let mres = await GetMode()
        const marr = mres
        this.modeArr = []
        for (let i in marr) {
          this.modeArr.push({
            name: marr[i],
            value: i
          })
        }
        if(this.modeArr.length == 1) {
          this.modeName = this.modeArr[0].name
          this.formData.mode_id = this.modeArr[0].value
        }
        if (this.formData.city) {
          let cres = await GetCity({
            province: this.modeProvinceName
          })
          const carr = cres
          this.modeCityArr = []
          this.modeCityArr = Object.values(carr)
          if (carr.length < 1) {
            this.modeCityArr.unshift('该省份下暂无城市')
          }
          let hres = await GetHospital({
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
          let drres = await GetDrugstore({
            province: this.modeProvinceName,
            city: this.modeCityName
          })
          this.drugstoreArr = []
          this.drugstoreArr = drres
          if (this.drugstoreArr.length < 1) {
            this.drugstoreArr.unshift({
              name: '该城市下暂无领药药房',
              id: ''
            })
          }
          // if (this.formData.hospital_id) {
          //   let dores = await GetDoctor({
          //     hospital_id: this.formData.hospital_id,
          //     role: '医生'
          //   })
          //   const doarr = dores
          //   this.doctorArr = []
          //   for (let i in doarr) {
          //     this.doctorArr.push({
          //       name: doarr[i],
          //       value: i
          //     })
          //   }
          //   if (doarr.length < 1) {
          //     this.doctorArr.unshift({
          //       name: '该医院下暂无项目医生',
          //       value: ''
          //     })
          //   }
          // }
          this.modeName = await this.modeArr.filter(item => item.value == this.formData.mode_id)[0].name
        }
        Toast.clear();
      },
      openProvince() {
        this.showProvince = true
      },
      async onProvince(value, index) {
        this.formData.field_1 = value
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
        this.formData.field_2 = ''
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
        this.formData.field_2 = value
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
        let cres = await GetCity({
          province: value
        })
        const carr = cres
        this.modeCityArr = []
        this.formData.city = ''
        this.modeCityName = '请选择援助城市'
        this.hospitalArr = []
        this.formData.hospital_id = ''
        this.hospitalName = '请选择项目医院'
        // this.doctorArr = []
        // this.formData.doctor_id = ''
        this.doctorName = '请选择项目医生'
        this.drugstoreArr = []
        this.formData.drugstore_id = ''
        this.drugstoreName = '请选择领药药房'
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
        let hres = await GetHospital({
          province: this.formData.province,
          city: value
        })
        // const harr = hres
        this.hospitalArr = []
        this.formData.hospital_id = ''
        this.hospitalName = '请选择项目医院'
        // this.doctorArr = []
        // this.formData.doctor_id = ''
        // this.doctorName = '请选择项目医生'
        this.hospitalArr = hres
        if (this.hospitalArr.length < 1) {
          this.hospitalArr.unshift({
            name: '该城市下暂无项目医院',
            id: ''
          })
        }
        let drres = await GetDrugstore({
          province: this.formData.province,
          city: value
        })
        this.drugstoreArr = []
        // const drarr = drres
        this.drugstoreArr = drres
        this.formData.drugstore_id = ''
        this.drugstoreName = '请选择领药药房'
        // for(let i in drarr) {
        //   this.drugstoreArr.push({
        //     name: drarr[i],
        //     value: i
        //   })
        // }
        if (this.drugstoreArr.length < 1) {
          this.drugstoreArr.unshift({
            name: '该城市下暂无领药药房',
            id: ''
          })
        }
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
        // this.doctorArr = []
        // this.formData.doctor_id = ''

        // if (value.id) {
        //   let dores = await GetDoctor({
        //     hospital_id: value.id,
        //     role: '医生'
        //   })
        //   const doarr = dores
        //   this.doctorName = '请选择项目医生'
        //   for (let i in doarr) {
        //     this.doctorArr.push({
        //       name: doarr[i],
        //       value: i
        //     })
        //   }
        //   if (doarr.length < 1) {
        //     this.doctorArr.unshift({
        //       name: '该医院下暂无项目医生',
        //       value: ''
        //     })
        //   }
        // }

        await Toast.clear()
      },
      // openDoctor() {
      //   if (this.doctorArr.length < 1) {
      //     Toast('请先选择“项目医院”')
      //     return
      //   }
      //   this.showDoctor = true
      // },
      // onDoctor(value, index) {
      //   this.formData.doctor_id = value.value
      //   this.doctorName = value.name
      //   this.showDoctor = false
      // },
      openDrugstore() {
        if (this.drugstoreArr.length < 1) {
          Toast('请先选择“申请援助所在城市”')
          return
        }
        this.showDrugstore = true
      },
      onDrugstore(value, index) {
        this.formData.drugstore_id = value.id
        this.drugstoreName = value.name
        this.showDrugstore = false
      },
      openMode() {
        this.showMode = true
      },
      onMode(value, index) {
        this.formData.mode_id = value.value
        this.modeName = value.name
        this.showMode = false
      },
      next() {
        console.log(this.formData, 'this.formData')
        for (let [k, v] of Object.entries(this.formData)) {
          if(!v) {
            Toast("请完善信息");
            return false;
          }
        }
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true
        });
        this.submitBtnDisabled = true;
        Apply(this.formData)
          .then(res => {
            this.$router.replace({
              name: "Blank"
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