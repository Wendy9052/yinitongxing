// 计算api接口的基本地址
let hostname = location.hostname;
hostname = hostname.substring(hostname.indexOf('.'));
let appHost = `${location.protocol}//api${hostname}`;
export default `${appHost}/yntx/`;
