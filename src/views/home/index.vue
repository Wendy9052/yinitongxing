<template>
  <div class="home-page">
    <div class="banner-img" v-if="imgkv">
      <img :src="imgkv" alt />
    </div>

    <div class="drug">
      <div class="tit-primary">
        <span class="tag" style="background-color: #EF8E01;"></span>
        资金援助项目</div>
      <div class="drug-box">
        <div class="index-box">
          <div class="tit">项目信息</div>
          <div class="flex-list">
            <div class="item">
              <div class="flex-demo demo1" @click="projectShow('zj')">
                <div class="img"><img src="../../assets/home/home1.png" alt /></div>
                <div class="txt">项目介绍</div>
              </div>
            </div>
            <div class="item">
              <div class="flex-demo demo1" @click="download('zj')">
                <div class="img"><img src="../../assets/home/home2.png" alt /></div>
                <div class="txt">资料下载</div>
              </div>
            </div>
          </div>
        </div>
        <div class="index-box">
          <div class="tit">患者申请</div>
          <div class="flex-list">
            <div class="item">
              <div class="flex-demo demo1" @click="handleZjApply">
                <div class="img"><img src="../../assets/home/home5.png" alt /></div>
                <div class="txt">在线申请</div>
              </div>
            </div>
            <div class="item">
              <div class="flex-demo demo1" @click="zjQuery">
                <div class="img"><img src="../../assets/home/home6.png" alt /></div>
                <div class="txt">进度查询</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="drug">
      <div class="tit-primary">
        <span class="tag" style="background-color: #E64101;"></span>
        药品援助项目</div>
      <div class="drug-box">
        <div class="index-box">
          <div class="tit">项目信息</div>
          <div class="flex-list">
            <div class="item">
              <div class="flex-demo demo1" @click="projectShow('yp')">
                <div class="img"><img src="../../assets/home/home1.png" alt /></div>
                <div class="txt">项目介绍</div>
              </div>
            </div>
            <div class="item">
              <div class="flex-demo demo1" @click="download('yp')">
                <div class="img"><img src="../../assets/home/home2.png" alt /></div>
                <div class="txt">资料下载</div>
              </div>
            </div>
            <div class="item">
              <div class="flex-demo demo1" @click="mapHospital">
                <div class="img"><img src="../../assets/home/home3.png" alt /></div>
                <div class="txt">项目医院</div>
              </div>
            </div>
            <div class="item">
              <div class="flex-demo demo1" @click="mapDrugstore">
                <div class="img"><img src="../../assets/home/home4.png" alt /></div>
                <div class="txt">项目药房</div>
              </div>
            </div>
          </div>
        </div>
        <div class="index-box">
          <div class="tit">患者申请</div>
          <div class="flex-list">
            <div class="item">
              <div class="flex-demo demo1" @click="handleDrugApply">
                <div class="img"><img src="../../assets/home/home5.png" alt /></div>
                <div class="txt">在线申请</div>
              </div>
            </div>
            <div class="item">
              <div class="flex-demo demo1" @click="drugQuery">
                <div class="img"><img src="../../assets/home/home6.png" alt /></div>
                <div class="txt">进度查询</div>
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

      //药品在线申请
      handleDrugApply() {
        this.$router.push({
          path: "/apply",
        });
      },

      //资金在线申请
      handleZjApply() {
        this.$router.push({
          path: "/zj",
        });
      },

      //药品进度查询
      drugQuery() {
        this.$router.push({
          path: '/apply/timeline'
        });
      },

      //资金进度查询
      zjQuery() {
        this.$router.push({
          path: '/zj/timeline'
        });
      },

      //项目介绍
      projectShow(project) {
        this.$router.push({
          path: '/project/introduce',
          query: {
            project
          }
        });
      },
      //资料下载
      download(project) {
        this.$router.push({
          path: '/project/download',
          query: {
            project
          }
        });
      },
      //项目医院
      mapHospital() {
        this.$router.push({
          path: '/organization/mapHospital'
        });
      },
      //项目药房
      mapDrugstore() {
        this.$router.push({
          path: '/organization/mapDrugstore'
        });
      },
    },
  };

</script>

<style lang="less" scoped>
  .home-page {
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
