<template>
  <div class="home-page-psp">
    <div class="banner-img" v-if="imgkv">
      <img :src="imgkv" alt />
    </div>
    <div class="drug">
      <div class="tit-primary">
        <span class="tag" style="background-color: #0666B0;"></span>
        患者关爱项目</div>
        <div class="drug-box">
          <div class="index-box">
            <div class="tit">患者申请</div>
            <div class="flex-list">
              <div class="item">
                <div class="flex-demo demo1" @click="toPsp()">
                  <div class="img"><img src="../../assets/home/home5.png" alt /></div>
                  <div class="txt">关爱申请</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  import imgkv from "@/assets/kv.jpg";

  export default {
    name: "Home",
    computed: {
      ...mapState({
        userInfo: state => state.userInfo,
      })
    },
    data() {
      return {
        imgkv: imgkv, //封面kv
        // userInfo: null
      };
    },
    created() {

    },
    methods: {

      //患者关爱申请
      toPsp() {
        window.location.href = "http://yntx.hdvision.cn/index.html"
      },

    },
  };

</script>

<style lang="less" scoped>
  .home-page-psp {
    padding-bottom: 20px;
    .banner-img {
      width: 100%;

      img {
        width: 100%;
      }
    }
    .drug {
      .tit-primary {
        font-size: 16px;
        color: rgba(36, 43, 49, 100);
        padding: 10px;
        .tag{ 
          display: inline-block;
          width: 4px;
          height: 15px;
          border-radius: 2px;
          vertical-align: middle;
          margin-right: 5px;
        }
      }
    }
    .drug-box {
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.15);
      border-radius: 6px;
      margin: 0 10px;
      background-color: #fff;
    }
    .index-box {
      padding: 5px 10px;
      box-sizing: border-box;
      .tit {
        font-size: 15px;
        padding: 5px;
        color: rgba(36, 43, 49, 100);
      }
      &:last-child {
        .flex-list {
          border: none;
        }
      } 
    }
    .flex-list {
      display: flex;
      line-height: 10px;
      text-align: center;
      border-bottom: 1px solid rgba(244, 244, 244, 1);
      padding-bottom: 10px;
      .item {
        width: 25%;
        box-sizing: border-box;
      }

      .flex-demo {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100px;
        font-size: 15px;
        font-weight: 500;
        border-radius: 5px;
        .img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-bottom: 15px;
          line-height: 50px;
          border: 1px solid #BBB;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .txt {
          color: rgba(35, 43, 48, 100);
        }

        img {
          width: 50px;
        }
      }
    }
  }

</style>
