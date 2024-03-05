<template>
	<view class="content">
		<image src="/static/expend-bg.png" mode="aspectFit" class="expend-bg"></image>
		<view class="header">
			<image src="/static/icon-back.png" mode="aspectFit" class="icon-back" @click="backPage()"></image>
			消费记录
		</view>
		<view class="balance-tip">
			余额(钻）
		</view>
		<view class="balance-total">
			68,950
			<text class="balance-total-tip">钻</text>
		</view>
		<view class="balance-tip">
			累计消费: 32,600钻
		</view>
		<view class="expand-list-box">
			<template v-for="(item,index) in expandList">
				<view class="bottom-line" v-if="index>0">
					
				</view>
				<view class="expand-item">
					<view class="icon-expand-box">
						<image src="/static/icon-expand.png" mode="aspectFit" class="icon-expand"></image>
					</view>
					<view class="expand-center">
						<view class="expand-name">
							消费名称消费名称
						</view>
						<view class="expand-time">
							2023-11-26 12:57
						</view>
					</view>
					<view class="expand-right">
						<view class="expand-amount">
							-1000
						</view>
						<view class="expand-status">
							消费成功
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
				expandList:[
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
					{
						name:'消费名称消费名称',
						time:'2023-11-26 12:57',
						amount:'1000',
						status:'消费成功'
					},
				]
			}
		},
		methods: {
			backPage(){
				uni.navigateBack();
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
	color: #991D0D;
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
/* 
<view class="expand-list-box">
			<view class="expand-item">
				<image src="/static/icon-expand.png" mode="aspectFit" class="icon-expand"></image>
				<view class="expand-center">
					<view class="expand-name">
						消费名称消费名称
					</view>
					<view class="expand-time">
						2023-11-26 12:57
					</view>
				</view>
				<view class="expand-right">
					<view class="expand-amount">
						-1000
					</view>
					<view class="expand-status">
						消费成功
					</view>
				</view>
			</view>
		</view>
 
 */
</style>
