<template>
	<view class="content">
		<image src="/static/login-top-bg.png" mode="aspectFit" class="login-top-bg"></image>
		<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="back()"></image>
<!-- 		<image src="/static/login-bottom-bg.png" mode="aspectFit" class="login-bottom-bg"></image> -->
		<view class="login-title">
			欢迎注册
			<view class="login-app">
				面具公社
			</view>
		</view>
		<view class="login-subtitle">
			使用邮箱免费注册
		</view>
		<view class="login-item">
			<image src="/static/icon-email.png" mode="aspectFit" class="login-icon"></image>
			<input type="text" v-model="email" class="login-name" placeholder="请输入登录邮箱" placeholder-class="login-name-placeholder"/>
		</view>
		
		<view class="login-item">
			<image src="/static/icon-code.png" mode="aspectFit" class="login-icon"></image>
			<input type="text" v-model="verifyCode" class="login-name" placeholder="请输入验证码" placeholder-class="login-name-placeholder"/>
			<text class="send-code" :class="count == 120 ?'':'send-disabled'" @click="sendCode()">{{sendText}}</text>
		</view>
		
		<view class="login-item">
			<image src="/static/icon-password.png" mode="aspectFit" class="login-icon"></image>
			<input :type="isPassword?'password':'text'" :value="pass" @input="pass = $event.target.value" class="login-name" placeholder="请输入登录密码" placeholder-class="login-name-placeholder"/>
			<image :src="isPassword?'/static/icon-close-eye.png':'/static/icon-open-eye.png'" mode="aspectFit" class="icon-eye" @click="passwordClick()"></image>
		</view>
		<view class="login-item">
			<image src="/static/icon-password.png" mode="aspectFit" class="login-icon"></image>
			<input :type="isPassword2?'password':'text'" :value="pass2" @input="pass2 = $event.target.value" class="login-name" placeholder="请确认登录密码" placeholder-class="login-name-placeholder"/>
			<image :src="isPassword2?'/static/icon-close-eye.png':'/static/icon-open-eye.png'" mode="aspectFit" class="icon-eye" @click="password2Click()"></image>
		</view>
		<view class="login-tip-box">
			<view @click="login()">
				使用已注册账号登录
			</view>
			<view @click="forget()">
				忘记密码？
			</view>
		</view>
		<view class="login-agree-box">
			<checkbox value="agree" class="login-check-box" color="#991D0D" style="transform:scale(0.7)" :checked="checked" />
			<view class="login-agree-text">
				注册前请仔细阅读<text class="login-agree-name">《服务与隐私条款（面具公社) 》</text>
			</view>
		</view> 
		<view class="login-btn" @click="regist()">
			注册
		</view>
		<!-- <view class="login-agree-box">
			<checkbox value="agree" class="login-check-box" color="#991D0D" style="transform:scale(0.7)" :checked="checked" />
			<view class="login-agree-text">
				注册/登录即同意<text class="login-agree-name">《服务与隐私条款（面具公社) 》</text>,首次登录将自动注册
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked:true,
				count:120,
				isPassword:true,
				isPassword2:true,
				email:'',
				verifyCode:'',
				pass:'',
				pass2:'',
				
			}
		},
		mounted() {
			if (this.$utils.authorization()) {
				uni.reLaunch({
					url:'/pages/settings/settings'
				});
			}
			this.$nextTick(() => {
				this.$forceUpdate();
			})
		},
		computed:{
			sendText(){
				return this.count == 120 ? '获取验证码':(this.count+'秒后重新发送')
			},
			inputPass() {
			  return this.isPassword ? 'password' : 'text';
			}
		},
		methods: {
			back(){
				uni.navigateBack();
			},
			login(){
				uni.reLaunch({
					url:'/pages/account/login'
				})
			},
			regist(){
				if (!this.email){
					return uni.showToast({
						title:"邮箱不能为空",
						icon: "error",
						duration:2000
					});
				} else {
					console.log(!this.$utils.validateEmail(this.email));
					if (!this.$utils.validateEmail(this.email)) {
						return uni.showToast({
							title:"邮箱格式错误",
							icon: "error",
							duration:2000
						});
					}
				}
				
				if (!this.verifyCode) {
					return uni.showToast({
						title:"验证码不能为空，请到输入的邮箱中查看",
						icon: "error",
						duration:2000
					});
				}
				
				if (!this.pass || !this.pass2) {
					return uni.showToast({
						title:"登录密码不能空",
						icon: "error",
						duration:2000
					});
				} else if (this.pass != this.pass2) {
					return uni.showToast({
						title:"两次输入的密码需要保持一致",
						icon: "error",
						duration:2000
					});
				} else if(this.pass.length < 8) {
					return uni.showToast({
						title:"密码长度不能少于8位",
						icon: "error",
						duration:2000
					});
				}
				
				if (!this.checked) {
					return uni.showToast({
						title:"请勾选服务与隐私条款",
						icon: "error",
						duration:2000
					});
				}
				
				uni.showLoading({
					mask:true
				})
				let uri = '/api/register';
				let param = {
					"email": this.email,
					"verifyCode": this.verifyCode,
					"password": this.pass,
					"password_confirmation": this.pass2
				};
				let rs = this.$utils.request(uri, param).then((res) => {
					console.log(res);
					uni.hideLoading();
					if (res.code == 200) {
						uni.setStorageSync('user_info', res.data);
						uni.switchTab({
							url:'/pages/settings/settings'
						});
					} else {
						uni.showToast({
							title: res.message,
							icon: "none",
							duration:5000
						});
					}
				}).catch(function(error){
					console.log(error);
				});
			},
			forget(){
				uni.navigateTo({
					url:'/pages/account/forget'
				})
			},
			sendCode(){
				if(this.count != 120){
					return;
				}
				uni.showLoading({
					mask:true
				})
				let uri = '/api/verification/code';
				let param = {
					"email": this.email
				};
				let rs = this.$utils.request(uri, param).then((res) => {
					if (res.code != 200) {
						uni.showToast({
							title: res.message,
							icon: "none",
							duration:2000
						})
					} else {
						let index = setInterval(()=>{
							if(this.count == 120){
								uni.hideLoading()
							}
							this.count--;
							if(this.count<1){
								this.count = 120;
								clearInterval(index)
							}
						},1000);
					}
				}).catch(function(error){
					console.log(error);
				});
			},
			passwordClick(){
				this.isPassword = !this.isPassword;
			},
			password2Click(){
				this.isPassword2 = !this.isPassword2;
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
	flex: 1;
	color: #333333;
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
.send-disabled{
	color: #989DA6 !important;
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
	/* justify-content: space-between; */
	font-size: 24rpx;
	color: #989DA6;
}
.login-agree-text{
	font-size: 24rpx;
	color: #989DA6;
	text-align: justify;
	margin-left: 10rpx;
}
.login-agree-name{
	color: ##991D0D;
}
.send-code{
	font-size: 28rpx;
	color: #991D0D;
}
.icon-eye{
	width: 34rpx;
	height: 26rpx;
}
</style>
