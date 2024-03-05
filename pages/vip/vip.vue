<template>
	<view class="content">
		<image :src="headImg" mode="aspectFill" class="vip-bg"></image>
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
		<view class="recharge-box">
			<view class="recharge-title">
				购买会员
			</view>
			<view class="recharge-items">
				<view class="recharge-item" :key="index" v-for="(vip,index) in vips" @click="selectItem(index)" :class="selectIndex==index?'recharge-selected':''" >
					<view class="recharge-item-name">
						{{vip.title}}
					</view>
					<view class="recharge-item-amount">
						<view class="recharge-item-num">
							{{vip.price}}
						</view>
						{{unit}}
					</view>
					<view class="recharge-item-tip">
						{{vip.sub_title}}
					</view>
				</view>
			</view>
			<view class="vip-title">
				VIP会员 享特权
			</view>
			<view class="vip-title-line"></view>
			<view class="vip-item">
				<image src="/static/icon-vip-wechat.png" mode="aspectFit" class="icon-vip-wechat"></image>
				<view class="vip-item-text">
					{{wechatRight}}
				</view>
			</view>
			<view class="vip-item">
				<image src="/static/icon-diamond.png" mode="aspectFit" class="icon-diamond"></image>
				<view class="vip-item-text">
					{{diamondRight}}
				</view>
			</view>
			<view class="recharge-btn" @click="clickRecharge()">
				立即开通（需支付{{price}}{{unit}} 剩余{{amount}}钻)
			</view>
		</view>
		<view class="recharge-success-box" v-if="showSuccess">
			<view class="recharge-success">
				<image src="/static/recharge-success-bg.png" mode="aspectFit" class="recharge-success-bg"></image>
				<view class="recharge-type">
					{{vipTitle}}
				</view>
				<view class="recharge-tip">
					恭喜您升级为
				</view>
				<view class="recharge-type-title">
					{{vipTitle}}
				</view>
				<view class="recharge-success-btn" @click="indexPage()">
					返回首页
				</view>
				<image src="/static/icon-close.png" mode="aspectFit" class="icon-close" @click="closePop()"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				basic:{},
				nickname: '新用户',
				dueDate: "",
				amount: "0",
				isVIP: false,
				headImg: "/static/data/default_head.jpg",
				avatar: "/static/data/default_avatar.jpg",
				selectIndex: 0,
				showSuccess:false,
				unit:'',
				vips:[],
				diamondRight: '',
				price: 0,
				vipTitle: '',
				vipId:0,
				appAmount: 0,
			}
		},
		mounted(){
			this.basicInfo = this.$utils.basicInfo();
			console.log(this.basicInfo);
			this.unit = this.basicInfo.currency_unit;
			this.initPage();
			this.loadVIPInfo();
		},
		computed: {
			wechatRight(){
				if (this.vips.length && this.selectIndex < this.vips.length) {
					this.price        = this.vips[this.selectIndex].price;
					this.diamondRight = this.vips[this.selectIndex].diamond_right;
					this.vipTitle     = this.vips[this.selectIndex].title;
					this.vipId        = this.vips[this.selectIndex].id;
					return this.vips[this.selectIndex].wechat_right;
				} 
				return '';	
			}
		},
		methods: {
			selectItem(selectIndex){
				this.selectIndex = selectIndex;
			},
			clickRecharge(){
				//console.log(this.price, this.appAmount)
				uni.showLoading();
				if (parseInt(this.price) <= parseInt(this.appAmount)) {
					let uri = "/api/member/purchasing-vip";
					let data = {'vipId': this.vipId};
					this.$utils.request(uri, data).then((res) => {
						if (res.code == 200 && res.data.result == 'successful') {
							
							uni.hideLoading();
							this.showSuccess = !this.showSuccess;
						} else {
							uni.hideLoading();
							uni.showToast({
								title: res.message,
								icon: "none",
								duration:5000
							});
						}
						this.$utils.userInfo(true);
						this.initPage();
					}).catch((err) => {
						console.log(err.message);
					});
					
				} else {
					uni.hideLoading();
					uni.showModal({
							title: '提示',
							content: '您的余额不足,请先充值？',
							success: function(res) {
							if (res.confirm) {
							    uni.navigateTo({
							    	url:'/pages/vip/charge-option'
							    });
							} else {
								// 执行取消后的操作
							}
						}
					})
				}
			},
			closePop(){
				this.showSuccess = !this.showSuccess;
			},
			indexPage(){
				this.clickRecharge();
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
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
							this.appAmount= user['amount'] ? user['amount'] : this.appAmount;
							
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
			loadVIPInfo(){
				uni.showLoading({});
				this.$utils.request('/api/content/vip-list', {}).then((res) => {
					if (res.code == 200) {
						this.vips = res.data
						uni.hideLoading();
					} else {
						uni.hideLoading();
						uni.showToast({
							title: res.message,
							icon: "none",
							duration:5000
						});
					}
				}).catch(function(error){
					console.log(error.message);
				});
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
