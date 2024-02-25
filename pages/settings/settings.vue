<template>
	<view class="content">
		<image :src="headImg" mode="aspectFill" class="setting-bg"></image>
		<view class="user-box">
			<image :src="avatar" mode="aspectFill" class="user-avatar"></image>
			<view class="user-right">
				<view class="user-name">
					{{nickname}}
				</view>
				<view class="user-term" v-if="isVIP">
					{{dueDate}}到期
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
					账户充值
				</view>
				<view class="account-balance-text">
					余额:<text class="account-balance">{{amount}}</text>钻
				</view>
			</view>
			<view class="account-bottom">
				<view class="icon-item">
					<image src="/static/icon-czlb.png" mode="aspectFit" class="icon-czlb"></image>
					充值列表
				</view>
				<view class="icon-item" @click="expendListPage()">
					<image src="/static/icon-xfjl.png" mode="aspectFit" class="icon-xfjl"></image>
					消费记录
				</view>
				<view class="icon-item" @click="rechargePage()">
					<image src="/static/icon-zhcz.png" mode="aspectFit" class="icon-zhcz"></image>
					账户充值
				</view>
			</view>
		</view>
		<view class="list-box">
			<view class="list-item">
				<image src="/static/icon-xgmm.png" mode="aspectFit" class="icon-xgmm"></image>
				<view class="list-item-text">
					修改密码
				</view>
				<image src="/static/icon-arrow-right.png" mode="aspectFit" class="icon-arrow-right"></image>
			</view>
			<view class="list-item" @click="serviceClick()">
				<image src="/static/icon-ptkf.png" mode="aspectFit" class="icon-ptkf"></image>
				<view class="list-item-text">
					平台客服
				</view>
				<image src="/static/icon-arrow-right.png" mode="aspectFit" class="icon-arrow-right"></image>
			</view>
			<view class="list-item" @click="shareClick()">
				<image src="/static/icon-fxwz.png" mode="aspectFit" class="icon-fxwz"></image>
				<view class="list-item-text">
					分享网址
				</view>
				<image src="/static/icon-copy.png" mode="aspectFit" class="icon-copy"></image>
			</view>
			<view class="list-item">
				<image src="/static/icon-gywm.png" mode="aspectFit" class="icon-gywm"></image>
				<view class="list-item-text" @click="aboutUS()">
					关于我们
				</view>
				<image src="/static/icon-arrow-right.png" mode="aspectFit" class="icon-arrow-right"></image>
			</view>
		</view>
		<view class="logout" @click="logout()">
			退出登录
		</view>
		<view class="service-box" v-if="serviceShow">
			<view class="service-center">
				<image src="/static/service-bg.png" mode="aspectFit" class="service-bg"></image>
				<view class="service-phone">
					联系电话：18569352076
				</view>
				<view class="service-call" @click="call()">
					拨打电话
				</view>
				<image src="/static/icon-close.png" mode="aspectFit" class="icon-close" @click="serviceClick()"></image>
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
				avatar: "/static/data/default_avatar.jpg"
			}
		},
		mounted(){
			this.initPage();
		},
		methods: {
			initPage(){
				uni.getStorage({
					key: 'user_info',
					success: (res) => {
						let user = res.data;
						console.log(this.nickname,user);
						if (user){
							this.nickname = user['nickname'] ? user['nickname'] : user['userName'];
							this.dueDate  = user['dueDate'] ? user['dueDate'] : '';
							this.isVip    = user['isVIP'] == '1' ? true : false;
							this.headImg  = user['headImg'] ? user['headImg'] : this.headImg;
							this.avatar   = user['avatar'] ? user['avatar'] : this.avatar;
							console.log(this.nickname)
						} else {
							uni.reLaunch({
								url:'/pages/account/login'
							})
						}
					},
					fail: (res) => {
						uni.reLaunch({
							url:'/pages/account/login'
						})
					}
				});
			},
			vipPage(){
				uni.switchTab({
					url:'/pages/vip/vip'
				})
			},
			rechargePage(){
				uni.navigateTo({
					url:'/pages/vip/charge-option'
				})
			},
			serviceClick(){
				this.serviceShow = !this.serviceShow;
			},
			call(){
				uni.makePhoneCall({
					phoneNumber: '18569352076' //仅为示例
				});
			},
			shareClick(){
				uni.setClipboardData({
					data: window.location.href,
					success: ()=> {
						uni.showToast({
							title:'网址已复制，请发送给您的朋友',
							mask:true,
							icon:'none'
						})
					}
				});
			},
			aboutUS() {
				uni.showModal({
					title: '温馨提醒',
					content: '关于我们的信息，正在赶来的路上，请耐心等候'
				})
			},
			expendListPage(){
				uni.navigateTo({
					url:'/pages/settings/expendList'
				})
			},
			logout(){
				uni.clearStorageSync();
				uni.reLaunch({
					url:'/pages/account/login'
				})
			}
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
.account-balance-text{
	flex: 1;
	margin-left: 27rpx;
	font-size: 28rpx;
	color: #989DA6;
	display: flex;
	flex-flow: row nowrap;
	align-items: baseline;
}
.account-balance{
	font-size: 30rpx;
	color: #991D0D;
	margin-left: 11rpx;
	margin-right: 6rpx;
}
.account-bottom{
	flex: 1;
	width: 710rpx;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: space-between;
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
.service-box{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0,0,0,0.8);
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}
.service-center{
	width: 640rpx;
	height: 640rpx;
	position: relative;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: flex-end;
}
.service-bg{
	position: absolute;
	left: 0;
	bottom: 0;
	width: 640rpx;
	height: 691rpx;
	z-index: 1;
}
.service-phone{
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
	z-index: 2;
	margin-bottom: 30rpx;
}
.service-call{
	width: 570rpx;
	height: 88rpx;
	background: #981D0D;
	border-radius: 44rpx;
	line-height: 88rpx;
	text-align: center;
	font-size: 32rpx;
	color: #ffffff;
	z-index: 2;
	margin-bottom: 41rpx;
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
