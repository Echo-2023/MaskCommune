<template>
	<view class="content">
		<image :src="girl.headImg" mode="aspectFill" class="user-cover"></image>
		<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="back()"></image>
		<view class="detail-box">
			<view class="user-avatar-box">
				<image :src="girl.avatar" mode="aspectFill" class="user-avatar"></image>
			</view>
			<view class="wechat-box" @click="contactInfo(girl.id)" title="test">
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
				<!-- <view class="user-id">
					ID: {{girl.item_id}}
				</view> -->
				<view class="user-job">
					<image src="/static/icon-job.png" mode="aspectFit" class="icon-job"></image>
					{{girl.profession}}
				</view>
				<view class="user-city">
					<image src="/static/icon-city.png" mode="aspectFit" class="icon-city"></image>
					{{girl.province}}·{{girl.city}}
				</view>
				<view class="user-share hover-item" @click="uniShare">
					<image src="/static/icon-fxwz.png" mode="aspectFit" class="icon-city"></image>
					分享
					<!-- 提示信息 -->
					<view class="tooltip">
						新用户注册成功，可获得10次查看微信机会
					</view>	
					
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
					共{{girl.videosLen}}个
				</view>
			</view>
			<view class="image-box" v-if="tab=='图片'">
				<image :key="index" v-for="(item,index) in girl.photos" :src="item" mode="aspectFill" class="user-image" @click="previewImage([item])"></image>
			</view>
			<view class="image-box" v-if="tab=='视频'">
				<video :key="index" v-for="(item,index) in girl.videos" :src="item" :id="videoId + index" mode="aspectFill" class="user-video" @click="playVideo(videoId+index)"></video>
				<span class="video-tip" v-if="girl.videosLen<1">有点懒,暂未上传视频</span>				
			</view>
			<view class="comment-btx" @click="feedback()">
				<image src="/static/icon-wechat.png" mode="aspectFit" class="icon-wechat"></image>
				点评 & 反馈
			</view>
		</view>
		<view class="feedback-box" v-show="showFeedback">
			<view class="feedback-box-content">
				<image src="/static/login-bottom-bg.png" mode="aspectFit" class="feedback-box-header"></image>
				<view class="feedback-content-type">
					类型:
					<select id="feedback_type" :value=feedbackType>
						<option value='1'> 女神点评</option>
						<option value='2'> 杳无音信</option>
						<option value='3'> 意见反馈</option>
						<option value='4'> 优化建议</option>
					</select>
				</view>
				<view class="feedback-content-info">
					内容:
					<textarea id="feedback_content" v-model="feedbackContent"  placeholder="请输入内容(8-200个字符)"></textarea>
					<p>{{ remainingCharacters }} 个字符剩余</p>
					<p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
				</view>
				<view class="recharge-success-btn" @click="submitFeedback()">
					提交
				</view>
				<image src="/static/icon-close.png" mode="aspectFit" class="icon-close"  @click="feedback()"></image>
			</view>
		</view>
	</view>
</template>

