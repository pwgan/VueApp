<script>
	import Vue from 'vue'
	export default {		
		onLaunch: function() {
			let that = this;
			// #ifdef APP-PLUS
			plus.screen.lockOrientation('portrait-primary'); //锁定竖屏	
			// #endif
			if(this.$token)
			{
				// #ifdef APP-PLUS
				plus.navigator.closeSplashscreen();
				// #endif
			}
			else{
				uni.reLaunch({
					url: '/pages/common/login/Login',
					success: () => {
						// #ifdef APP-PLUS
						plus.navigator.closeSplashscreen();
						// #endif
					}
				});
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			// 清除缓存并登出的全局方法
			clearAndLogOut(){
				uni.removeStorageSync('token');
				Vue.prototype.$token='';
				uni.removeStorageSync('personalConfig')
				// 跳转到登录页面
				uni.reLaunch({
					url: '/pages/common/login/Login'
				});
			}
		}
	}
</script>

<style>
@import './common/app.css';
@import './static/style/thorui-extend.css';
@import url("./static/iconfont/iconfont.css");
</style>
