<template>
  <div> </div>
</template>

<script>
  import Vue from "vue";
  import {
    Toast
  } from 'vant'
  import {
    zjcheckin,
    zjTypeCheckItem
  } from "../../api/zj";
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
      async getPatient() {
        let self = this
        await zjcheckin()
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
                const patient = res.pap;
                zjTypeCheckItem({
                  patient_id: res.id,
                }).then(res => {
                  console.log(res,'res')
                  if (res.status == '审核不通过' || res.status == '未上传') {
                    if (patient.status == "初始" && patient.statusing == "初审驳回") {
                      this.$router.replace({
                        name: "zjBeforeApply",
                        query: {
                          patientid: self.patient_id,
                          reason: res.reason,
                          status: res.status
                        }
                      });
                    } else {
                      this.$router.replace({
                        name: "zjQuery",
                      });
                    }
                    return
                  } else {
                    this.$router.replace({
                      name: "zjQuery",
                    });
                  }
                }).catch(err => {
                  // console.log(err,'err')
                  Toast(err.response.data.message);
                })
              } else {
                //没有填写资料
                if (res.idsn) {
                  this.$router.replace({
                    name: "zjApply"
                  });
                } else {
                  this.$router.replace({
                    name: "zjBeforeApply",
                    query: {
                      patientid: res.id
                    }
                  });
                }
              }
            } else {
              //如果没有登录
              this.$router.replace({
                path: "/zj/login"
              });
            }
          })
          .catch(err => {
            this.$router.replace({
              path: "/zj/login"
            });
          });
      }
    }
  };
</script>

<style>
</style>