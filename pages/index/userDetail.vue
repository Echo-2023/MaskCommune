<template>
	<view class="content">
		<image :src="girl.headImg" mode="aspectFill" class="user-cover"></image>
		<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="back()"></image>
		<view class="detail-box">
			<view class="user-avatar-box">
				<image :src="girl.avatar" mode="aspectFill" class="user-avatar"></image>
			</view>
			<view class="wechat-box" @click="contactInfo(girl.item_id)">
				<image src="/static/icon-wechat.png" mode="aspectFit" class="icon-wechat"></image>
				查看微信
			</view>
			<view class="user-name">
				{{girl.nickname}}
				<view class="user-level">
					LV{{girl.level}}
				</view>
			</view>
			<view class="user-intro-box">
				<view class="user-id">
					ID: {{girl.item_id}}
				</view>
				<view class="user-job">
					<image src="/static/icon-job.png" mode="aspectFit" class="icon-job"></image>
					{{girl.profession}}
				</view>
				<view class="user-city">
					<image src="/static/icon-city.png" mode="aspectFit" class="icon-city"></image>
					{{girl.province}}·{{girl.city}}
				</view>
			</view>
			<view class="user-info-box">
				<view class="user-info-item">
					<view class="user-info-text">
						{{girl.age}}岁
					</view>
					<view class="user-info-title">
						年龄
					</view>
				</view>
				<view class="user-info-item">
					<view class="user-info-text">
						{{girl.height}}cm
					</view>
					<view class="user-info-title">
						身高
					</view>
				</view>
				<view class="user-info-item">
					<view class="user-info-text">
						{{girl.weight}}kg
					</view>
					<view class="user-info-title">
						体重
					</view>
				</view>
				<view class="user-info-item">
					<view class="user-info-text">
						{{girl.constellation}}
					</view>
					<view class="user-info-title">
						星座
					</view>
				</view>
			</view>
			<view style="width: 0;height:0" id="scrollTop">
			</view>
			<view class="user-tabs">
				<view class="user-tab" :class="tab=='图片'?'tab-selected':''" @click="changeTab('图片')"> 
					图片
					<view class="top-tab-select-line" v-if="tab=='图片'">
						
					</view>
				</view>
				<view class="user-tab" :class="tab=='视频'?'tab-selected':''" @click="changeTab('视频')">
					视频
					<view class="top-tab-select-line" v-if="tab=='视频'">
						
					</view>
				</view>
				<view class="total-count" v-if="tab=='图片'">
					共{{girl.photosLen}}个
				</view>
				<view class="total-count" v-if="tab=='视频'">
					共18个
				</view>
			</view>
			<view class="image-box" v-if="tab=='图片'">
				<image :key="index" v-for="(item,index) in girl.photos" :src="item" mode="aspectFill" class="user-image" @click="previewImage([item])"></image>
			</view>
			<view class="image-box" v-if="tab=='视频'">
				<image :key="index" v-for="(item,index) in girl.photos" :src="item" mode="aspectFill" class="user-image" @click="playVideo()"></image>
			</view>
			<video src="/static/data/user.mp4" style="width: 0;height: 0;" id="myVideo"></video>
		</view>
	</view>
</template>

