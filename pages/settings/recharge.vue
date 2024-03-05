<template>
	<view class="content">
		<view class="header">
			<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="backPage()"></image>
			账户充值
		</view>
		<view class="recharge-box">
			<image src="/static/recharge-bg.png" mode="aspectFit" class="recharge-bg"></image>
			<view class="recharge-title1">
				充值用户：<text class="recharge-text">{{nickname}}</text>
			</view>
			<view class="recharge-countdown-box" v-if="showCountdown">
				支付剩余时间
				<view class="recharge-countdown-time" >
					{{minutes}}
				</view>
				:
				<view class="recharge-countdown-time">
					{{seconds}}
				</view>
			</view>
			<view class="recharge-countdown-box" v-if="!showCountdown">
				超时未支付，已取消
			</view>
			<view class="recharge-amount">
				{{amount}}
				<view class="recharge-amount-text">
					USDT
				</view>
			</view>
			<view class="recharge-tip">
				请扫描下方微信二维码付款
			</view>
			
			<image :src="qr_code" mode="aspectFit" class="recharge-qrcode"></image>
			<view class="recharge-addr">
				地址:{{receive_addr}}
			</view>
			<view class="recharge-price">
				1USDT={{rate}} {{currency}}
			</view>
			<view class="back" @click="confirmTrade()">
				{{btnText}}
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				'amount':0,
				'nickname': '',
				'unit': '',
				'currency': '',
				'rate': '10',
				'qr_code': '',
				'receive_addr': '',
				'protocol': '',
				'limit_time':'15',
				'minutes': 15,
				'seconds':0,
				'showCountdown': true,
				'btnText': '确认已付款'
			}
		},
		mounted(){
			this.initData();
			this.tradeInfo();
			this.countdown();
		},
		methods: {
			backPage(){
				uni.navigateBack();
			},
			confirmTrade(){
				if (this.showCountdown) {
					uni.showLoading({
						mask:true
					})
					const {trade_num} = this.$route.query;
					this.$utils.request('/api/transaction/confirm', {'trade_num':trade_num}).then((res) => {
						if (res.code == 200) {
							uni.hideLoading();
							let data = res.data;
							let msg  = '支付成功';
							this.$utils.userInfo(true);
							if (!data.status) {
								msg = '支付遇到点小问题，请联系客服';
							}
							uni.showToast({
								title: msg,
								icon: "none",
								duration:2000,
								success: (res) => {
									uni.reLaunch({
										url:'/pages/settings/settings'
									});
								}
							});
							console.log(data)
						} else {
							uni.showToast({
								title: res.message,
								icon: "none",
								duration:3000
							});
						}
					}).catch((err) => {
						uni.showToast({
							title: err,
							icon: "none",
							duration:3000
						});
					});
				} else {
					uni.reLaunch({
						url:'/pages/vip/charge-option'
					});
				}
			},
			initData(){
				uni.getStorage({
					key: 'user_info',
					success: (res) => {
						let user = res.data;
						console.log(this.nickname,user);
						if (user){
							this.nickname = user['nickname'] ? user['nickname'] : user['userName'];
							this.userName = user['userName'];
							this.dueDate  = user['dueDate'] ? user['dueDate'] : '';
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
				this.basicInfo    = this.$utils.basicInfo();
				this.unit         = this.basicInfo.currency_unit;
				this.currency     = this.basicInfo.currency;
				this.rate         = this.basicInfo.usdt_rate;
				this.qr_code      = this.basicInfo.qr_code,
				this.receive_addr = this.basicInfo.receive_addr;
				this.procotol     = this.basicInfo.protocol;
			},
			tradeInfo() {
				const {trade_num} = this.$route.query;
				let uri = '/api/transaction/info';
				let param = {
					"trade_num": trade_num,
					"login_name": this.userName
				}
				console.log(trade_num);
				this.$utils.request(uri, param).then((res) => {
					if (res.code == 200) {
						let data = res.data;
						this.amount  = data.amount;
						this.minutes = data.minutes;
						this.seconds = data.seconds;
						if (this.minutes == 0 && this.seconds == 0) {
							this.showCountdown = false;
							this.btnText = "重新支付"
						}
						console.log(this.amount, data)
					} else {
						uni.showToast({
							title: res.message,
							icon: "none",
							duration:3000
						});
					}
				}).catch((err) => {
					uni.showToast({
						title: err,
						icon: "none",
						duration:3000
					});
				});
			},
			countdown() {
				const timer = setInterval(() => {
				    if (this.seconds > 0) {
				      this.seconds--;
				    } else {
				      if (this.minutes > 0) {
				        this.minutes--;
				        this.seconds = 59;
				      } else {
				        clearInterval(timer);
				      }
				    }
				  }, 1000);
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
.recharge-addr{
	width: 610rpx;
	margin-left: 76rpx;
	margin-top: 20rpx;
	font-size: 32rpx;
	color: #333333;
	z-index: 2;
	align-self: flex-start;
	word-wrap: break-word;
}
.recharge-text{
	width: 500rpx;
	margin-left: 20rpx;
	color: #666666;
	z-index: 2;
}
.recharge-countdown-box{
	margin-top: 50rpx;
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
	margin-top: 26rpx;
}
.recharge-price{
	font-size: 30rpx;
	color: #981D0D;
	margin-top: 30rpx;
	z-index: 2;
}
</style>
