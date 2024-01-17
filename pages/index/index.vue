<template>
	<view class="content">
		<view class="top-bg">

		</view>
		<view class="top-tabs">
			<view class="top-tab" :class="selectTab=='新人'?'select-tab':''" @click="select('新人')">
				<view class="top-tab-title">
					新人
				</view>
				<view class="top-tab-select-line" v-if="selectTab=='新人'"></view>
				<image src="/static/select-bg.png" mode="aspectFit" class="select-bg" v-if="selectTab=='新人'"></image>
			</view>
			<view class="top-tab" :class="selectTab=='女神'?'select-tab':''" @click="select('女神')">
				<view class="top-tab-title">
					女神
				</view>
				<view class="top-tab-select-line" v-if="selectTab=='女神'"></view>
				<image src="/static/select-bg.png" mode="aspectFit" class="select-bg" v-if="selectTab=='女神'"></image>
			</view>
			<view class="city">
				<picker mode="multiSelector" :value="multiIndex" @columnchange="bindMultiPickerColumnChange"
					:range="multiArray">
					<view class="uni-input">{{selectCity}}</view>
				</picker>
				<view class="triangle">

				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" :style="{height:scrollHeight,zIndex:5,marginTop:marginTop}"
			@scrolltolower="loadMoreData()" @refresherrefresh="reloadData()" :refresher-enabled="true"
			refresher-background="rgba(0,0,0,0)" :refresher-triggered="triggered" @refresherpulling="onPulling">
			<view class="user-box">
				<view class="user-item" v-for="(user,index) in users" @click="userDeailPage()">
					<image :src="user.image" mode="aspectFit" class="user-image"></image>
					<view class="user-bottom">
						<view class="user-name">
							{{user.name}}
						</view>
						<view class="user-info">
							年龄/体重：{{user.age + '，' + user.weight}}
						</view>
						<view class="user-locate">
							<image src="/static/icon-locate.png" mode="aspectFit" class="icon-locate"></image>
							{{user.city}}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		addressList,
		provinces
	} from '@/common/cityData.js';
	
	var moreData = [{
			image: '/static/data/data-user1.png',
			name: '徐丽丽',
			city: '杭州',
			age: '26',
			weight: '50kg'
		},
		{
			image: '/static/data/data-user1.png',
			name: '徐丽丽',
			city: '杭州',
			age: '26',
			weight: '50kg'
		}
	];
	export default {
		data() {
			return {
				refreshing: false,
				triggered: false,
				selectTab: '新人',
				multiArray: [
					provinces,
					['北京市']
				],
				multiIndex: [0, 0],
				selectCity: '北京市',
				users: [{
						image: '/static/data/data-user1.png',
						name: '徐丽丽',
						city: '杭州',
						age: '26',
						weight: '50kg'
					},
					{
						image: '/static/data/data-user1.png',
						name: '徐丽丽',
						city: '杭州',
						age: '26',
						weight: '50kg'
					},
					{
						image: '/static/data/data-user1.png',
						name: '徐丽丽',
						city: '杭州',
						age: '26',
						weight: '50kg'
					}
				]
			}
		},
		computed: {
			scrollHeight() {
				var system = uni.getSystemInfoSync();
				return (system.windowHeight - uni.upx2px(148)) + 'px';
			},
			marginTop() {
				return uni.upx2px(30) + 'px';
			}
		},
		onLoad() {
			//const deviceInfo = uni.getDeviceInfo();
			//console.log(deviceInfo.deviceId);
			console.log(this.$utils.getProvinces());
		},
		methods: {
			bindMultiPickerColumnChange(e) {
				switch (e.detail.column) {
					//选择省
					case 0:
						this.multiArray[1] = addressList[provinces[e.detail.value]];
						this.selectCity = this.multiArray[1][0];
						this.multiIndex = [e.detail.value, 0]
						break;
						//选择市
					case 1:
						this.selectCity = this.multiArray[1][e.detail.value];
						break;
					default:
						break;
				}
				this.$forceUpdate()
			},
			select(tab) {
				this.selectTab = tab;
			},
			loadMoreData() {
				uni.showLoading({
					mask: true
				})
				setTimeout(() => {
					this.users = this.users.concat(moreData);
					this.$nextTick(() => {
						uni.hideLoading();
					})
				}, 500)
			},
			reloadData() {
				if (this.refreshing) return;
				this.refreshing = true;
				uni.showLoading({
					mask: true
				})
				setTimeout(() => {
					this.triggered = false;
					this.refreshing = false;
					this.users = moreData;
					this.$nextTick(() => {
						uni.hideLoading();
					})
				}, 500);
			},
			// 自定义下拉刷新控件被下拉
			onPulling(e) {
				console.log("onpulling", e);
				if (e.detail.deltaY < 0) return // 防止上滑页面也触发下拉
				this.triggered = true;
			},
			// 自定义下拉刷新被复位
			onRestore() {
				this.triggered = 'restore'; // 需要重置
			},
			userDeailPage(){
				uni.navigateTo({
					url:'/pages/index/userDetail'
				})
			},
			getRegions() {
				console.log(this.$utils.headers);
				let provinces = uni.request({
					url : config.API_HOST + '/api/regions',
					dataType:'json',
					header: this.$utils.header,
					data:{},
					method: 'POST',
					//header: {'content-type': 'application/x-www-form-urlencoded'},
					success: function(res){
						provinces = res;
					},
				});
				
				return provinces;
			}
		}
	}