<script>
	var userImagesData = [
		'/static/data/user-images-1.png'
	];
	var userVideosData = [
		'/static/data/user-images-2.png'
	];
	export default {
		data() {
			return {
				tab:'图片',
				userVideos:[
					'/static/data/user-images-2.png'
				],
				videoContext:null,
				girl:{},
				girlId:''
			}
		},
		methods: {
			back(){
				//uni.navigateBack();
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
			changeTab(tab){
				if(tab==this.tab){
					return;
				}
				uni.showLoading({
					mask:true
				})
				uni.pageScrollTo({
					selector:'#scrollTop',
					duration:100,
					complete: () => {
						setTimeout(()=>{
							this.tab = tab;
							uni.hideLoading();
						},500)
					}
				})
				
			},
			playVideo(){
				this.videoContext = uni.createVideoContext('myVideo');
				this.videoContext.requestFullScreen();
				this.videoContext.play();
			},
			previewImage(images){
				uni.previewImage({
					urls:images
				})
			},
			cif(itemId){
				uni.showLoading();
				this.$utils.request(
					'/api/content/cif', 
					{girl_id:itemId}
				).then((res) => {
					console.log(res);
					if (res.code == 200) {
						let info = res.data;
						uni.hideLoading();
						uni.showModal({
							title: '联系方式',
							content: '微信:' + info.wechat,
							showCancel: false,
							success: function(res) {
								
							}
						});
					} else if (res.code == 400) {
						let msg = res.message;
						if (res.msg == 'Unauthenticated.') {
							msg = '您尚未登陆，请登陆之后再查看';
						}
						uni.showToast({
							title: msg,
							icon: "none",
							mask: true,
							duration: 2000
						});
						if (res.msg == 'Unauthenticated.') {
							uni.setStorage({
								key: 'login_before_uri',
								data: '/pages/index/userDetail?girl='+this.girlId,
								success: function () {
									console.log('登陆前url保存成功');
								}
							});
							uni.navigateTo({
								url:'/pages/account/login'
							})
						}
					} else {
						uni.hideLoading();
					}
				});
			},
			contactInfo(girlId){
				let token = '';
				if (this.$utils.authorization()){
					let user = this.$utils.userInfo();
					let msg  = "";
					if (user.isVIP) {
						this.cif(girlId);
					} else {
						uni.showModal({
							title: '提示信息',
							content: '您不是VIP会员，查看女神联系方式将会从您的余额中进行扣除费用',
							success: function(res) {
								if (res.confirm) {
									if (user.amount) {
										this.cif(girlId);
									} else {
										uni.showModal({
											title: '提示信息',
											content: '您的余额为0，请先充值',
											success: function(res) {
												if (res.confirm) {
													uni.navigateTo({
														url: '/pages/vip/charge-option'
													})
												}
											}
										});
									}
								}
							}
						});
					}
					console.log(user);
					
				} else {
					console.log('需要登陆');
					uni.setStorage({
						key: 'login_before_uri',
						data: '/pages/index/userDetail?girl='+this.girlId,
						success: function () {
							console.log('登陆前url保存成功');
						}
					});
					uni.showModal({
						title: '消息提醒',
						content: '查看联系方式需要登陆，请确认是否登陆',
						confirmText: '登陆',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url:'/pages/account/login'
								});
							}
						}
					})
					
				}
				console.log(girlId)
			},
			async userInfo(){
				let uri = '/api/content/girl';
				let param = {
					girl_id: this.girlId
				};
				
				let info = await this.$utils.request(uri, param);
				this.girl = info.data;
				this.userImages = this.girl.photos;
			}
		},
		onLoad(option) {
			console.log(option, option.girl);
			this.girlId = option.girl;
			//uni.clearStorageSync('login_before_uri');
			this.userInfo();
		},
		onReachBottom() {
			uni.showLoading({
				mask: true
			})
			setTimeout(() => {
				if(this.tab == '图片'){
					this.userImages = this.userImages.concat(userImagesData);
				}else{
					this.userVideos = this.userVideos.concat(userVideosData);
				}
				this.$nextTick(() => {
					uni.hideLoading();
				})
			}, 500)
		}
	}
</script>

