<template>
  <div class="notice">
    <div class="list">
      <div class="list-cell" v-for="(titem,tindex) in toplist" :key="tindex" @click="gonext(titem)">
        <div class="commend">{{titem.commend}}</div>
        <div class="article">
          <p class="van-multi-ellipsis--l2" v-html="titem.title"></p>
        </div>
        <van-image width="78" height="48" :src="titem.image" fit="contain" />
      </div>
      <div class="list-cell" v-for="(item,index) in list" :key="index" @click="gonext(item)">
        <div class="article">
          <p class="van-multi-ellipsis--l2" v-html="item.title"></p>
        </div>
        <van-image width="78" height="48" :src="item.image" fit="contain" />
      </div>
    </div>
    <div class="btn">
      <van-button class="up" @click="goback">返回</van-button>
    </div>
  </div>
</template>

<script>
  import {
    articles
  } from '../../api/api'
  let hostname = location.hostname;
  hostname = hostname.substring(hostname.indexOf('.'));
  let appHost = `${location.protocol}//api${hostname}`;
  var jweixin = require('jweixin-module')
  export default {
    data() {
      return {
        toplist: [],
        list: [],
        appHost: appHost
      }
    },
    mounted() {
      this.getlist()
    },
    methods: {
      async getlist() {
        await articles({
          params: {
            'ArticleSearch[column_name]': '项目公告',
            'sort': 'sortnum desc',
          }
        }).then((res) => {
          this.toplist = res.items.filter(item => item.commend != '')
          this.list = res.items.filter(item => item.commend == '')
        })
      },
      goback() {
        // this.$wechat.closeWindow()
        this.$router.replace({path:'/'})
      },
      gonext(item) {
        this.$router.push({
          path: '/project/noticeDetail',
          query: {
            id: item.id,
            column_id: this.column_id
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .notice {
    height: 100%;
    width: 100%;
    padding-top: 20px;
    box-sizing: border-box;
    padding-bottom: 70px;

    .list {
      width: 92%;
      border-radius: 10px;
      margin: 0 auto;
      box-shadow: 0px 1px 10px 0px rgba(3, 121, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0);
      background: white;

      .list-cell {
        height: 70px;
        width: 100%;
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        overflow: hidden;
        position: relative;

        .commend {
          width: 100px;
          position: absolute;
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          color: #fff;
          background: @red;
          text-align: center;
          transform: rotate(-45deg);
          top: 0;
          left: -50px;
          margin: 5px 0 0 12px;
        }

        .van-image {
          margin: 0 15px;
          background: #f6f6f6;
          border-radius: 5px;
          border: #f2f2f2 1px solid;
        }

        .article {
          margin-left: 15px;
          //  margin-top: 10px;
          flex: 1;
          min-width: 0;
          font-size: 16px;
        }
      }

      .list-cell:last-child {
        border-bottom: none;
      }
    }

    .btn {
      position: fixed;
      bottom: 0;
      left: 0;
      background: #F7F8FF;
      z-index: 99;
      padding-bottom: 20px;
      box-sizing: border-box;
    }
  }
</style>