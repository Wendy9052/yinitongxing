<template>
  <div class="introduce">
    <div class="text" v-html="text"></div>
  </div>
</template>

<script>
  var jweixin = require('jweixin-module')
  import {
    pageInfo
  } from '../../api/api'
  export default {
    data() {
      return {
        text: ''
      }
    },
    mounted() {
      this.gettext()
    },
    methods: {
      async gettext() {
        await pageInfo({
          params: {
            "PageSearch[title]": "联系我们",
          }
        }).then((res) => {
          this.text = res.items[0].content
        })
      },
      goback() {
        // this.$wechat.closeWindow()
        this.$router.replace({path:'/'})
      }
    }

  }
</script>

<style lang="scss" scoped>
  .introduce {
    height: 100%;
    width: 100%;

    .text {
      padding: 10px;
    }
  }
</style>