<style>
	.content{
		width: 750rpx;
		display: flex;
		flex-flow: column nowrap;
		position: relative;
	}
	.user-cover{
		width: 750rpx;
		height: 414rpx;
	}
	.icon-back{
		width: 20rpx;
		height: 33rpx;
		position: absolute;
		top: 60rpx;
		left: 36rpx;
	}
	.detail-box{
		width: 750rpx;
		position: relative;
		margin-top: -30rpx;
		border-top-left-radius: 16rpx;
		border-top-right-radius: 16rpx;
		background-color: #fff;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: flex-start;
	}
	.user-avatar-box{
		width: 164rpx;
		height: 164rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: -43rpx;
		left: 25rpx;
		background-color: #fff;
		border-radius: 50%;
	}
	.user-avatar{
		width: 132rpx;
		height: 132rpx;
		border-radius: 50%;
		overflow: hidden;
		border: 4rpx solid #fff;
		box-shadow: 0px 8rpx 40rpx 0px rgba(42,50,67,0.2);
	}
	.wechat-box{
		width: 500rpx;
		height: 60rpx;
		background: #28C445;
		border-radius: 30rpx;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #fff;
		font-weight: bold;
		align-self: flex-end;
		margin-right: 20rpx;
		margin-top: 30rpx;
	}
	.icon-wechat{
		width: 35rpx;
		height: 29rpx;
		margin-right: 25rpx;
	}
	.user-name{
		width: 690rpx;
		margin-top: 56rpx;
		color: #333333;
		font-size: 42rpx;
		font-weight: bold;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}
	.user-level{
		width: auto;
		padding: 0 17rpx;
		height: 30rpx;
		margin-left: 20rpx;
		background-color: #991D0D;
		line-height: 30rpx;
		text-align: center;
		font-size: 24rpx;
		color: #fff;
		font-style: italic;
		border-radius: 15rpx;
	}
	.user-intro-box{
		width: 690rpx;
		height: 26rpx;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		margin-top: 23rpx;
		font-size: 28rpx;
		color: #989DA6;
	}
	.user-id{
		
	}
	.user-job{
		margin-left: 50rpx;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}
	.icon-job{
		width: 28rpx;
		height: 26rpx;
		margin-right: 10rpx;
	}
	.user-city{
		margin-left: 50rpx;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}
	.icon-city{
		width: 24rpx;
		height: 26rpx;
		margin-right: 10rpx;
	}
	.user-info-box{
		width: 710rpx;
		height: 143rpx;
		margin-top: 15rpx;
		border-bottom: 2rpx solid #F1F1F1;
		display: flex;
		flex-flow: row nowrap;
	}
	.user-info-item{
		flex: 1;
		height: 143rpx;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
	}
	.user-info-text{
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
		margin-bottom: 24rpx;
		height: 32rpx;
	}
	.user-info-title{
		font-size: 26rpx;
		color: #989DA6;
		height: 25rpx;
	}
	.user-tabs{
		width: 710rpx;
		height: 100rpx;
		display: flex;
		flex-flow: row nowrap;
		position: relative;
		margin-bottom: 12rpx;
		position: sticky;
		top: -2rpx;
		z-index: 99;
		background-color: #fff;
	}
	.user-tab{
		height: 100rpx;
		line-height: 100rpx;
		margin-right: 36rpx;
		font-size: 30rpx;
		color: #989DA6;
		font-weight: bold;
		position: relative;
	}
	.tab-selected{
		font-size: 38rpx;
		color: #333333;
	}
	.top-tab-select-line{
		width: 34rpx;
		height: 9rpx;
		border-radius: 4rpx;
		background: #991D0D;
		position: absolute;
		left: 50%;
		top: 80rpx;
		margin-left: -17rpx;
	}
	.total-count{
		position: absolute;
		right: 0rpx;
		top: 35rpx;
		font-size: 26rpx;
		color: #C4C8CD;
	}
	.image-box{
		width: 710rpx;
		display: flex;
		flex-flow: row wrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	.user-image{
		width: 346rpx;
		height: 346rpx;
		margin-bottom: 18rpx;
		border-radius: 16rpx;
	}
	/* 

	<view class="image-box">
		<image v-for="(item,index) in userImages" :src="item" mode="aspectFit" class="user-image"></image>
	</view>
	 
	 */
</style>
