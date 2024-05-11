<template>
	<view class="content">
		<image :src="headImg" mode="aspectFill" class="setting-bg"></image>
		<view class="user-box">
			<image :src="avatar" mode="aspectFill" class="user-avatar" @click="homepage()"></image>
			<view class="user-right">
				<view class="user-name">
					{{nickname}}
				</view>
				<view class="user-term" v-if="isVIP">
					{{dueDate}}
				</view>
			</view>
		</view>
		<view class="vip-card-box">
			<image src="/static/vip-card-bg.png" mode="top center" class="vip-card-bg"></image>
			<image src="/static/icon-vip-diamond.png" mode="aspectFit" class="icon-vip-diamond"></image>
			<view class="vip-card-center" v-if="isVIP">
				<view class="vip-card-title">
					会员权益卡
				</view>
				<view class="vip-card-date">
					会员权益截至日期：{{dueDate}}
				</view>
			</view>
			<view class="vip-card-btn" @click="vipPage()" v-if="isVIP">
				续费会员
			</view>
			<view class="vip-card-btn" @click="vipPage()" v-else-if="amount > 0">
				购买会员
			</view>
			<view class="vip-card-btn" @click="rechargePage()" v-else>
				账户充值
			</view>
		</view>
		<view class="account-box">
			<view class="account-top">
				<view class="account-top-title">
					修改密码
				</view>
			</view>
			<view class="list-box">
				<view class="login-item">
					<image src="/static/icon-password.png" mode="aspectFit" class="login-icon"></image>
					<input :type="isOriginPass?'password':'text'" class="login-name" placeholder="请输入当前密码" :value="originPass" @input="originPass = $event.target.value" placeholder-class="login-name-placeholder"/>
					<image :src="isOriginPass?'/static/icon-close-eye.png':'/static/icon-open-eye.png'" mode="aspectFit" class="icon-eye" @click="originPassClick()"></image>
				</view>
				
				<view class="login-item">
					<image src="/static/icon-password.png" mode="aspectFit" class="login-icon"></image>
					<input :type="isNewPass?'password':'text'" class="login-name" placeholder="请输入新密码" :value="newPass" @input="newPass = $event.target.value" placeholder-class="login-name-placeholder"/>
					<image :src="isNewPass?'/static/icon-close-eye.png':'/static/icon-open-eye.png'" mode="aspectFit" class="icon-eye" @click="newPassClick()"></image>
				</view>
				
				<view class="login-item">
					<image src="/static/icon-password.png" mode="aspectFit" class="login-icon"></image>
					<input :type="isNewRePass?'password':'text'" class="login-name" placeholder="请重复输入新密码" :value="newRePass" @input="newRePass = $event.target.value" placeholder-class="login-name-placeholder"/>
					<image :src="isNewRePass?'/static/icon-close-eye.png':'/static/icon-open-eye.png'" mode="aspectFit" class="icon-eye" @click="newRePassClick()"></image>
				</view>
			</view>
			<view class="logout" @click="resetPass()">
				提交
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serviceShow: false,
				nickname: '新用户',
				dueDate: "",
				amount: "0",
				isVIP: false,
				headImg: "/static/data/default_head.jpg",
				avatar: "/static/data/default_avatar.jpg",
				telegram: "",
				email: "",
				app_name: "",
				isOriginPass:true,
				isNewPass:true,
				isNewRePass:true,
				newPass:'',
				newRePass:'',
				originPass:''
			}
		},
		mounted(){
			this.initPage();
		},
		computed:{
			inputPass() {
			  return this.isPassword ? 'password' : 'text';
			}
		},
		methods: {
			initPage(){
				this.$utils.basicInfo().then((res)=> {
					this.telegram = res.telegram;
					this.email    = res.email;
					this.app_name = res.app_name;
				});
				
				let user      = this.$utils.userInfo();
				if (user){
					this.nickname = user['userName'] ? user['userName'] : user['name'];
					this.dueDate  = user['dueDate'] ? user['dueDate'] : '';
					this.isVIP    = user['isVIP'] == '1' ? true : false;
					this.headImg  = user['headImg'] ? user['headImg'] : this.headImg;
					this.avatar   = user['avatar'] ? user['avatar'] : this.avatar;
					this.amount   = user['amount'] ? user['amount'] : this.amount;
				} else {
					uni.reLaunch({
						url:'/pages/account/login'
					})
				}
				
				let beforeUri = uni.getStorageSync('login_before_uri');
				if (beforeUri) {
					uni.reLaunch({
						url:beforeUri
					});
				}
				
			},
			originPassClick(){
				this.isOriginPass = !this.isOriginPass;
			},
			newPassClick(){
				this.isNewPass = !this.isNewPass;
			},
			newRePassClick(){
				this.isNewRePass = !this.isNewRePass;
			},
			//修改密码
			resetPass(){
				if (!this.originPass) {
					return uni.showToast({
						title:"当前密码不能空",
						icon: "none",
						duration:2000
					});
				}
				
				if (!this.newPass || !this.newRePass) {
					return uni.showToast({
						title:"新密码不能空",
						icon: "none",
						duration:2000
					});
				} else if (this.newPass != this.newRePass) {
					return uni.showToast({
						title:"两次输入的新密码需要保持一致",
						icon: "none",
						duration:2000
					});
				} else if(this.newPass.length < 8) {
					return uni.showToast({
						title:"密码长度不能少于8位",
						icon: "none",
						duration:2000
					});
				}
				
				uni.showLoading({
					mask:true
				})
				let uri = '/api/member/reset-pass';
				let param = {
					"email": this.email,
					"originPass": this.originPass,
					"password": this.newPass,
					"password_confirmation": this.newRePass
				};
				let rs = this.$utils.request(uri, param).then((res) => {
					console.log(res);
					uni.hideLoading();
					let iconType = 'error';
					if (res.code == 200) {
						iconType = 'success';
					} 
					console.log(iconType);
					uni.showToast({
						title: res.message,
						icon: iconType,
						duration:3000,
					}).then((res) => {
						console.log('then:'+iconType);
						if (iconType == 'success'){
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/settings/settings'
								});
							}, 3000); // 等待 3000 毫秒（duration）后执行回调函数
						}
					})
					
					
				}).catch(function(error){
					console.log(error);
				});
			},
			homepage() {
				uni.reLaunch({
					url:'/pages/settings/settings'
				});
			},
		}
	}
