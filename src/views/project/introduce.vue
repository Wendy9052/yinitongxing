<template>
  <div class="introduce article-img">
    <div class="article-c" v-html="text"></div>
    <div class="article-btn">
      <van-button type="info" block round @click="goback">返回</van-button>
    </div>
  </div>
</template>

<script>
 var jweixin = require('jweixin-module')  
import {pageInfo} from '../../api/api'
export default {
  data(){
    return{
       text:'',
       project_id: null
    }
  },
  created() {
    if(this.$route.query.project == 'zj') {
      this.project_id = 1
    }else if(this.$route.query.project == 'yp') {
      this.project_id = 0
    }
  },
  mounted(){
    this.gettext()
  },
  methods:{
    async gettext(){
      await pageInfo({params:{
          "PageSearch[remark]": "项目介绍",
          "PageSearch[project_id]" : this.project_id
      }}).then((res)=>{
        let text = ''
        text = res.items[0].content
        this.text = text.replace(/\<img/gi, '<img class="bigimg"');
      })
    },
    goback(){
      // this.$wechat.closeWindow()
      this.$router.replace({path:'/'})
    }
  }

}
</script>

<style lang="scss" scoped>
    .introduce{
      height: 100%;
      width: 100%;
      padding-bottom: 70px;
      box-sizing: border-box;
      /* 文章详情 */
      &.article-img {
        max-width: 677px; margin: auto;
        .article-c {
          line-height: 1.5; overflow: hidden; color: #444; text-align: justify; text-align-last: left;
          img,p img { max-width: 100% !important; height: auto !important;}
        }
        .bigimg {
          width: 100% !important;
        }
        .article-btn{
          background-color: #fff;
          padding: 10px 0 30px;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 99;
          padding: 20px;
          box-sizing: border-box;
          .van-button {
            box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.03);
          }
        }
      }
    }
</style>