import CryptoJS from 'crypto-js';
import * as config from 'vue.config'


function getAesString(data,key,iv){//加密
    var key  = CryptoJS.enc.Utf8.parse(key);
    var iv   = CryptoJS.enc.Utf8.parse(iv);
    var encrypted =CryptoJS.AES.encrypt(data,key,
        {
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
        });
    return encrypted.toString();    //返回的是base64格式的密文
}
function getDAesString(encrypted,key,iv){//解密
    var key  = CryptoJS.enc.Utf8.parse(key);
    var iv   = CryptoJS.enc.Utf8.parse(iv);
    var decrypted =CryptoJS.AES.decrypt(encrypted,key,
        {
            iv:iv,
            mode:CryptoJS.mode.CBC,
            padding:CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);     
}

function getAES(data){ //加密
    const key  = config.CRYPTO_KEY;//'DJTggiIeOBu3blSX';  //密钥   可以修改，自定义
    const iv   = config.CRYPTO_IV; //'2oFtRtKzfnkxLB18';      //偏移量   可以修改，自定义
    const encrypted =getAesString(data,key,iv); //密文
    const encrypted1 =CryptoJS.enc.Utf8.parse(encrypted);
    return encrypted;
}

function getDAes(data){//解密
    var key  = config.CRYPTO_KEY;//'DJTggiIeOBu3blSX';  //密钥  可以修改，自定义
    var iv   = config.CRYPTO_IV;//'2oFtRtKzfnkxLB18';  //偏移量  可以修改，自定义
    var decryptedStr =getDAesString(data,key,iv);
    return decryptedStr;
}

const sign = function (v, domain, deviceId){
	const encString = v + "|" + deviceId + "|" + domain;
	console.log('string:' + encString);
	return getAES(encString);
}

// 生成指定长度的随机字符串
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // 包含大小写字母和数字的所有字符集合
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  
  return result;
}



const headers = {
	Qid: generateRandomString(16),
	v: config.VERSION,
	domainName: location.host,
	deviceId: uni.getDeviceInfo().deviceId,
	sign: sign('1.0.0', location.host, uni.getDeviceInfo().deviceId)
}
//获取区域
const getProvinces = function()
{
	console.log(headers);
	let provinces = uni.request({
		url : config.API_HOST + '/api/regions',
		header: headers,
		data:{},
		method: 'POST',
		success: function(res){
			provinces = res;
		},
	});
	
	return provinces;
}

module.exports = {
	headers,
	getProvinces
	
}

