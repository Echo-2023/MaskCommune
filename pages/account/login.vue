<template>
	<view class="content">
		<image src="/static/login-top-bg.png" mode="aspectFit" class="login-top-bg"></image>
		<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="back()"></image>
		<!-- <image src="/static/login-bottom-bg.png" mode="aspectFit" class="login-bottom-bg"></image> -->
		<view class="login-title">
			欢迎登录
			<view class="login-app">
				面具公社
			</view>
		</view>
		<view class="login-subtitle">
			请登录后参与互动
		</view>
		<view class="login-item">
			<image src="/static/icon-email.png" mode="aspectFit" class="login-icon"></image>
			<input type="text" class="login-name" v-model="email" placeholder="请输入登录邮箱" placeholder-class="login-name-placeholder"/>
		</view>
		<view class="login-item">
			<image src="/static/icon-password.png" mode="aspectFit" class="login-icon"></image>
			<input :type="isPassword?'password':'text'" class="login-name" placeholder="请输入密码" :value="pass" @input="pass = $event.target.value" placeholder-class="login-name-placeholder"/>
			<image :src="isPassword?'/static/icon-close-eye.png':'/static/icon-open-eye.png'" mode="aspectFit" class="icon-eye" @click="passwordClick()"></image>
		</view>
		<view class="login-item" v-if="showCaptcha">
			<image src="/static/icon-code.png" mode="aspectFit" class="login-icon"></image>
			<input type="text" class="login-code" placeholder="请输入验证码" v-model="captcha" placeholder-class="login-name-placeholder"/>
			<image :src="captchaIMG" mode="aspectFit" class="icon-code" @click="captchaClick()"></image>
		</view>
		<view class="login-tip-box">
			<view @click="regist()">
				邮箱免费注册
			</view>
			<view @click="forget()">
				忘记密码？
			</view>
		</view>
		
		
		<view class="login-btn" @click="login()">
			登录
		</view>
	</view>
</template>

<script>
	import * as config from 'config'
	export default {
		data() {
			return {
				email: "",
				pass: "",
				captcha: "",
				checked:false,
				isPassword:true,
				captchaIMG: "",
				showCaptcha: false
			}
		},
		mounted(){
			if (this.$utils.authorization()) {
				uni.reLaunch({
					url:'/pages/settings/settings'
				});
			}
			console.log(config.API_HOST);
			this.captchaIMG = config.API_HOST + "/login-captcha?devId=" + uni.getDeviceInfo().deviceId;
		},
		computed: {
			
		},
		methods: {
			back(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
			},
			login(){
				if (!this.email){
					return uni.showToast({
						title:"邮箱不能为空",
						icon: "none",
						duration:2000
					});
				} else {
					console.log(!this.$utils.validateEmail(this.email));
					if (!this.$utils.validateEmail(this.email)) {
						return uni.showToast({
							title:"邮箱格式错误",
							icon: "none",
							duration:2000
						});
					}
				}
				if (!this.pass) {
					return uni.showToast({
						title:"密码不能为空",
						icon: "none",
						duration:2000
					});
				} else if(this.pass.length < 8) {
					return uni.showToast({
						title:"密码输入有误",
						icon: "none",
						duration:2000
					});
				}
				
				if (this.email && this.pass) {
					let uri = '/api/login';
					let param = {
						"email": this.email,
						"password": this.$utils.encode(this.pass)
					};
					if (this.showCaptcha) {
						console.log(this.captcha);
						param['captcha'] = this.captcha;
					}
					let rs = this.$utils.request(uri, param).then((res) => {
						console.log(res);
						uni.hideLoading();
						if (res.code == 200) {
							uni.setStorageSync('user_info', res.data);
							let beforeUri = uni.getStorageSync('before_uri');
							console.log(beforeUri);
							if (!beforeUri) {
								beforeUri = '/';
							}
							uni.reLaunch({
								url: beforeUri
							});
						} else {
							let preg = "验证码";
							if (/^验证码/.test(res.message)) {
								this.showCaptcha = true;
							} 
							this.captchaIMG = config.API_HOST + "/login-captcha?devId=" + uni.getDeviceInfo().deviceId+"&t=" + new Date().getTime();
							uni.showToast({
								title: res.message,
								icon: "none",
								duration:5000
							});
						}
					}).catch(function(error){
						console.log(error);
					});
				}
				// uni.reLaunch({
				// 	url:'/pages/index/index'
				// })
			},
			regist(){
				uni.navigateTo({
					url:'/pages/account/regist'
				})
			},
			forget(){
				uni.navigateTo({
					url:'/pages/account/forget'
				})
			},
			passwordClick(){
				this.isPassword = !this.isPassword;
			},
			captchaClick(){
				this.captchaIMG = config.API_HOST + "/login-captcha?devId=" + uni.getDeviceInfo().deviceId+"&t=" + new Date().getTime();
			}
		}
	}
</script>

<style>
.content{
	width: 750rpx;
	height: 100vh;
	align-items: center;
}
.login-top-bg{
	width: 750rpx;
	height: 460rpx;
	position: absolute;
	top: 0;
	left: 0;
}
.icon-back{
	width: 20rpx;
	height: 33rpx;
	position: absolute;
	top: 50rpx;
	left: 36rpx;
}
.login-bottom-bg{
	width: 750rpx;
	height: 182rpx;
	position: absolute;
	left: 0;
	bottom: 0;	
}
.login-title{
	width: 710rpx;
	display: flex;
	flex-flow: row nowrap;
	margin-top: 434rpx;
	font-size: 52rpx;
	font-weight: bold;
	color: #333333;
}
.login-app{
	font-size: 52rpx;
	font-weight: bold;
	color: #991D0D;
	margin-left: 20rpx;
}
.login-subtitle{
	width: 710rpx;
	font-size: 40rpx;
	color: #333333;
	margin-top: 20rpx;
	margin-bottom: 56rpx;
}
.login-item{
	width: 710rpx;
	height: 80rpx;
	margin-bottom: 36rpx;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	border-bottom: 2rpx solid #EFF0F2;
}
.login-icon{
	width: 30rpx;
	height: 34rpx;
	margin-right: 22rpx;
}
.login-name{
	font-size: 28rpx;
	color: #333333;
	flex: 1;
}
.login-name-placeholder{
	font-size: 28rpx;
	color: #989DA6;
}
.login-tip-box{
	width: 710rpx;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	font-size: 26rpx;
	color: #989DA6;
}
.login-btn{
	width: 700rpx;
	height: 81rpx;
	background: #991D0D;
	border-radius: 41rpx;
	font-size: 32rpx;
	color: #FFFFFF;
	text-align: center;
	line-height: 81rpx;
	margin-top: 80rpx;
}
.login-agree-box{
	margin-top: 30rpx;
	width: 710rpx;
	display: flex;
	flex-flow: row nowrap;
	/*justify-content: space-between;*/
	font-size: 24rpx;
	color: #989DA6;
}
.login-agree-text{
	align-items: left;
	font-size: 24rpx;
	color: #989DA6;
	text-align: justify;
	margin-left: 10rpx;
}
.login-agree-name{
	color: ##991D0D;
}
.icon-eye{
	width: 34rpx;
	height: 26rpx;
}
.icon-code {
	width: 198rpx;
	height: 98rpx;
	margin-bottom: 20rpx;
}
</style>
