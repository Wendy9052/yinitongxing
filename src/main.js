import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import Vuex from 'vuex';
import wx from 'weixin-js-sdk';
import wechat from 'jweixin-module';
import {
  Toast,
  Col,
  Row,
  Button,
  field,
  popup,
  Picker,
  CellGroup,
  checkbox,
  Uploader,
  Icon,
  Step,
  Steps,
  CheckboxGroup,
  Dialog,
  Collapse,
  CollapseItem,
  Swipe,
  SwipeItem,
  Tab,
  Tabs,
  Cell,
  Search,
  RadioGroup,
  Radio,
  Image as VanImage
} from 'vant';
import vConsole from 'vconsole';
location.hostname.includes('papwxtest') && new vConsole();

import FastClick from 'fastclick'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  sync
} from 'vuex-router-sync'
import VeeValidate from 'vee-validate'
import VueWechatTitle from 'vue-wechat-title' //动态标题
import VueTimeago from 'vue-timeago'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
import cookie from './utils/cookie.js';
import BaiduMap from 'vue-baidu-map'
import store from './store'

Vue.use(BaiduMap, {
  ak: 'YXj45G9DAY3T9WMbwbLwrNqAvcwb4Svp'
})

Es6Promise.polyfill()
Vue.use(Vuex)
Vue.use(Toast);
Vue.use(Col);
Vue.use(Row);
Vue.use(Button)
Vue.use(field)
Vue.use(popup)
Vue.use(Picker)
Vue.use(CellGroup)
Vue.use(checkbox)
Vue.use(Uploader)
Vue.use(Icon)
Vue.use(Step)
Vue.use(Steps)
Vue.use(CheckboxGroup)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Dialog)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Cell)
Vue.use(Search)
Vue.use(VanImage);
Vue.use(RadioGroup)
Vue.use(Radio);
Vue.use(VueWechatTitle)
Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'zh-CN',
  locales: {
    // you will need json-loader in webpack 1
    'en-US': require('vue-timeago/locales/en-US.json'),
    'zh-CN': require('vue-timeago/locales/zh-CN.json')
  }
})
// import {  Button} from 'vant';

// Vue.use(Button)
Vue.prototype.$wechat = wechat;
const VeeValidateConfig = {
  errorBagName: 'validateErrors', // change if property conflicts
  fieldsBagName: 'fields',
  delay: 0,
  locale: 'zh_CN',
  dictionary: null,
  strict: true,
  classes: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'blur',
  inject: true,
  validity: false,
  aria: true
}
Vue.use(VeeValidate, VeeValidateConfig)

// Vue.use(ConfigPlugin, {
//   $layout: 'VIEW_BOX' // global config for VUX, since v2.5.12
// })

FastClick.attach(document.body)

Vue.config.productionTip = false
axios.defaults.withCredentials = true

axios.defaults.retry = 1;
axios.defaults.retryDelay = 500;
axios.defaults.timeout = 30000;


// 得出api地址
let hostname = window.location.hostname
hostname = hostname.substring(hostname.indexOf('.'))
let baseUrl = window.location.protocol + '//api' + hostname;
Vue.prototype.baseUrl = baseUrl
axios.defaults.baseURL = baseUrl + '/yntx/'

axios.interceptors.response.use(response => {
	if(response.status == 200) {
		Toast.clear();
		return response.data;
	}
}, function axiosRetryInterceptor(err) {
  if (err.response && err.response.status === 403) {
    Dialog.alert({
      message: '该用户已在别处登录',
    }).then(() => {
      router.push({
        path: '/apply/login'
      })
    });
    return Promise.reject(err);
  }
  if (err.response && err.response.status === 401) {
    store.commit('clearUserInfo')
    cookie.remove('_identity-user');
    window.location.reload()
  }
  var config = err.config;
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err);

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    Vue.$vux.toast.show({
      type: 'cancel',
      // text: '网络超时，请检查网络连接，然后刷新页面',
      text: err.response.data.message,
      time: 5000
    })
    return Promise.reject(err);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // Create new promise to handle exponential backoff
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1);
  });

  // Return the promise in which recalls axios to retry the request
  return backoff.then(function () {
    return axios(config);
  });
});


const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)





Vue.prototype.wx = wx;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;


router.beforeEach(function (to, from, next) {

  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (!cookie.get('_identity-user') || cookie.get('papwx_module') != 'yntx') {
    // 第一次访问
    console.log('授权登录')
    store.commit('clearUserInfo');
    cookie.remove('_identity-user');
    store.commit('clearUserInfo')
    cookie.set('papwx_module', 'yntx', {
      domain: hostname,
      path: '/',
      expires: 365
    });
    // 跳转到微信授权页面，微信授权地址通过服务端获得
    axios.get('oauth/get-redirect-url', {
      params: {
        redirectUrl: window.location.protocol + "//" + location.hostname + to.fullPath
        // redirectUrl: 'http://' + location.hostname + '/?#' + to.fullPath
      }
    }).then(res => {
      // if (res.status === 200) {
        window.location.href = res
      // }
    })
  } else if (!store.state.userInfo) {
    console.log('获取用户信息')
    // 刷新页面，获取数据存入vuex
    let assist_type = ''
    if(window.location.href.includes('zj')) {
      assist_type = 'zj'
    }else {
      assist_type = 'yp'
    }

    axios.get(`oauth/get-current-user?assist_type=${assist_type}`).then(res => {
      // if (res.status === 200) {
        store.commit('setUserInfo', {
          userInfo: res
        })
        axios.defaults.auth = {
          username: res.access_token
        };
        next()
      // }
    })
  } else {
    // 已经登录
    console.log('已登录')
    axios.defaults.auth = {
      username: store.state.userInfo.access_token
    };
    store.commit('updateLoadingStatus', {
      isLoading: true
    })

    const toIndex = history.getItem(to.path)
    const fromIndex = history.getItem(from.path)

    if (toIndex) {
      if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
        store.commit('updateDirection', {
          direction: 'forward'
        })
      } else {
        store.commit('updateDirection', {
          direction: 'reverse'
        })
      }
    } else {
      ++historyCount
      history.setItem('count', historyCount)
      to.path !== '/' && history.setItem(to.path, historyCount)
      store.commit('updateDirection', {
        direction: 'forward'
      })
    }

    // document.title = to.meta.title
    // 处理jssdk签名,兼容history模式
    console.log(store.state.url, 'store')
    if (!store.state.url || store.state.url != window.location.href.split('#')[0]) {
      // console.log(document.URL,'s')
      store.commit('setUrl', document.URL)
    }

    if (/\/http/.test(to.path)) {
      let url = to.path.split('http')[1]
      window.location.href = `http${url}`
    } else {
      NProgress.start();
      next()
    }
  }
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {
    isLoading: false
  })
  NProgress.done();
  if (process.env.NODE_ENV === 'production') {
    // ga && ga('set', 'page', to.fullPath)
    // ga && ga('send', 'pageview')
  }
  Vue.nextTick(async () => {
    var url = ''
    // 判断是否是ios微信浏览器
    if (window.__wxjs_is_wkwebview === true) {
      console.log('__wxjs_is_wkwebview');
      if (store.state.url) {
        url = store.state.url.split('#')[0]
      } else {
        url = window.location.href.split('#')[0]
      }
    } else {
      console.log('is not wkwebview');
      url = window.location.href.split('#')[0]
    }
    console.log('wechat jssdk', url);

    await axios.get('wechat/js-sdk-config', {
      params: {
        url: url
      }
    }).then(response => {
      // js-sdk配置
      wechat.config(response);
      wx.config(response);
    })
  }, 500)

})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");