<script>
	//console.log(uniShare);
	const userImagesData = [
		'/static/data/user-images-1.png'
	];
	const userVideosData = [
		'/static/data/user-images-2.png'
	];
	export default {
		data() {
			return {
				tab:'图片',
				userVideos:[
					'/static/data/user-images-2.png'
				],
				videoId: "myVideo",
				videoContext:null,
				girl:{},
				girlId:'',
				showFeedback: false,
				feedbackType: 1,
				feedbackContent:'',
				errorMessage: ''
			}
		},
		computed: {
		    remainingCharacters() {
		      return 200 - this.feedbackContent.length;
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
			playVideo(id){
				this.videoContext = uni.createVideoContext(id);
				//this.videoContext.requestFullScreen();
				this.videoContext.play();
			},
			previewImage(images){
				uni.previewImage({
					urls:images
				})
			},
			cif(itemId){ //获取女神信息
				uni.showLoading();
				this.$utils.request(
					'/api/content/cif', 
					{girl_id:itemId}
				).then((res) => {
					if (res.code == 200) {
						let info = res.data;
						uni.hideLoading();
						uni.showModal({
						    title: '联系方式',
						    content: '微信: ' + info.wechat,
						    cancelText: "确定", // 保持有取消和确定两个按钮
							confirmText: "复制",
						    success: function (res) {
						        if (res.confirm) {
						            // 点击确定按钮后执行的逻辑，将微信号复制到剪贴板
						            uni.setClipboardData({
						                data: info.wechat,
						                success: function () {
						                    uni.showToast({
						                        title: '微信号已复制',
						                        icon: 'success',
						                        duration: 2000
						                    });
						                }
						            });
						        }
						    }
						});
					} else if (res.code == 400) {
						let msg = res.message;
						if (res.message == 'Unauthenticated.') {
							msg = '您尚未登陆，请登陆之后再查看';
							uni.clearStorageSync()
						}
						uni.hideLoading();
						uni.showModal({
							title: '提示信息',
							content: msg,
							confirmText: "登录",
							success: (res) => {
								if (res.confirm) {
									//记录登录前的页面地址
									const currentUri = this.$utils.getCurrentPageUri();
									uni.setStorageSync('before_uri', currentUri);
									uni.reLaunch({
										url: '/pages/account/login'
									})
								}
							}
						});
					} else {
						uni.hideLoading();
						uni.showModal({
							title: '提示信息',
							content: res.message,
							cancelText: "稍后购买",
							confirmText: "立即购买",
							success: function(res) {
								if (res.confirm) {
									uni.reLaunch({
										url: '/pages/vip/vip'
									})
								}
							}
						});
					}
				});
			},
			contactInfo(girlId){ //获取当前用户信息
				let token = '';
				if (this.$utils.authorization()){
					let user = this.$utils.userInfo();
					let msg  = "";
					this.cif(girlId);
				} else {
					uni.showModal({
						title: '消息提醒',
						content: '查看联系方式需要登陆，请确认是否登陆',
						confirmText: '登陆',
						success: (res) => {
							if (res.confirm) {
								//记录登录前的页面地址
								const currentUri = this.$utils.getCurrentPageUri();
								uni.setStorageSync('before_uri', currentUri);
								uni.navigateTo({
									url:'/pages/account/login'
								});
							}
						}
					})
					
				}
				//console.log(girlId)
			},
			async userInfo(){
				let uri = '/api/content/girl';
				let param = {
					girl_id: this.girlId
				};
				
				let info = await this.$utils.request(uri, param);
				if (info.code == 404) {
					uni.showModal({
						title: '提示信息',
						content: info.message,
						showCancel: false,
						confirmText: "确定",
						success: function(res) {
							if (res.confirm) {
								uni.reLaunch({
									url: '/pages/index/index'
								})
							}
						}
					});
				}
				this.girl = info.data;
				this.userImages = this.girl.photos;
				this.userVideos = this.girl.videos;
				this.$utils.basicInfo().then((res) => {
					uni.setNavigationBarTitle({
						title: this.girl.nickname + '的主页-' + res.app_name
					});
				});
			},
			feedback() {
				
				if (!this.$utils.authorization()) {
					uni.showModal({
						title: '消息提示',
						content: '需要先登陆,才可以进行点评&反馈',
						success: (res) => {
							if (res.confirm) {
								//记录登录前的页面地址
								const currentUri = this.$utils.getCurrentPageUri();
								uni.setStorageSync('before_uri', currentUri);
								
								uni.reLaunch({
									url:'/pages/account/login'
								});  
							} else {
								// 执行取消后的操作
							}
						}
					});
				} else {
					let user = this.$utils.userInfo(true);
					console.log(user);
					let msg  = "";
					if (user.isVIP=='1') {
						this.showFeedback = !this.showFeedback;
					} else {
						uni.showModal({
							title: '消息提示',
							content: '只有VIP会员才可以进行点评&反馈',
							success: (res) => {
								if (res.confirm) {
									// 确认后进行的操作 
								} else {
									// 执行取消后的操作
								}
							}
						});
					}
				}
			},
			submitFeedback(){
				if (this.$utils.authorization()) {
					console.log('login in');
					if (this.feedbackContent.length < 8) {
						this.errorMessage = '输入的字符数必须大于或等于8个字符。';
					} else if (this.feedbackContent.length > 200) {
						this.inputText = this.feedbackContent.slice(0, 200);
						this.errorMessage = '输入的字符数不能超过200个字符。';
					} else {
						this.errorMessage = '';
						uni.showLoading();
						this.$utils.request(
							'/api/content/comment', 
							{girl_id:this.girl.id,option_id: this.feedbackType, content:this.feedbackContent}
						).then((res) => {
							console.log(res);
							uni.hideLoading();
							this.showFeedback = !this.showFeedback;//关闭信息反馈窗口
							uni.showModal({
								title: '提示信息',
								content: res.message,
								showCancel: false,
								success: function(res) {}
							});
						});
					}
				} else {
					console.log('暂未登录');
				}
			},
			uniShare() {
				let   url  = window.location.href;
				const user = this.$utils.userInfo();
				if (user) {
					url = url + "&promo_code=" + user['id'];
				}
				//console.log(url, this.girl.avatar, this.isRealMobile());
				
				// 触发分享方法
				// 检查浏览器是否支持 navigator.share
				if (navigator.share) {
				  navigator.share({
				    title: document.title,
				    text: '免费注册，即可查看女神联系方式；每日可免费查看10个女神的联系方式',
				    url: url // 替换为你自己的URL
				  }).then(() => {
				    console.log('分享成功');
				  }).catch((error) => {
				    console.log('分享失败', error);
				  });
				} else {
				  console.log('浏览器不支持分享功能');
				}
			} 
		},
		onLoad(option) {
			let key = 'girl'; // 替换为需要获取的参数名
			if (option[key] && option[key].includes(',')) {
			  // 取逗号分隔字符串的最后一个值
			  option[key] = option[key].split(',').pop();
			}
			this.girlId = option.girl;
			key = 'promo_code'; // 替换为需要获取的参数名
			if (option[key] && option[key].includes(',')) {
			  // 取逗号分隔字符串的最后一个值
			  option[key] = option[key].split(',').pop();
			}
			const promo_code = option.promo_code;
			//console.log(promo_code)
			if (promo_code != undefined) {
				uni.setStorageSync('promo_code', promo_code);
			}
			//uni.clearStorageSync('login_before_uri');
			this.userInfo();
		},
		mounted() {
			
		},
		onReachBottom() {
			uni.showLoading({
				mask: true
			})
			setTimeout(() => {
				if (this.tab == '图片') {
					this.userImages = this.userImages.concat(userImagesData);
				} else {
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
	textarea {
	  border-style: solid;     /* 边框样式 */
	  border-width: 1px;       /* 边框宽度 */
	  border-color: #C4C8CD;      /* 边框颜色 */
	  width:480rpx;
	  font-weight:normal;
	}
	
	select {
		color: #C4C8CD;
		width:280rpx;
		height: 50rpx;
		font-weight:normal;
		font-size: 30rpx;
		margin-left: 20rpx;
	}
	
	p {
		font-size: 12px;
	}
	
	.content{
		width: 750rpx;
		display: flex;
		flex-flow: column nowrap;
		position: relative;
	}
	.user-cover{
		width: 750rpx;
		height: 464rpx;
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
	.user-share{
		margin-left: 50rpx;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		font-weight: bold;
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
	.user-video{
		width: 346rpx;
		height: 346rpx;
		margin-bottom: 18rpx;
		border-radius: 16rpx;
	}
	.comment-btx{
		width: 710rpx;
		height: 60rpx;
		background: #6bab77;
		/* border-radius: 30rpx; */
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #fff;
		font-weight: bold;
		position: relative;
	}
	.feedback-box{
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
	.feedback-box-content{
		width: 579rpx;
		/* height: 700rpx; */
		height: auto;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: flex-start;
		position: relative;
		background-color: #fff;
		border-radius: 30rpx;
	}
	.feedback-box-header{
		position: absolute;
		width: 579rpx;
		height: 200rpx;
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
	.feedback-content-type{
		color: #999999;
		width: 500rpx;
		align-content: left;
		font-size: 32rpx;
		font-weight: bold;
		margin-top: 190rpx;
		z-index: 2;
	}
	.feedback-content-info{
		color: #999999;
		width: 500rpx;
		align-content: left;
		font-size: 32rpx;
		font-weight: bold;
		margin-top: 20rpx;
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
		margin-top: 40rpx;
		margin-bottom: 30rpx;;
	}
	.video-tip{
		font-size: 26rpx;
		color: #989DA6;
		height: 346rpx;
	}
	
	.hover-item {
	  padding: 10px;
	  background-color: #f5f5f5;
	  display: inline-block;
	  cursor: pointer;
	  border-radius: 5px;
	  position: relative;
	}
	
	.tooltip {
	  visibility: hidden;
	  width: 580rpx;
	  background-color: #333;
	  color: #fff;
	  text-align: left;
	  border-radius: 5rpx;
	  padding: 5rpx;
	  padding-left: 30rpx;;
	  position: absolute;
	  /*bottom: 100%;  显示在上方 */
	  /* left: 40%; */
	  transform: translateX(-50%);
	  opacity: 0;
	  transition: opacity 0.3s;
	  white-space: nowrap;
	  font-size: 24rpx;
	  z-index: 1000;
	}
	
	.hover-item:hover .tooltip {
	  visibility: visible;
	  opacity: 1;
	}
</style>
