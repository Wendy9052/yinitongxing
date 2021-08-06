<template>
  <div> </div>
</template>

<script>
  import Vue from "vue";
  import {
    Toast
  } from 'vant'
  import {
    checkin,
    TypeCheckItem
  } from "../../api/api";
  Vue.use(Toast)
  export default {
    data() {
      return {
        patient_id: '',
      };
    },

    mounted() {
      this.getPatient();
    },
    methods: {
      getPatient() {
        let self = this
        checkin()
          .then(res => {
            // console.log(res, "res");
            if (res) {
              this.$store.commit("setPatientOne", {
                //存入vuex
                patientOne: res
              });
              this.patient_id = res.id
              if (res.papid) {
                let userInfo = this.$store.getters.getUserInfo;
                userInfo.patient = res
                this.$store.commit("setUserInfo", userInfo);
                const {
                  patient,
                  phase
                } = res.pap;
                TypeCheckItem({
                  papid: res.papid,
                  check_item_type: '知情同意书'
                }).then(res => {
                  if (res.status == '审核不通过' || res.status == '未上传') {
                    if (patient.status == "初始" && patient.statusing == "初审驳回") {
                      this.$router.replace({
                        name: "BeforeApply",
                        query: {
                          patientid: self.patient_id,
                          reason: res.reason,
                          status: res.status
                        }
                      });
                    } else {
                      this.$router.replace({
                        name: "Query",
                      });
                    }
                    return
                  } else {
                    this.$router.replace({
                      name: "Query",
                    });
                  }
                }).catch(err => {
                  Toast(err.response.data.message);
                })
              } else {
                //没有填写资料
                if (res.idsn) {
                  this.$router.replace({
                    name: "Apply"
                  });
                } else {
                  this.$router.replace({
                    name: "BeforeApply",
                    query: {
                      patientid: res.id
                    }
                  });
                }
              }
            } else {
              //如果没有登录
              this.$router.replace({
                path: "/apply/login"
              });
            }
          })
          .catch(err => {
            Toast(err.response.data.message);
            this.$router.replace({
              path: "/apply/login"
            });
          });
      }
    }
  };
</script>

<style>
</style>