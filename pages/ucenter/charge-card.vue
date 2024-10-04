<template>
	<view class="content">
		<image :src="headImg" mode="aspectFill" class="vip-bg"></image>
		<view class="header">
			<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="back()"></image>
			账户充值
		</view>
		<view class="user-box">
			<image :src="avatar" mode="aspectFill" class="user-avatar" @click="ucenter()"></image>
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
				充值卡充值
			</view>
			<view class="vip-title">
				充值卡
			</view>
			<view class="vip-title-line"></view>
			<view class="vip-item">
				<image src="/static/card.png" mode="aspectFit" class="icon-diamond"></image>
				<view class="vip-item-text">
					<input type="text" v-model="cardNum" placeholder="请输入充值卡卡号"/>
				</view>
			</view>
			<view class="vip-item">
				<image src="/static/pwd.png" mode="aspectFit" class="icon-vip-wechat"></image>
				<view class="vip-item-text">
					<input type="password" v-model="cardPwd" placeholder="请输入充值卡密码"/>
				</view>
			</view>
			
			<view class="vip-title-tips">
				充值卡购买地址
			</view>
			<template v-for="(item,index) in links">
				<view class="vip-item-tips" :key="index">
					<view class="vip-item-text-tips">
						<a :href="item.link" target="_blank">{{item.title}}</a>
					</view>
				</view>
			</template>
			<view class="recharge-btn" @click="clickRecharge()">
				确认提交
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
				uid: 0,
				selectIndex: 0,
				showSuccess:false,
				currency: '钻石',
				unit:'',
				cardNum: '',
				cardPwd: '',
				links:[]
			}
		},
		mounted(){
			this.$utils.basicInfo().then((res) => {
				this.basicInfo = res;
				this.unit      = this.basicInfo.currency_unit;
				this.currency  = this.basicInfo.currency;
				this.rate      = this.basicInfo.usdt_rate;
				
				uni.setNavigationBarTitle({
					title: '账户充值' +"-"+ this.basicInfo.app_name
				});
			});
			
			this.initPage();
		},
		methods: {
			ucenter() {
				uni.reLaunch({
					url:'/pages/settings/settings'
				});
			},
			back() {
				const pages = getCurrentPages();
				if (pages.length < 2) {
				    // 页面栈太短，直接跳转到首页或某个固定页面
				    uni.reLaunch({
				        url: '/pages/ucenter/charge-option'
				    });
				} else {
				    uni.navigateBack(); // 正常返回上一级
				}
			},
			clickRecharge(){
				console.log(this.cardNum, this.cardPwd);
				const regexCardNum = /^\d{16}$/;
				const regexCardPwd = /^[a-zA-Z0-9!@#$%^&*()_+]+$/;

				if (regexCardNum.test(this.cardNum) && regexCardPwd.test(this.cardPwd)) {
					uni.showLoading();
					let param = {
						"card_num": this.$utils.encode(this.cardNum),
						"card_pwd": this.$utils.encode(this.cardPwd),
						"uid": this.uid
					};
					console.log(param);
					this.$utils.request('/api/transaction/card-pay', param).then((res) => {
						console.log(res);
						if (res.code == 200) {
							let data = res.data;
							let msg  = data["amount"] + this.currency + "充值成功";
							uni.showModal({
								title: '充值提示',
								content: msg,
								success: (res) => {
									uni.hideLoading();
									if (res.confirm) {
										this.$utils.userInfo(true);
										uni.reLaunch({
											url:'/pages/settings/settings'
										});
									} else {
										this.cardNum = '';
										this.cardPwd = '';
									}
								}
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
					uni.showToast({
						title:"充值卡账号或密码错误",
						icon: "none",
						duration:3000
					});
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
							this.uid      = user['id'];
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
				
				this.$utils.request('/api/recharge-link', {}).then((res) => {
					console.log(res);
					if (res.code == 200) {
						this.links = res.data;	
					}
				}).catch(function(error){
					console.log(error);
				});
				
			},
		}
	}
</script>

<style>
.page{
	background-color: #f7f8fa;
}
a {
  text-decoration: none;
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
	/* margin-top: 50rpx; */
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
	height: auto;
	display: flex;
	flex-flow: row wrap;
	align-items: flex-start;
	justify-content: space-between;
	align-content: space-between;
	margin-top: 10rpx;
}
.recharge-item{
	width: 200rpx;
	/*height: 190rpx;*/
	border: 2rpx solid #981D0D;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: flex-start;
	border-radius: 20rpx;
	margin-top: 40rpx;
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
.vip-title-tips{
	font-size: 25rpx;
	color: #981D0D;
	margin-top: 50rpx;
	margin-bottom: 15rpx;
	align-items: left;
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
.vip-item-tips{
	width: 660rpx;
	height: 66rpx;
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
.vip-item-text-tips{
	padding-left: 30rpx;
	width: 550rpx;
	font-size: 24rpx;
	color: #333333;
}
.icon-diamond{
	width: 46rpx;
	height: 39rpx;
	margin-left: 20rpx;
	margin-right: 30rpx;
}
.recharge-btn{
	margin-top: 35rpx;
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
/* 
 
 
 */
</style>
