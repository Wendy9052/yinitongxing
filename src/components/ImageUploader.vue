<template>
  <div class="myuploader">
    <van-cell-group class="uploader-box" :title="title" :border="false">
      <div class="words" v-if="words" style="color: rgba(69, 90, 100, 0.6);">{{words}}</div>
      <div class="uploader-subbox" v-if="showTemp && temp && temp.length>0">
        <div class="uploader-subtitle">示例图片</div>
        <van-row type="flex" gutter="20">
          <van-col @click="showPic(temp)">
            <van-image width="120" fit="contain" height="80" :src="temp" />
            <!-- <div class="text">示例1</div> -->
          </van-col>
        </van-row>
      </div>
      <div class="van-uploader">
        <div class="van-uploader__wrapper">
          <div class="van-uploader__preview" @click="showPic(image.filepath?image.filepath:(baseUrl+ image.src))"
            v-for="(image,index) in images" :key="image.serverId">
            <div class="van-image van-uploader__preview-image">
              <img :src="(image.filepath?image.filepath:(image.src ? (baseUrl+image.src):defaultImage))" class="van-image__img"
                style="object-fit: cover;">
            </div>
            <!-- <div class="van-uploader__mask" v-if="isLoading">
              <div class="van-loading van-loading--circular van-uploader__loading">
                <span class="van-loading__spinner van-loading__spinner--circular">
                  <svg viewBox="25 25 50 50" class="van-loading__circular">
                    <circle cx="50" cy="50" r="20" fill="none"></circle>
                  </svg>
                </span>
              </div>
              <div class="van-uploader__mask-message">上传中...</div>
            </div> -->
            <!-- <div class="van-uploader__mask">
              <i class="van-icon van-icon-close van-uploader__mask-icon"></i>
              <div class="van-uploader__mask-message">上传失败</div>
            </div> -->
            <i class="van-icon van-icon-clear van-uploader__preview-delete"
              @click.prevent.stop="removeImg(true, image,index)"></i>
          </div>
          <div class="van-uploader__upload" @click="chooseImage()" v-if="this.images.length<num">
            <i class="van-icon van-icon-photograph van-uploader__upload-icon"></i>
            <div class="van-uploader__input"></div>
          </div>
        </div>
      </div>
      <div class="uploader-subbox" v-if="showHistory && history.length>0">
        <div class="uploader-subtitle">已上传图片</div>
        <van-row>
          <van-col v-for="(hitem, hindex) in history" :key="hindex" @click="showPic(history, hindex)">
            <van-image width="80" fit="contain" height="80" :src="hitem.filepath">
              <i class="van-icon van-icon-clear van-uploader__preview-delete"
                v-if="status != '审核通过'" @click.stop="deleteImg(hitem.id)"></i>
            </van-image>
          </van-col>
        </van-row>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
  import Vue from "vue";
  import {
    Toast,
    ImagePreview,
    Dialog
  } from 'vant'
  import defaultImage from '@/assets/image.jpg'
  import {
    DownloadImage,
    DeleteImg,
    deleteCheckItem
  } from '@/api/api'
  Vue.use(Toast)
  Vue.use(ImagePreview)
  Vue.use(Dialog)

  export default {
    name: 'ImageUploader',
    props: {
      value: {
        type: Array
      },
      //   prevImages: {
      //       type: Array,
      //       default: []
      //   },
      title: {
        type: String,
        default: '上传图片'
      },
      note: {
        type: String,
        default: ''
      },
      num: {
        type: Number,
        default: 1
      },
      showTemp: {
        type: Boolean,
        default: true
      },
      temp: {
        type: String,
        default: ''
      },
      showHistory: {
        type: Boolean,
        default: true
      },
      history: {
        type: Array,
        default: []
      },
      words: {
        type: String,
        default: ''
      },
      status: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        defaultImage: defaultImage,
        images: [],
        src: [],
        isLoading: false
      };
    },
    created() {
      console.log(this.history, 'history')
      this.images = this.value
    },
    methods: {
      updateValue: function (value) {
        if (value === null) value = defaultImage
        this.$emit('input', value)
      },
      chooseImage(event) {
        this.wx.ready(() => {
          console.log('ready')
          this.wx.chooseImage({
            count: this.num,
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: async (res) => {
              try {
                for (let index = 0; index < res.localIds.length; index++) {
                  const serverId = res.localIds[index];
                  await this.uploadImage(serverId);
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
                  this.images.push({
                    serverId: serverId,
                    src: res
                  })
                  this.updateValue(this.images)
                  this.isLoading = false
                  resolve()
                })
                .catch((err) => {
                  //  reject(err.response.data.message)
                  console.log(error)
                  this.isLoading = false
                  reject(error)
                })
            }
          });
        });
      },
      removeImg(is_new, item, index) {
        Dialog.confirm({
            message: '确定删除？',
          })
          .then(() => {
            DeleteImg({
              src: item.src
            }).then(res => {
              this.images.splice(index, 1)
              Toast('删除成功')
            }).catch(err => {
              Toast('删除失败')
            })
          })
          .catch((err) => {
            console.log(err);
          });
      },
      deleteImg(id) {
        this.$emit('deleteCI', id)
      },
      onImgError(item, $event) {
        console.log(item, $event);
      },
      showPic(route, index) {
        this.src = []
        if (Array.isArray(route)) {
          route.forEach(ele => {
            this.src.push(ele.filepath)
          })
        } else {
          this.src.push(route)
        }
        this.$nextTick(() => {
          ImagePreview({
            images: this.src,
            showIndex: true,
            loop: false,
            startPosition: index ? index : 0,
          })
        })
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .myuploader {
    .van-cell-group__title {
      padding: 10px;
      font-size: 16px;
      color: #333;
    }

    .uploader-box {
      box-sizing: border-box;
      padding: 10px 15px;
      // border-top: 1px solid rgba(0,0,0,0.07);
      // border-bottom: 1px solid rgba(0,0,0,0.07);
      overflow: hidden;

      .uploader-subbox {
        border-bottom: #eee solid 1px;
        margin-bottom: 20px;

        .text {
          margin-top: 5px;
          color: #666;
          text-align: center;
        }

        .van-col {
          margin-bottom: 15px;
          position: relative;
          margin-right: 10px;
        }
      }

      .uploader-subtitle {
        margin: 0;
        padding: 32px 0px 16px;
        color: rgba(69, 90, 100, 0.6);
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
      }

      .uploader-subbox:first-child {
        .uploader-subtitle {
          padding-top: 0;
        }
      }

      .uploader-subbox:last-child {
        margin-bottom: 0;
        border-bottom-width: 0;
      }
    }

    .van-image {
      background: #f6f6f6;
    }
  }
</style>