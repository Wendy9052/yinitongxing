<template>
  <div class="upload-item">
    <div class="shadow-box">
      <image-uploader ref="imgUploader" :title="checkItem.name" :value="images" :num="num" :history="checkItem.attach"
        :temp="checkItem.image" @deleteCI="deleteCI" :words="checkItem.words" :status="checkItem.status"></image-uploader>
    </div>
    <div class="upload-status shadow-box" v-if="checkItem.status=='审核不通过'"
      :class="checkItem.status=='审核不通过'?'red':''">
      <div class="status">{{checkItem.status}}</div>
      <div class="reason">驳回原因：{{checkItem.reason}}</div>
    </div>
    <div class="btn btn-flex">
      <van-button type="default" :class="checkItem.status!='审核通过'?'back':'up'" @click="back()">返回</van-button>
      <van-button type="default" class="up" @click="submitUpload" :disabled="disabled"
        v-if="checkItem.status!='审核通过'">
        提交并保存</van-button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import {
    UploadCheckItem,
    deleteCheckItem,
    GetCheckItem,
    FollowUpload,
    UploadRecipel
  } from '../../api/api'
  import {
    Toast,
    ImagePreview,
    Dialog,
    Uploader
  } from 'vant'
  import {
    mapState
  } from "vuex";
  import ImageUploader from "@/components/ImageUploader";

  Vue.use(Toast)
  Vue.use(ImagePreview)
  Vue.use(Dialog)
  Vue.use(Uploader);

  export default {
    name: "upload-item",
    components: {
      ImageUploader
    },
    data() {
      return {
        papid: '',
        patient_id: '',
        check_item_id: '',
        category: '',
        follow: false,
        images: [],
        checkItem: {
          name: '',
          attach: [],
          image: ''
        },
        disabled: false,
      };
    },
    computed: {
      ...mapState(['userInfo']),
      num() {
        let n = 0
        if (this.checkItem.status != '审核通过') {
          n = 9 - this.checkItem.attach.length
        }
        return n
      }
    },
    async created() {
      this.papid = this.$route.query.papid;
      this.check_item_id = this.$route.query.id;
      this.category = this.$route.query.category;
      this.active = this.$route.query.active;
      this.follow = this.$route.query.follow;
      if (this.userInfo.patient) {
        this.patient_id = this.userInfo.patient.id
      }
      // console.log(this.category, this.$route.query, 'num:', this.num)
      await this.getData()
    },
    methods: {
      async getData() {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true
        });
        this.checkItem = await GetCheckItem({
          papid: this.papid,
          category: this.category,
          check_item_id: this.check_item_id
        })
        Toast.clear()
      },
      submitUpload() {
        if (this.checkItem.attach.length == 0 && this.images.length == 0) {
          Toast("材料未上传");
          return;
        }
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          overlay: true
        });
        this.nextBtnDisabled = true
        let ci = []
        this.images.forEach(ele => {
          ci.push(this.baseUrl + ele.src)
        });
        if (this.category == '后续复核') {
          FollowUpload({
            papid: this.papid,
            check_items: ci,
            category: this.category,
            check_item_id: this.check_item_id
          }).then((res) => {
            this.nextBtnDisabled = false
            if (res) {
              this.$router.replace({
                name: "Upload",
                query: {
                  active: this.active,
                  category: this.category
                }
              })
              Toast({
                message: "材料上传成功",
                duration: 1000
              });
            }
            Toast.clear()
          }).catch((err) => {
            this.nextBtnDisabled = false
            Toast.clear()
            Toast(err.response.data.message)
          })
          return
        } else {
          UploadCheckItem({
            papid: this.papid,
            check_items: ci,
            category: this.category,
            check_item_id: this.check_item_id
          }).then((res) => {
            this.nextBtnDisabled = false
            if (res) {
              this.$router.replace({
                name: "Upload",
                query: {
                  active: this.active,
                  category: this.category
                }
              })
              Toast({
                message: "材料上传成功",
                duration: 1000
              });
            }
            Toast.clear()
          }).catch((err) => {
            this.nextBtnDisabled = false
            Toast.clear()
            Toast(err.response.data.message)
          })
        }
      },
      back() {
        let qdata = {
          active: this.active
        }
        if (this.category == '后续复核') {
          qdata.category = this.category
        }
        if (this.follow) {
          qdata.follow = this.follow
        }
        this.$router.replace({
          name: "Upload",
          query: qdata
        })
      },
      deleteCI(val) {
        Dialog.confirm({
            message: '确定删除？',
          })
          .then(() => {
            deleteCheckItem({
              papid: this.papid,
              id: val
            }).then((res) => {
              this.getData();
              this.$forceUpdate();
            }).catch((err) => {
              Toast(err.response.data.message)
            })
          })
          .catch((err) => {
            // console.log(err);
          });
      }
    },
  };
</script>

<style lang="less">
  .upload-item {
    padding-TOP: 2px;
    box-sizing: border-box;

    .myuploader {
      background: #fff;
    }

    .upload-status {
      padding: 10px 15px;
      font-size: 14px;

      &.red {
        color: @red;
      }
    }

    .btn {
      margin-bottom: 20px; 
      &.btn-flex {
        display: flex; margin: 0 16px; width: auto;
        .back {
          width: 120px; margin-right: 10px;
        }
      }
    }
  }
</style>