</script>

<style>
page{
	background-color: #f4f4f4;
}
.content{
	align-items: center;
}
.setting-bg{
	width: 750rpx;
	height: 472rpx;
	position: absolute;
	top: 0;
	left: 0;
}

.user-box{
	width: 750rpx;
	height: 130rpx;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	margin-top: 50rpx;
	z-index: 5;
}
.user-avatar{
	width: 122rpx;
	height: 122rpx;
	border: 4rpx solid #fff;
	margin-left: 36rpx;
	border-radius: 50%;
}
.user-right{
	flex: 1;
	display: flex;
	flex-flow: column nowrap;
	align-items: flex-start;
	justify-content: center;
	margin-left: 31rpx;
}
.user-name{
	font-size: 40rpx;
	font-weight: bold;
	color: #fff;
}
.user-term{
	font-size: 26rpx;
	color: rgba(255,255,255,0.8);
	margin-top: 10rpx;
}
.vip-card-box{
	width: 710rpx;
	height: 129rpx;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	position: relative;
	margin-top: 48rpx;
}
.vip-card-bg{
	width: 710rpx;
	height: 129rpx;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}
.icon-vip-diamond{
	width: 61rpx;
	height: 50rpx;
	margin-top: 32rpx;
	margin-left: 29rpx;
	z-index: 2;
}
.vip-card-center{
	flex: 1;
	display: flex;
	flex-flow: column nowrap;
	margin-left: 26rpx;
	z-index: 2;
}
.vip-card-title{
	font-size: 36rpx;
	font-weight: bold;
	color: #5C3A07;
	margin-top: 22rpx;
}
.vip-card-date{
	margin-top: 5rpx;
	font-size: 22rpx;
	color: #976A2E;
}
.vip-card-btn{
	width: 174rpx;
	height: 52rpx;
	line-height: 52rpx;
	text-align: center;
	border-radius: 26rpx;
	background: #D1A669;
	box-shadow: 0rpx 0rpx 14rpx 0rpx rgba(116,116,116,0.15);
	z-index: 2;
	font-size: 26rpx;
	color: #ffffff;
	margin-top: 29rpx;
	margin-right: 27rpx;
}
.account-box{
	width: 710rpx;
	height: 240rpx;
	margin-top:  -20rpx;
	z-index: 3;
	background-color: #fff;
	border-radius: 16rpx;
	display: flex;
	flex-flow: column nowrap;
}
.account-top{
	width: 710rpx;
	height: 92rpx;
	border-bottom: 2rpx solid #f1f1f1;
	display: flex;
	flex-flow: row nowrap;
	align-items: baseline;
}
.account-top-title{
	font-weight: bold;
	font-size: 30rpx;
	color: #333333;
	margin-left: 30rpx;
	height: 92rpx;
	line-height: 92rpx;
}

