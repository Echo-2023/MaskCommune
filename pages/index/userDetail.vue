<template>
	<view class="content">
		<image src="/static/data/user-cover.png" mode="aspectFit" class="user-cover"></image>
		<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="back()"></image>
		<view class="detail-box">
			<view class="user-avatar-box">
				<image src="/static/data/user-avatar.png" mode="aspectFit" class="user-avatar"></image>
			</view>
			<view class="wechat-box">
				<image src="/static/icon-wechat.png" mode="aspectFit" class="icon-wechat"></image>
				查看微信
			</view>
			<view class="user-name">
				徐莉莉
				<view class="user-level">
					LV17
				</view>
			</view>
			<view class="user-intro-box">
				<view class="user-id">
					ID: 96526536578
				</view>
				<view class="user-job">
					<image src="/static/icon-job.png" mode="aspectFit" class="icon-job"></image>
					模特
				</view>
				<view class="user-city">
					<image src="/static/icon-city.png" mode="aspectFit" class="icon-city"></image>
					浙江·杭州
				</view>
			</view>
			<view class="user-info-box">
				<view class="user-info-item">
					<view class="user-info-text">
						26岁
					</view>
					<view class="user-info-title">
						年龄
					</view>
				</view>
				<view class="user-info-item">
					<view class="user-info-text">
						165cm
					</view>
					<view class="user-info-title">
						身高
					</view>
				</view>
				<view class="user-info-item">
					<view class="user-info-text">
						52kg
					</view>
					<view class="user-info-title">
						体重
					</view>
				</view>
				<view class="user-info-item">
					<view class="user-info-text">
						双鱼座
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
					共16个
				</view>
				<view class="total-count" v-if="tab=='视频'">
					共18个
				</view>
			</view>
			<view class="image-box" v-if="tab=='图片'">
				<image v-for="(item,index) in userImages" :src="item" mode="aspectFit" class="user-image" @click="previewImage([item])"></image>
			</view>
			<view class="image-box" v-if="tab=='视频'">
				<image v-for="(item,index) in userVideos" :src="item" mode="aspectFit" class="user-image" @click="playVideo()"></image>
			</view>
			<video src="/static/data/user.mp4" style="width: 0;height: 0;" id="myVideo"></video>
		</view>
	</view>
</template>

<script>
	var userImagesData = [
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png'
				];
	var userVideosData = [
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png'
				];
	export default {
		data() {
			return {
				tab:'图片',
				userImages:[
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png',
					'/static/data/user-images-1.png'
				],
				userVideos:[
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png',
					'/static/data/user-images-2.png'
				],
				videoContext:null
			}
		},
		methods: {
			back(){
				uni.navigateBack();
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
			}
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
