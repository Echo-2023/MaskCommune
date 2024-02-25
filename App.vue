<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
			// 
		mounted(){
			
		},
	}
</script>

<style>
	/*每个页面公共css */
	.content{
		width: 750rpx;
		display: flex;
		flex-flow: column nowrap;
		position: relative;
	}
</style>
