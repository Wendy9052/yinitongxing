import axios from 'axios'
import baseUrl from './request.js'

//患者是否登录
export function checkin(data) {
    return axios.post(`${baseUrl}patient/check-in`, data)
}

//注册
export function Login(data) {
    return axios.post(`${baseUrl}patient/login`, data)
}

//验证码
export function SendVerifyCode(data) {
    return axios.post(`${baseUrl}patient/sendverifycode`, data)
}

//获取知情同意书
export function PatientConfig(data) {
    return axios.post(`${baseUrl}patient/config`, data)
}

//上传知情同意书
export function UploadContract(data) {
    return axios.post(`${baseUrl}patient/upload-contract`, data)
}

//查询知情同意书信息
export function TypeCheckItem(data) {
    return axios.post(`${baseUrl}pap-audit/type-check-item`, data)
}

//身份证ocr识别
export function IdcardOcr(data) {
    return axios.post(`${baseUrl}patient/idcard-ocr`, data)
}

//患者申请
export function Apply(data) {
    return axios.post(`${baseUrl}patient/apply`, data)
}

//获取居住地省
export function GetAdminProvince(data) {
    return axios.post(`${baseUrl}default-audit/get-admin-province`, data)
}

//获取居住地城市
export function GetAdminCity(data) {
    return axios.post(`${baseUrl}default-audit/get-admin-city`, data)
}

//获取省
export function GetProvince(data) {
    return axios.post(`${baseUrl}default-audit/get-province`, data)
}

//获取城市
export function GetCity(data) {
    return axios.post(`${baseUrl}default-audit/get-city`, data)
}

//获取医院
export function GetHospital(data) {
    return axios.post(`${baseUrl}default-audit/get-hospitals`, data)
}

//获取医生
export function GetDoctor(data) {
    return axios.post(`${baseUrl}default-audit/get-doctors`, data)
}

//获取药房
export function GetDrugstore(data) {
    return axios.post(`${baseUrl}default-audit/get-drugstores`, data)
}

//获取援助方式
export function GetMode(data) {
    return axios.post(`${baseUrl}default-audit/get-modes`, data)
}

//获取患者信息
export function GetPatient(data) {
    return axios.post(`${baseUrl}pap-audit/get-patient`, data)
}

//获取审核项状态
export function CheckItemStatus(data) {
    return axios.post(`${baseUrl}pap-audit/check-item-status`, data)
}

//获取审核项
export function GetCheckItem(data) {
    return axios.post(`${baseUrl}pap-audit/get-check-items`, data)
}

//上传审核项
export function UploadCheckItem(data) {
    return axios.post(`${baseUrl}pap-audit/upload-check-item`, data)
}

//上传后续审核项
export function FollowUpload(data) {
    return axios.post(`${baseUrl}pap-audit/follow-upload`, data)
}

//上传后续审核项
export function UploadRecipel(data) {
    return axios.post(`${baseUrl}patient/upload-recipel`, data)
}

//提交审核材料后更新患者状态
export function UploadPatientStatus(data) {
    return axios.post(`${baseUrl}pap-audit/update-patient-status`, data)
}

//删除审核项
export function deleteCheckItem(data) {
    return axios.post(`${baseUrl}pap-audit/delete-check-item`, data)
}

//上传图片
export function DownloadImage(data) {
    // console.log(data,'data')
    return axios.get(`${baseUrl}wechat/download-image`, data)
}

//删除图片
export function DeleteImg(data) {
    return axios.post(`${baseUrl}wechat/delete-img`, data)
}

// 查询患者申请进度
export function QueryApplyProgress(data) {
    return axios.post(`${baseUrl}pap-audit/query-apply-progress`, data)
}

//领药信息
export function GetReceiveInfo(data) {
    return axios.post(`${baseUrl}pap-audit/get-receive-info`, data)
}



//添加/更新代领药人
export function UpdateAgent(data) {
    return axios.post(`${baseUrl}pap-audit/update-agent`, data)
}

//删除代领药人
export function DeleteAgent(data) {
    return axios.post(`${baseUrl}agent/delete-agent`, data)
}

//代领药人列表
export function Agents(data) {
    return axios.post(`${baseUrl}pap-audit/agents`, data)
}

//查询快件
export function QueryExpress(data) {
    return axios.post(`${baseUrl}pap-audit/express-query`, data)
}

//进度
export function GetPredict(data) {
    return axios.post(`${baseUrl}pap/get-predict`, data)
}

//获取单页面
export function pageInfo(data) {
    return axios.get(`${baseUrl}pages`, data)
}

//获取多页面
export function articles(data) {
    return axios.get(`${baseUrl}articles`, data)
}

//获取下载列表
export function documents(data) {
    return axios.get(`${baseUrl}documents`, data)
}


//开启新阶段
export function newPhase(data) {
    return axios.post(`${baseUrl}pap-audit/new-phase`, data)
}


//发送邮箱
export function sendEmail(data) {
    return axios.post(`${baseUrl}document/send-email`, data)
}

//代领药人ocr
export function AgentIdcardOcr(data) {
    return axios.post(`${baseUrl}patient/agent-idcard-ocr`, data)
}

//查询代领药人
export function SubstituteQuery(data) {
    return axios.post(`${baseUrl}pap-audit/substitute-query`, data)
}

//代领药人申请
export function Substitute(data) {
    return axios.post(`${baseUrl}pap-audit/substitute`, data)
}

//更换代领药人
export function SetUpSubstitube(data) {
    return axios.post(`${baseUrl}pap-audit/set-up-substitute`, data)
}

//代领药人上传材料
export function SubstituteUpload(data) {
    return axios.post(`${baseUrl}pap-audit/substitute-upload`, data)
}

//删除代领药人材料
export function SubstituteAttachDelete(data) {
    return axios.post(`${baseUrl}pap-audit/substitute-attach-delete`, data)
}

//删除代领药人
export function SubstituteDel(data) {
    return axios.post(`${baseUrl}pap-audit/substitute-del`, data)
}

//快件录入
export function CreateExpress(data) {
    return axios.post(`${baseUrl}pap-audit/create-express`, data)
}