<template>
	<view class="content">
		<image src="/static/vip-bg.png" mode="aspectFit" class="vip-bg"></image>
		<view class="user-box">
			<image src="/static/data/user-cover.png" mode="aspectFill" class="user-avatar"></image>
			<view class="user-right">
				<view class="user-name">
					徐丽丽
				</view>
				<view class="user-term">
					2023-05-20到期
				</view>
			</view>
		</view>
		<view class="recharge-box">
			<view class="recharge-title">
				会员充值
			</view>
			<view class="recharge-items">
				<view class="recharge-item" @click="selectItem(0)" :class="selectIndex==0?'recharge-selected':''">
					<view class="recharge-item-name">
						包月会员
					</view>
					<view class="recharge-item-amount">
						<view class="recharge-item-num">
							20
						</view>
						钻
					</view>
					<view class="recharge-item-tip">
						包月金额
					</view>
				</view>
				<view class="recharge-item" @click="selectItem(1)" :class="selectIndex==1?'recharge-selected':''">
					<view class="recharge-item-name">
						半年会员
					</view>
					<view class="recharge-item-amount">
						<view class="recharge-item-num">
							80
						</view>
						钻
					</view>
					<view class="recharge-item-tip">
						包月金额
					</view>
				</view>
				<view class="recharge-item" @click="selectItem(2)" :class="selectIndex==2?'recharge-selected':''">
					<view class="recharge-item-name">
						包年会员
					</view>
					<view class="recharge-item-amount">
						<view class="recharge-item-num">
							150
						</view>
						钻
					</view>
					<view class="recharge-item-tip">
						包月金额
					</view>
				</view>
				<view class="recharge-item" @click="selectItem(3)" :class="selectIndex==3?'recharge-selected':''">
					<view class="recharge-item-name">
						包月会员
					</view>
					<view class="recharge-item-amount">
						<view class="recharge-item-num">
							20
						</view>
						钻
					</view>
					<view class="recharge-item-tip">
						包月金额
					</view>
				</view>
				<view class="recharge-item" @click="selectItem(4)" :class="selectIndex==4?'recharge-selected':''">
					<view class="recharge-item-name">
						包月会员
					</view>
					<view class="recharge-item-amount">
						<view class="recharge-item-num">
							20
						</view>
						钻
					</view>
					<view class="recharge-item-tip">
						包月金额
					</view>
				</view>
				<view class="recharge-item" @click="selectItem(5)" :class="selectIndex==5?'recharge-selected':''">
					<view class="recharge-item-name">
						包月会员
					</view>
					<view class="recharge-item-amount">
						<view class="recharge-item-num">
							20
						</view>
						钻
					</view>
					<view class="recharge-item-tip">
						包月金额
					</view>
				</view>
			</view>
			<view class="vip-title">
				VIP会员 享特权
			</view>
			<view class="vip-title-line">
				
			</view>
			<view class="vip-item">
				<image src="/static/icon-vip-wechat.png" mode="aspectFit" class="icon-vip-wechat"></image>
				<view class="vip-item-text">
					加微信[每天可以免费查看10个]
				</view>
			</view>
			<view class="vip-item">
				<image src="/static/icon-diamond.png" mode="aspectFit" class="icon-diamond"></image>
				<view class="vip-item-text">
					需要支付钻石，支付过的会员，第二次查看不消耗免费次数，也不需要再次付费查看
				</view>
			</view>
			<view class="recharge-btn" @click="clickRecharge()">
				立即开通（需支付150钻 剩余800钻)
			</view>
		</view>
		<view class="recharge-success-box" v-if="showSuccess">
			<view class="recharge-success">
				<image src="/static/recharge-success-bg.png" mode="aspectFit" class="recharge-success-bg"></image>
				<view class="recharge-type">
					半年会员
				</view>
				<view class="recharge-tip">
					恭喜您升级为
				</view>
				<view class="recharge-type-title">
					半年会员
				</view>
				<view class="recharge-success-btn" @click="indexPage()">
					返回首页
				</view>
				<image src="/static/icon-close.png" mode="aspectFit" class="icon-close" @click="clickRecharge()"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectIndex:'',
				showSuccess:false,
			}
		},
		methods: {
			selectItem(selectIndex){
				this.selectIndex = selectIndex;
			},
			clickRecharge(){
				this.showSuccess = !this.showSuccess;
			},
			indexPage(){
				this.clickRecharge();
				uni.switchTab({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #f7f8fa;
}
.content{
	align-items: center;
}
.vip-bg{
	width: 750rpx;
	height: 559rpx;
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
.recharge-box{
	width: 710rpx;
	height: 1100rpx;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	border-radius: 30rpx;
	background-color: #fff;
	margin-top: 52rpx;
	z-index: 10;
	margin-bottom: 25rpx;
}
.recharge-title{
	width: 660rpx;
	margin-top: 30rpx;
	font-size: 36rpx;
	font-weight: bold;
	color: #191919;
}
.recharge-items{
	width: 660rpx;
	height: 420rpx;
	display: flex;
	flex-flow: row wrap;
	align-items: flex-start;
	justify-content: space-between;
	align-content: space-between;
	margin-top: 20rpx;
}
.recharge-item{
	width: 196rpx;
	height: 190rpx;
	border: 2rpx solid #981D0D;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: flex-start;
	border-radius: 20rpx;
}
.recharge-item-name{
	font-size: 26rpx;
	color: #727272;
	margin-top: 24rpx;
}
.recharge-item-amount{
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	color: #555555;
	margin-top: 16rpx;
}
.recharge-item-num{
	font-size: 42rpx;
}
.recharge-item-tip{
	font-size: 24rpx;
	color: #b4b4b4;
	margin-top: 6rpx;
}
.recharge-selected{
	background-color: #981D0D;
}
.recharge-selected >*{
	color: #ffffff !important;
}
.vip-title{
	font-size: 35rpx;
	color: #981D0D;
	margin-top: 50rpx;
	margin-bottom: 6rpx;
}
.vip-title-line{
	width: 39rpx;
	height: 7rpx;
	background-color: #981D0D;
	border-radius: 4rpx;
	margin-bottom: 30rpx;
}
.vip-item{
	width: 660rpx;
	height: 114rpx;
	background-color: #f7f7f7;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	margin-bottom: 18rpx;
}
.icon-vip-wechat{
	width: 46rpx;
	height: 38rpx;
	margin-left: 20rpx;
	margin-right: 30rpx;
}
.vip-item-text{
	width: 550rpx;
	font-size: 28rpx;
	color: #333333;
}

.icon-diamond{
	width: 46rpx;
	height: 39rpx;
	margin-left: 20rpx;
	margin-right: 30rpx;
}
.recharge-btn{
	margin-top: 67rpx;
	width: 658rpx;
	height: 81rpx;
	background: #991D0D;
	border-radius: 41rpx;
	font-size: 28rpx;
	color: #ffffff;
	line-height: 81rpx;
	text-align: center;
}
.recharge-success-box{
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: center;
	background-color: rgba(0,0,0,0.8);
	z-index: 1000;
	overflow: visible;
}
.recharge-success{
	width: 579rpx;
	height: 700rpx;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: flex-start;
	position: relative;
	background-color: #fff;
	border-radius: 30rpx;
}
.recharge-success-bg{
	position: absolute;
	left: 0;
	bottom: 397rpx;
	width: 579rpx;
	height: 408rpx;
	z-index: 1;
}
.icon-close{
	width: 77rpx;
	height: 77rpx;
	position: absolute;
	left: 50%;
	margin-left: -39rpx;
	bottom: -137rpx;
}
.recharge-type{
	color: #FEFBFB;
	font-size: 42rpx;
	font-weight: bold;
	margin-top: 190rpx;
	z-index: 2;
}
.recharge-tip{
	color: #999999;
	font-size: 38rpx;
	font-weight: bold;
	margin-top: 100rpx;
}
.recharge-type-title{
	font-weight: bold;
	font-size: 60rpx;
	color: #981D0D;
	margin-top: 20rpx;
}
.recharge-success-btn{
	width: 428rpx;
	height: 82rpx;
	line-height: 82rpx;
	text-align: center;
	color: #FEFBFB;
	font-weight: bold;
	font-size: 38rpx;
	z-index: 2;
	background-color: #981D0D;
	border-radius: 41rpx;
	margin-top: 70rpx;
}

/* 
 <view class="recharge-success-box">
 	<view class="recharge-success">
 		<image src="/static/recharge-success-bg.png" mode="aspectFit" class="recharge-success-bg"></image>
 		<view class="recharge-type">
 			半年会员
 		</view>
 		<view class="recharge-tip">
 			恭喜您升级为
 		</view>
 		<view class="recharge-type-title">
 			半年会员
 		</view>
 		<view class="recharge-success-btn">
 			返回首页
 		</view>
		<image src="/static/icon-close.png" mode="aspectFit" class="icon-close"></image>
 	</view>
 </view>
 
 */
</style>
