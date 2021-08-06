export default [
  {
    path: "/zj",
    name: "zjBlank",
    component: () => import('@/views/zj/blank.vue'),
    meta: {
      title: '跳转中'
    }
  },
  {
    path: "/zj/login",
    name: "zjLogin",
    component: () => import('@/views/zj/login.vue'),
    meta: {
      title: '在线注册/登录'
    }
  },
  {
    path: "/zj/before_apply",
    name: "zjBeforeApply",
    component: () => import('@/views/zj/beforeApply.vue'),
    meta: {
      title: '在线申请'
    }
  },
  {
    path: "/zj/apply",
    name: "zjApply",
    component: () => import('@/views/zj/apply.vue'),
    meta: {
      title: '完善基本信息'
    }
  },
  {
    path: "/zj/upload",
    name: "zjUpload",
    component: () => import('@/views/zj/upload.vue'),
    meta: {
      title: '上传材料'
    }
  },
  {
    path: "/zj/uploadItem",
    name: "zjUploadItem",
    component: () => import('@/views/zj/uploadItem.vue'),
    meta: {
      title: '上传材料'
    }
  },
  {
    path: "/zj/msg",
    name: "zjMsg",
    component: () => import('@/views/zj/msg.vue'),
    meta: {
      title: '因你同行'
    }
  },
  {
    path: "/zj/query",
    name: "zjQuery",
    component: () => import('@/views/zj/query.vue'),
    meta: {
      title: '因你同行'
    }
  },
  {
    path: "/zj/timeline",
    name: "zjTimeline",
    component: () => import('@/views/zj/timeline.vue'),
    meta: {
      title: '进度查询'
    }
  },
]