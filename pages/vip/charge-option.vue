<template>
	<view class="content">
		<image :src="headImg" mode="aspectFill" class="vip-bg"></image>
		<view class="user-box">
			<image :src="avatar" mode="aspectFill" class="user-avatar" @click="homepage()"></image>
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
				{{currency}}充值范围
			</view>
			<view class="recharge-items">
				<view class="recharge-item" :key="index" v-for="(option,index) in options" @click="selectItem(index)" :class="selectIndex==index?'recharge-selected':''" >
					<view class="recharge-item-amount">
						<view class="recharge-item-num">
							{{option.from}} - {{option.to}}
						</view>
						{{unit}}
					</view>
					
				</view>
			</view>
			<view class="vip-title">
				充值金额
			</view>
			<view class="vip-title-line"></view>
			<view class="vip-item">
				<image src="/static/icon-diamond.png" mode="aspectFit" class="icon-diamond"></image>
				<view class="vip-item-text">
					{{diamond}}
				</view>
			</view>
			<view class="vip-item">
				<image src="/static/usdt.png" mode="aspectFit" class="icon-vip-wechat"></image>
				<view class="vip-item-text">
					{{calculateAmount}}
				</view>
			</view>
			
			<view>
				1USDT等值与{{rate}}{{currency}}
			</view>
			
			<view class="recharge-btn" @click="clickRecharge()">
				立即支付
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
				basicInfo:{},
				nickname: '新用户',
				userName: '',
				dueDate: "",
				amount: "0",
				isVIP: false,
				headImg: "/static/data/default_head.jpg",
				avatar: "/static/data/default_avatar.jpg",
				selectIndex: 0,
				showSuccess:false,
				currency: '钻石',
				unit:'',
				options:[],
				diamond: 0,
				usdt: 0,
				option_id:0,
				rate: 7
			}
		},
		mounted(){
			console.log('sss');
			this.basicInfo = this.$utils.basicInfo();
			this.unit     = this.basicInfo.currency_unit;
			this.currency = this.basicInfo.currency;
			this.rate     = this.basicInfo.usdt_rate;
			this.initPage();
			this.cashInOption();
		},
		computed: {
			calculateAmount(){
				//console.log(this.options.length);
				return this.getAmount();	
			}
		},
		methods: {
			selectItem(selectIndex){
				this.selectIndex = selectIndex;
			},
			getAmount() {
				if (this.options.length) {
					let option     = this.options[this.selectIndex];
					let from       = option.from;
					let to         = option.to;
					this.option_id = option.id;
					let random     = Math.floor(Math.random() * (to - from )) + from;
					this.usdt      = Math.round( random / this.rate);
					this.diamond   = this.usdt * this.rate;
				}
				return this.usdt;
			},
			homepage() {
				uni.reLaunch({
					url:'/pages/settings/settings'
				});
			},
			clickRecharge(){
				if (this.price < this.amount) {
					this.showSuccess = !this.showSuccess;
				} else {
					uni.showModal({
							title: '充值确认',
							content: '充值'+this.usdt+'USDT,可获得'+this.diamond+this.currency,
							success: (res) => {
							if (res.confirm) {
								this.$utils.request('/api/transaction/init-pay', {
									"option_id": this.option_id,
									"login_mame": this.userName,
									"app_amount": this.diamond,
									"amount": this.usdt
								}).then((res) => {
									console.log(res);
									if (res.code == 200) {
										let data = res.data;
										uni.navigateTo({
											url:'/pages/settings/recharge?trade_num='+data.trade_num
										});
									} else {
										uni.hideLoading();
										uni.showToast({
											title: res.message,
											icon: "none",
											duration:5000
										});
									}
								}).catch(function(error){
									console.log(error);
								});
							    
							} else {
								// 执行取消后的操作
							}
						}
					})
				}
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
							this.userName = user['userName'];
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
			cashInOption(){
				uni.showLoading({});
				this.$utils.request('/api/options/cash-in', {}).then((res) => {
					if (res.code == 200) {
						this.options = res.data
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
					console.log(error);
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
	height: 280rpx;
	display: flex;
	flex-flow: row wrap;
	align-items: flex-start;
	justify-content: space-between;
	align-content: space-between;
	margin-top: 20rpx;
}
.recharge-item{
	width: 300rpx;
	/*height: 190rpx;*/
	border: 2rpx solid #981D0D;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: flex-start;
	border-radius: 20rpx;
}

.recharge-item-amount{
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	color: #555555;
	margin-top: 6rpx;
}
.recharge-item-num{
	font-size: 42rpx;
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
