import CryptoJS from 'crypto-js';
import * as config from 'config'


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

function encode(data){ //加密
    const key  = config.CRYPTO_KEY;//'DJTggiIeOBu3blSX';  //密钥   可以修改，自定义
    const iv   = config.CRYPTO_IV; //'2oFtRtKzfnkxLB18';      //偏移量   可以修改，自定义
    const encrypted =getAesString(data,key,iv); //密文
    const encrypted1 =CryptoJS.enc.Utf8.parse(encrypted);
    return encrypted;
}

function decode(data){//解密
    var key  = config.CRYPTO_KEY;//'DJTggiIeOBu3blSX';  //密钥  可以修改，自定义
    var iv   = config.CRYPTO_IV;//'2oFtRtKzfnkxLB18';  //偏移量  可以修改，自定义
    var decryptedStr =getDAesString(data,key,iv);
    return decryptedStr;
}

const sign = function (v, domain, deviceId){
	const encString = v + "|" + deviceId + "|" + domain;
	//console.log('string:' + encString);
	return encode(encString);
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

const authorization = function ()
{
	 const info = uni.getStorageSync('user_info');
	 console.log(info);
	 return info ? info.token : '';
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const headers = {
	Qid: generateRandomString(16),
	v: config.VERSION,
	domainName: location.host,
	deviceId: uni.getDeviceInfo().deviceId,
	sign: sign('1.0.0', location.host, uni.getDeviceInfo().deviceId)
}


const request = function(uri, param)
{
	//console.log(headers);
	uni.getStorage({
		key: 'user_info',
		success: (res) => {
			let user = res.data;
			if (user){
				let token = user['token'] ? user['token'] : '';
				if (token) {
					headers.Authorization = "Bearer " + token;
				}
			} 
		}
	});
	
	return new Promise((resolve, reject) => {
		uni.request({
			url : config.API_HOST + uri,
			header: headers,
			data:param,
			method: 'POST',
			success: (res)=>{
				resolve(res.data);
			},
			fail: function(err) {
				reject(err.message); // 将异步请求的错误传递给Promise对象
			}
		});
	});
}

async function basicInfo(){
	let info = uni.getStorageSync('basic_info');
	console.log('basic_info:', info);
	if (!info) {
		await this.request('/api/app/basic', {}).then((res) => {
			if (res.code == 200) {
				info = res.data;
				uni.setStorageSync('basic_info', res.data);
			} 
		}).catch(function(error){
			console.log(error.message);
		});
	}
	return info;
}

function userInfo(reload=false){
	let info = uni.getStorageSync('user_info');
	if (!info || reload) {
		this.request('/api/member/info', {}).then((res) => {
			info = res.data;
			if (res.code == 200) {
				uni.clearStorageSync('user_info');
				uni.setStorageSync('user_info', info);
			} 
		}).catch(function(error){
			console.log(error.message);
		});
	}
	return info;
}

module.exports = {
	headers,
	request,
	authorization,
	validateEmail,
	encode,
	decode,
	basicInfo,
	userInfo
}

