<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
</script>
<style lang="less">
  @import "@/style/global.less";

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: PingFang SC;
  }

  html {
    background: #F7F8FF;
  }

  #nav {
    padding: 30px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }

  .btn {
    min-height: 50px;
    width: 100%;
    z-index: 999;
    margin-top: 20px;
    .up {
      width: 90%;
      height: 44px;
      line-height: 23px;
      border-radius: 30px;
      background-color: @theme-color;
      color: rgba(246, 248, 255, 1);
      font-size: 16px;
      text-align: center;
      box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.01);
      font-family: -apple-system;
      border: 1px solid rgba(255, 255, 255, 0);
      margin: 0 auto;
      display: block;
      margin-bottom: 10px;
    }

    .back {
      width: 90%;
      height: 44px;
      line-height: 23px;
      border-radius: 30px;
      background-color: #fff;
      color: #1989fa;
      font-size: 16px;
      text-align: center;
      box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.03);
      font-family: -apple-system;
      border: 1px solid #1989fa;
      margin: 0 auto;
      display: block;
    }
  }

  .introduce{
    /* 文章详情 */
    &.article-img {
      max-width: 677px; margin: auto; padding-bottom: 90px;
      .article-c {
        line-height: 1.5; overflow: hidden; color: #444; text-align: justify; text-align-last: left;
        img,p img { max-width: 100% !important; height: auto !important;}
      }
      .bigimg {
        width: 100% !important;
      }
    }
  }
</style>