import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/views/home/index.vue"; //首页

import Blank from "@/views/apply/blank.vue"; //跳转页
import Login from "@/views/apply/login.vue"; //登录页
import BeforeApply from "@/views/apply/beforeApply.vue"; //知情同意书
import Apply from "@/views/apply/apply.vue"; //基本信息
import Upload from "@/views/apply/upload.vue"; //上传材料
import UploadItem from "@/views/apply/uploadItem.vue"; //上传材料单项
import Msg from "@/views/apply/msg.vue"; //消息页
import Query from "@/views/apply/query.vue"; //结果页
import Timeline from "@/views/apply/timeline.vue"; //结果页
import GetMedicine from "@/views/apply/getMedicine.vue"; //领药详情


import Manage from "@/views/apply/manage.vue"; //代领药人管理
import AddReplace from "@/views/apply/addReplace.vue"; //添加代领药人信息
import UploadReplace from "@/views/apply/uploadReplace.vue"; //材料上传

import Out from "@/views/apply/out.vue"; //出组


import MapHospital from "@/views/organization/mapHospital.vue"; //药房医院
import MapDrugstore from "@/views/organization/mapDrugstore.vue"; //药房医院

import Download from "@/views/project/download.vue"; //资料下载
import Introduce from "@/views/project/introduce.vue"; //项目介绍
import Process from "@/views/project/process.vue"; //项目流程
import Notice from "@/views/project/notice.vue"; //项目公告
import NoticeDetail from "@/views/project/notice-detail.vue"; //项目公告详情
import PspHome from "@/views/psp/home.vue"; //项目公告详情



import zjRoute from './zj.js'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: '因你同行患者援助项目'
    }
  },
  {
    path: "/apply",
    name: "Blank",
    component: Blank,
    meta: {
      title: '跳转中'
    }
  },
  {
    path: "/apply/login",
    name: "Login",
    component: Login,
    meta: {
      title: '在线注册/登录'
    }
  },
  {
    path: "/apply/before_apply",
    name: "BeforeApply",
    component: BeforeApply,
    meta: {
      title: '在线申请'
    }
  },
  {
    path: "/apply/apply",
    name: "Apply",
    component: Apply,
    meta: {
      title: '完善基本信息'
    }
  },
  {
    path: "/apply/upload",
    name: "Upload",
    component: Upload,
    meta: {
      title: '上传材料'
    }
  },
  {
    path: "/apply/uploadItem",
    name: "UploadItem",
    component: UploadItem,
    meta: {
      title: '上传材料'
    }
  },
  {
    path: "/apply/msg",
    name: "Msg",
    component: Msg,
    meta: {
      title: '因你同行'
    }
  },
  {
    path: "/apply/query",
    name: "Query",
    component: Query,
    meta: {
      title: '因你同行'
    }
  },
  {
    path: "/apply/timeline",
    name: "Timeline",
    component: Timeline,
    meta: {
      title: '进度查询'
    }
  },



  {
    path: "/psp",
    name: "PspHome",
    component: PspHome,
    meta: {
      title: '因你同行患者援助项目'
    }
  },

  {
    path: "/apply/out",
    name: "Out",
    component: Out,
    meta: {
      title: '因你同行'
    }
  },
  {
    path: "/apply/getMedicine",
    name: "GetMedicine",
    component: GetMedicine,
    meta: {
      title: '领药信息'
    }
  },
  {
    path: "/organization/mapHospital",
    name: "Map",
    component: MapHospital,
    meta: {
      title: '项目医院'
    }
  },
  {
    path: "/organization/mapDrugstore",
    name: "Map",
    component: MapDrugstore,
    meta: {
      title: '项目药房'
    }
  },
  {
    path: "/project/download",
    name: "Download",
    component: Download,
    meta: {
      title: '资料下载'
    }
  },
  {
    path: "/project/introduce",
    name: "Introduce",
    component: Introduce,
    meta: {
      title: '项目介绍'
    }
  },
  {
    path: "/project/process",
    name: "Process",
    component: Process,
    meta: {
      title: '项目流程'
    }
  },
  {
    path: "/project/notice",
    name: "Notice",
    component: Notice,
    meta: {
      title: '项目公告'
    }
  },
  {
    path: "/project/noticeDetail",
    name: "NoticeDetail",
    component: NoticeDetail,
    meta: {
      title: '项目详情'
    }
  },
  {
    path: "/apply/manage",
    name: "Manage",
    component: Manage,
    meta: {
      title: '代领药人管理'
    }
  },
  {
    path: "/apply/add_replace",
    name: "AddReplace",
    component: AddReplace,
    meta: {
      title: '添加代领药人信息'
    }
  },
  {
    path: "/apply/upload_replace",
    name: "UploadReplace",
    component: UploadReplace,
    meta: {
      title: '材料上传'
    }
  },
  // {
  //   path: "/referral/apply",
  //   name: "ReApply",
  //   component: ReApply,
  //   meta: {
  //     title: '转诊申请'
  //   }
  // },
  // {
  //   path: "/referral/change",
  //   name: "ReChange",
  //   component: ReChange,
  //   meta: {
  //     title: '转诊申请'
  //   }
  // },
  ...zjRoute
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;