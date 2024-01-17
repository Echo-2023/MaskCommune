<template>
	<view class="content">
		<view class="header">
			<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="backPage()"></image>
			账户充值
		</view>
		<view class="recharge-box">
			<image src="/static/recharge-bg.png" mode="aspectFit" class="recharge-bg"></image>
			<view class="recharge-title1">
				充值用户：<text class="recharge-text">徐莉莉</text>
			</view>
			<view class="recharge-title2">
				充值方式：<text class="recharge-text">微信支付</text>
			</view>
			<view class="recharge-countdown-box">
				支付剩余时间
				<view class="recharge-countdown-time">
					07
				</view>
				:
				<view class="recharge-countdown-time">
					36
				</view>
			</view>
			<view class="recharge-amount">
				590
				<view class="recharge-amount-text">
					钻
				</view>
			</view>
			<view class="recharge-tip">
				请扫描下方微信二维码付款
			</view>
			<image src="/static/data/recharge-qrcode.png" mode="aspectFit" class="recharge-qrcode"></image>
			<view class="back" @click="indexPage()">
				返回首页
			</view>
			<view class="recharge-price">
				1人民币=1钻石
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			backPage(){
				uni.navigateBack();
			},
			indexPage(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
			}
		}
	}
</script>

<style>
.content{
	align-items: center;
	height: 100vh;
	width: 750rpx;
	background: linear-gradient(51deg, #AA200B 0%, #C61700 26%, #BE1C07 56.00000000000001%, #B51500 79%, #991D0D 100%);
}
.header{
	height: 33rpx;
	width: 750rpx;
	line-height: 33rpx;
	text-align: center;
	position: relative;
	margin-top: 40rpx;
	font-size: 32rpx;
	font-weight: bold;
	color: #fff;
	z-index: 2;
	margin-bottom: 64rpx;
}
.icon-back{
	width: 20rpx;
	height: 33rpx;
	position: absolute;
	top: 0;
	left: 36rpx;
}
.recharge-box{
	width: 726rpx;
	height: 1172rpx;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	position: relative;
}
.recharge-bg{
	width: 726rpx;
	height: 1172rpx;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}
.recharge-title1{
	margin-left: 76rpx;
	margin-top: 54rpx;
	font-size: 32rpx;
	color: #333333;
	z-index: 2;
	align-self: flex-start;
}
.recharge-title2{
	margin-left: 76rpx;
	margin-top: 20rpx;
	font-size: 32rpx;
	color: #333333;
	z-index: 2;
	align-self: flex-start;
}
.recharge-text{
	margin-left: 20rpx;
	color: #666666;
	z-index: 2;
}
.recharge-countdown-box{
	margin-top: 100rpx;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	font-size: 32rpx;
	color: #333333;
	z-index: 2;
}
.recharge-countdown-time{
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 4rpx;
	font-size: 32rpx;
	z-index: 2;
	background-color: #EFEFEF;
	margin-left: 8rpx;
	margin-right: 8rpx;
	border-radius: 4rpx;
}
.recharge-amount{
	font-size: 80rpx;
	color: #981D0D;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	z-index: 2;
	margin-top: 40rpx;
}
.recharge-amount-text{
	font-size: 64rpx;
	font-weight: bold;
	color: #981D0D;
	margin-left: 10rpx;
}
.recharge-tip{
	font-size: 28rpx;
	color: #989DA6;
	margin-top: 30rpx;
	z-index: 2;
}
.recharge-qrcode{
	width: 344rpx;
	height: 344rpx;
	margin-top: 30rpx;
	z-index: 2;
}
.back{
	width: 433rpx;
	height: 73rpx;
	line-height: 73rpx;
	background: #981D0D;
	border-radius: 37rpx;
	z-index: 2;
	text-align: center;
	justify-content: center;
	font-size: 32rpx;
	font-weight: bold;
	color: #FFFFFF;
	text-shadow: 0rpx 0rpx 24rpx rgba(179,0,10,0.7);
	margin-top: 53rpx;
}
.recharge-price{
	font-size: 30rpx;
	color: #981D0D;
	margin-top: 30rpx;
	z-index: 2;
}
/* 
 
 <view class="recharge-box">
 	<image src="/static/recharge-bg.png" mode="aspectFit" class="recharge-bg"></image>
 	<view class="recharge-title1">
 		充值用户：<text class="recharge-text">徐莉莉</text>
 	</view>
 	<view class="recharge-title2">
 		充值方式：<text class="recharge-text">微信支付</text>
 	</view>
 	<view class="recharge-countdown-box">
 		支付剩余时间
 		<view class="recharge-countdown-time">
 			07
 		</view>
 		:
 		<view class="recharge-countdown-time">
 			36
 		</view>
 	</view>
 	<view class="recharge-amount">
 		590
 		<view class="recharge-amount-text">
 			钻
 		</view>
 	</view>
 	<view class="recharge-tip">
 		请扫描下方微信二维码付款
 	</view>
 	<image src="/static/data/recharge-qrcode.png" mode="aspectFit" class="recharge-qrcode"></image>
 	<view class="back">
 		返回
 	</view>
 	<view class="recharge-price">
 		1人民币=1钻石
 	</view>
 </view>
 
 */
</style>