.icon-item{
	width: 155rpx;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #333333;
}
.icon-czlb{
	width: 45rpx;
	height: 43rpx;
	margin-bottom: 10rpx;
}
.icon-xfjl{
	width: 45rpx;
	height: 43rpx;
	margin-bottom: 10rpx;
}
.icon-zhcz{
	width: 45rpx;
	height: 43rpx;
	margin-bottom: 10rpx;
}
.list-box{
	width: 710rpx;
	height: 400rpx;
	display: flex;
	flex-flow: column nowrap;
	background-color: #fff;
	border-radius: 16rpx;
	box-shadow: 0rpx 2rpx 10rpx 0rpx rgba(198,198,198,0.1);
	margin-top: 24rpx;
}
.list-item{
	width: 710rpx;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: space-between;
	flex: 1;
	
}
.icon-xgmm{
	width: 34rpx;
	height: 38rpx;
	margin-left: 28rpx;
	margin-right: 24rpx;
}
.list-item-text{
	flex: 1;
	font-size: 28rpx;
	color: #333333;
}
.icon-arrow-right{
	width: 12rpx;
	height: 20rpx;
	margin-right: 24rpx;
}
.icon-ptkf{
	width: 34rpx;
	height: 38rpx;
	margin-left: 28rpx;
	margin-right: 24rpx;
}
.icon-fxwz{
	width: 34rpx;
	height: 38rpx;
	margin-left: 28rpx;
	margin-right: 24rpx;
}
.icon-gywm{
	width: 34rpx;
	height: 38rpx;
	margin-left: 28rpx;
	margin-right: 24rpx;
}
.icon-copy{
	width: 28rpx;
	height: 30rpx;
	margin-right: 24rpx;
}
.logout{
	width: 710rpx;
	height: 88rpx;
	margin-top: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0rpx 2rpx 10rpx 0rpx rgba(198,198,198,0.1);
	line-height: 88rpx;
	text-align: center;
	font-weight: bold;
	font-size: 30rpx;
	color: #991D0D;
	background-color: #fff;
	
}

.icon-close{
	position: absolute;
	bottom: -130rpx;
	left: 50%;
	width: 60rpx;
	height: 60rpx;
	margin-left:-30rpx;
	z-index: 2;
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
	margin-left: 22rpx;
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
.icon-eye{
	width: 34rpx;
	height: 26rpx;
	margin-right: 22rpx;
}
/* 
<view class="service-box">
	<view class="service-center">
		<image src="/static/service-bg.png" mode="aspectFit" class="service-bg"></image>
		<view class="service-phone">
			联系电话：18569352076
		</view>
		<view class="service-call">
			拨打电话
		</view>
		<image src="/static/icon-close.png" mode="aspectFit" class="icon-close"></image>
	</view>
</view>
 */
</style>
