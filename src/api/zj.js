import axios from 'axios'
import baseUrl from './request.js'


//患者是否登录
export function zjcheckin(data) {
  return axios.post(`${baseUrl}patient-zj/check-in`, data)
}

//注册
export function zjLogin(data) {
  return axios.post(`${baseUrl}patient-zj/login`, data)
}

//验证码
export function zjSendVerifyCode(data) {
  return axios.post(`${baseUrl}patient-zj/sendverifycode`, data)
}

//获取患者信息
export function zjGetPatient(data) {
  return axios.post(`${baseUrl}pap/get-patient`, data)
}

//获取知情同意书
export function zjPatientConfig(data) {
  return axios.post(`${baseUrl}patient-zj/config`, data)
}

//上传知情同意书
export function zjUploadContract(data) {
  return axios.post(`${baseUrl}patient-zj/upload-contract`, data)
}

//查询知情同意书信息
export function zjTypeCheckItem(data) {
  return axios.post(`${baseUrl}patient-zj/type-check-item`, data)
}

//身份证ocr识别
export function zjIdcardOcr(data) {
  return axios.post(`${baseUrl}patient-zj/idcard-ocr`, data)
}

//患者申请
export function zjApply(data) {
  return axios.post(`${baseUrl}patient-zj/apply`, data)
}

//获取省
export function zjGetProvince(data) {
  return axios.post(`${baseUrl}pap/get-province`, data)
}

//获取城市
export function zjGetCity(data) {
  return axios.post(`${baseUrl}pap/get-city`, data)
}

//获取医院
export function zjGetHospital(data) {
  return axios.post(`${baseUrl}pap/get-hospital`, data)
}

//获取药房
export function zjGetDrugstore(data) {
  return axios.post(`${baseUrl}default-audit/get-drugstores`, data)
}

//获取援助方式
export function zjGetMode(data) {
  return axios.post(`${baseUrl}pap/get-modes`, data)
}

//获取审核项
export function zjGetCheckItem(data) {
  return axios.post(`${baseUrl}pap/get-check-item`, data)
}

//上传审核项
export function zjUploadCheckItem(data) {
  return axios.post(`${baseUrl}patient-zj/check-item-upload`, data)
}

//删除审核项
export function zjdeleteCheckItem(data) {
  return axios.post(`${baseUrl}pap/delete-check-item`, data)
}

//提交审核材料后更新患者状态
export function zjUploadPatientStatus(data) {
  return axios.post(`${baseUrl}pap/update-patient-status`, data)
}

// 查询患者申请进度
export function zjQueryApplyProgress(data) {
  return axios.post(`${baseUrl}pap/query-apply-progress`, data)
}

//开启新阶段
export function zjnewPhase(data) {
  return axios.post(`${baseUrl}pap/new-phase`, data)
}

//快件录入
export function zjCreateExpress(data) {
  return axios.post(`${baseUrl}pap/create-express`, data)
}

//查询银行卡号
export function QueryBankcard(data) {
  return axios.post(`${baseUrl}patient-zj/query-bankcard`, data)
}

