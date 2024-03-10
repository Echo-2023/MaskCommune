<template>
	<view class="content">
		<image :src="headImg"  mode="aspectFill" class="expend-bg"></image>
		<view class="header">
			<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="backPage()"></image>
			消费记录
		</view>
		<view class="balance-tip">
			余额({{unit}}）
		</view>
		<view class="balance-total">
			{{appAmount}}
			<text class="balance-total-tip">{{unit}}</text>
		</view>
		<view class="balance-tip">
			累计消费金额: {{totalAppAmount}} {{unit}}
		</view>
		<view class="expand-list-box">
			<template v-for="(item,index) in logs">
				<view class="bottom-line" v-if="index>0"></view>
				<view class="expand-item">
					<view class="icon-expand-box">
						<image src="/static/icon-expand.png" mode="aspectFit" class="icon-expand"></image>
					</view>
					<view class="expand-center">
						<view class="expand-name">
							{{item.desc}}
						</view>
						<view class="expand-time">
							{{item.created_at}}
						</view>
					</view>
					<view class="expand-right">
						<view class="expand-amount">
							-{{item.app_amount}}{{unit}}
						</view>
						<view class="expand-status">
							{{item.status_info}}
						</view>
					</view>
				</view>
			</template>
			<template v-if="logs.length === 0">
				<view class="bottom-line"></view>
				<view class="expand-item">
					<view class="icon-expand-box">
						<image src="/static/icon-expand.png" mode="aspectFit" class="icon-expand"></image>
					</view>
					<view class="expand-center">
						<view class="expand-name">
							您稍未有过任何消费
						</view>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				headImg: "",
				appAmount: 0,
				totalAppAmount: 0,
				unit:'',
				logs:[]
			}
		},
		mounted(){
			this.initPage();
		},
		methods: {
			initPage(){
				let basicInfo = this.$utils.basicInfo();
				this.telegram = basicInfo.telegram;
				this.email    = basicInfo.email;
				this.unit     = basicInfo.currency_unit;
				this.app_name = basicInfo.app_name;
				let user      = this.$utils.userInfo();
				if (user){
					this.nickname  = user['nickname'] ? user['nickname'] : user['userName'];
					this.dueDate   = user['dueDate'] ? user['dueDate'] : '';
					this.isVip     = user['isVIP'] == '1' ? true : false;
					this.headImg   = user['headImg'] ? user['headImg'] : this.headImg;
					this.avatar    = user['avatar'] ? user['avatar'] : this.avatar;
					this.appAmount = user['amount'] ? user['amount'] : this.amount;
					console.log(this.nickname)
				} else {
					uni.reLaunch({
						url:'/pages/account/login'
					})
				}
				
				this.$utils.request('/api/transaction/consumptions', {}).then((res) => {
					console.log(res);
					if (res.code == 200) {
						this.logs           = res.data.data;
						this.totalAppAmount = res.data.totalAppAmount;
					} else if (res.code == 400) {
						uni.showToast({
							title:res.message,
							icon: "none",
							mask: true,
							duration: 2000
						});
						// uni.reLaunch({
						// 	url:'/pages/account/login'
						// });
					} 
				}).catch(function(error){
					console.log(error.message);
				});
			},
			backPage(){
				//uni.navigateBack();
				uni.switchTab({
					url:'/pages/settings/settings'
				})
			}
		}
	}
</script>

<style>
page{
	background-color: #f4f4f4;
}
.expend-bg{
	width: 750rpx;
	height: 538rpx;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
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
.balance-tip{
	height: 25rpx;
	font-size: 26rpx;
	color: #fff;
	align-self: flex-start;
	margin-left: 31rpx;
	z-index: 2;
}
.balance-total{
	height: 57rpx;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	font-size: 64rpx;
	color: #fff;
	font-weight: bold;
	z-index: 2;
	margin-top: 32rpx;
	margin-bottom: 32rpx;
	margin-left: 30rpx;
}
.balance-total-tip{
	font-size: 46rpx;
	margin-left: 14rpx;
	font-weight: 400;
}
.expand-list-box{
	width: 710rpx;
	height: auto;
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	background: #FFFFFF;
	box-shadow: 0rpx 2rpx 10rpx 0rpx rgba(198,198,198,0.1);
	border-radius: 16rpx;
	z-index: 5;
	margin: 56rpx auto;
}
.expand-item{
	width: 662rpx;
	height: 136rpx;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
}
.icon-expand-box{
	width: 80rpx;
	height: 80rpx;
	background: #991D0D;
	border-radius: 50%;
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: center;
	margin-right: 21rpx;
}
.icon-expand{
	width: 42rpx;
	height: 40rpx;
}
.expand-center{
	flex: 1;
	display: flex;
	flex-flow: column nowrap;
	height: 136rpx;
}
.expand-name{
	font-size: 28rpx;
	color: #2A3243;
	margin-top: 30rpx;
}
.expand-time{
	font-size: 26rpx;
	color: #989DA6;
	margin-top: 8rpx;
}
.expand-right{
	display: flex;
	flex-flow: column nowrap;
	height: 136rpx;
	align-items: flex-end;
}
.expand-amount{
	font-size: 32rpx;
	color: #006400;
	margin-top: 26rpx;
}
.expand-status{
	font-size: 24rpx;
	color: #989DA6;
	margin-top: 6rpx;
}
.bottom-line{
	width: 662rpx;
	height: 1rpx;
	background: #F1F4F9;
}
</style>
