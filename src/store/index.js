import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    patientOne: null, //患者第一阶段信息
    isLoading: false,
    direction: 'forward',
    userInfo: null,
    url: null,
    title: null,
    lecture: null,
    to: 1,
    patientInfo: null,
    zjUserInfo: null
  },
  getters: {
    getUserInfo(state) {
      return state.userInfo;
    },
    getZjUserInfo(state) {
      return state.zjUserInfo;
    },
    getPatientOne(state) {
      return state.patientOne;
    },
    getPatientInfo(state) {
      return state.patientInfo;
    },
    getPapid(state) {
      return state.userInfo.patient.papid
    }
  },
  mutations: {
    updateLoadingStatus(state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection(state, payload) {
      state.direction = payload.direction
    },
    setPatientInfo(state, patientInfo) {
      state.patientInfo = patientInfo;
    },
    setUserInfo(state, payload) {
      if (state.userInfo === null) {
        state.userInfo = payload.userInfo
      } else {
        Object.assign(state.userInfo, payload.userInfo)
      }
    },
    setZjUserInfo(state, payload) {
      if (state.zjUserInfo === null) {
        state.zjUserInfo = payload.zjUserInfo
      } else {
        Object.assign(state.zjUserInfo, payload.zjUserInfo)
      }
    },
    clearUserInfo(state) {
      state.userInfo = null
    },
    setUrl(state, payload) {
      state.url = payload
    },
    setTitle(state, payload) {
      state.title = payload
    },
    setLecture(state, payload) {
      state.lecture = payload.lecture
    },
    setTo(state, payload) {
      state.to = payload
    },
    setPatientOne(state, payload) {
      state.patientOne = payload.patientOne
    },
    clearPatientOne(state) {
      state.patientOne = null;
    }
  },
  actions: {
    setUserInfo(context) {
      context.commit('setUserInfo')
    },
    setZjUserInfo(context) {
      context.commit('setZjUserInfo')
    },
    setPatientOne(context) {
      context.commit('setPatientOne')
    },
    clearPatientOne(context) {
      context.commit('clearPatientOne');
    }
  },
  modules: {},
  plugins: [createPersistedState()],
});