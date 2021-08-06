<template>
  <div class="introduce article">
    <div class="article-title">
        <h2>{{title}}</h2>
    </div>
    <div class="article-c" v-html="text"></div>
    <div class="article-btn">
      <van-button type="info" block round @click="goback">返回</van-button>
    </div>
  </div>
</template>

<script>
 var jweixin = require('jweixin-module')  
import {articles} from '../../api/api'
export default {
  data(){
    return{
      title: '',
      text:'',
    }
  },
  mounted(){
    this.gettext()
    // console.log(this.$route.query.column_id)
  },
  methods:{
    async gettext(){
      await articles({params:{
        'ArticleSearch[column_id]':this.$route.query.column_id,
        'sort':'sortnum desc',
        'ArticleSearch[id]': this.$route.query.id
      }}).then((res)=>{
        this.title = res.items[0].title
        this.text = res.items[0].content
      })
    },
    goback(){
     this.$router.replace({
        path:'/project/notice'
	})
    }
  }

}
</script>

<style lang="scss" scoped>
    .introduce{
      // height: 100%;
      // width: 100%;
      // padding-bottom: 70px;
      // box-sizing: border-box;
      // .text{
      //   padding: 10px;
      //   img,video,iframe {
      //     max-width: 100% !important; height: auto;
      //   }
      // }
      // .btn{
      //   position: fixed;
      //   bottom: 0;
      //   left: 0;
      //   background: #F7F8FF ;
      //   z-index: 99;
      //   padding-bottom: 20px;
      //   box-sizing: border-box;
      // }
    }
</style>