</script>

<style>
	.content {
		height: 100%;
		width: 750rpx;
		background-color: rgb(246, 246, 246);
		position: relative;
		display: flex;
		flex-flow: column nowrap;
	}

	.top-bg {
		z-index: 1;
		position: absolute;
		top: 0;
		left: 0;
		width: 750rpx;
		height: 1260rpx;
		background: linear-gradient(0deg, #f6f6f6 0%, #BE1C07 56%, #b51500 100%);
	}

	.top-tabs {
		width: 750rpx;
		height: 78rpx;
		margin-top: 40rpx;
		display: flex;
		flex-flow: row nowrap;
		color: #fff;
		z-index: 2;
		position: relative;
	}

	.top-tab {
		margin-left: 20rpx;
		margin-right: 22rpx;
		font-weight: bold;
		font-size: 36rpx;
		position: relative;
		overflow: visible;
	}

	.select-tab {
		font-size: 40rpx;
	}

	.top-tab-select-line {
		position: absolute;
		width: 34rpx;
		height: 9rpx;
		border-radius: 4rpx;
		background: #fff;
		left: 50%;
		bottom: 0;
		margin-left: -17rpx;
	}

	.select-bg {
		position: absolute;
		bottom: 17rpx;
		left: 6rpx;
		width: 85rpx;
		height: 65rpx;
	}

	.triangle {
		width: 0;
		height: 0;
		border-left: 10rpx solid transparent;
		border-right: 10rpx solid transparent;
		border-top: 10rpx solid white;
		margin-left: 8rpx;
	}

	.city {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		position: absolute;
		top: 14rpx;
		right: 20rpx;
	}

	.user-box {
		width: 710rpx;
		margin: 0 auto 24rpx;
		display: flex;
		flex-flow: row wrap;
		align-items: flex-start;
		justify-content: space-between;
	}

	.user-item {
		width: 344rpx;
		height: 426rpx;
		border-radius: 20rpx;
		position: relative;
		overflow: hidden;
		margin-bottom: 24rpx;
	}

	.user-image {
		width: 344rpx;
		height: 426rpx;
	}

	.user-bottom {
		width: 344rpx;
		height: 90rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: center;
		color: #fff;
	}

	.user-name {
		margin-left: 24rpx;
		font-size: 30rpx;
	}

	.user-info {
		margin-left: 24rpx;
		font-size: 26rpx;
	}

	.user-locate {
		position: absolute;
		right: 20rpx;
		top: 6rpx;
		font-size: 30rpx;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}

	.icon-locate {
		width: 21rpx;
		height: 26rpx;
		margin-right: 11rpx;
	}

	/* 
	<view class="user-box">
		<view class="user-item">
			<image src="/static/data/data-user1.png" mode="aspectFit" class="user-image"></image>
			<view class="user-bottom">
				<view class="user-name">
					徐丽丽
				</view>
				<view class="user-info">
					年龄/体重：26，50kg
				</view>
				<view class="user-locate">
					<image src="/static/icon-locate.png" mode="aspectFit" class="icon-locate"></image>
					杭州
				</view>
			</view>
		</view>
	</view> 
	 
	 
	 */
</style>