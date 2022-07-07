import Vue from 'vue'
import App from './App'
import tui from './common/httpRequest'
import LaunchComponent from './pages/common/LaunchComponent'
import LauncherInfo from './pages/common/LauncherInfo'
import ApproveComponent from './pages/common/ApproveComponent'
import ApproveRecord from './pages/common/ApproveRecord'

Vue.prototype.tui = tui
Vue.config.productionTip = false

App.mpType = 'app'

//全局自定义组件
Vue.component("LaunchComponent", LaunchComponent);
Vue.component("LauncherInfo", LauncherInfo);
Vue.component("ApproveComponent", ApproveComponent);
Vue.component("ApproveRecord", ApproveRecord);

//统一全局变量
Vue.prototype.$token=uni.getStorageSync('token') || '';
Vue.prototype.$userInfo=JSON.parse(uni.getStorageSync('userInfo') || '{}');
Vue.prototype.$personalConfig=JSON.parse(uni.getStorageSync('personalConfig') || '{}');
Vue.prototype.$isTest=uni.getStorageSync('isTest') || '0';
Vue.prototype.$baseUrl=Vue.prototype.$isTest=='0' ?'http://10.1.6.10:81':'http://ims.gcmedica.com:9997';
// #ifdef H5
Vue.prototype.$baseUrl=	'/api'
// #endif
Vue.prototype.$appVersion='3.0';
// 判断当前环境是app还是h5
let platForm = 'APP'
// #ifdef H5
platForm = "H5";
// #endif
Vue.prototype.$platForm = platForm;

// Vue.prototype.$baseUrl='http://10.1.6.10:81';
const app = new Vue({
    ...App
});


Vue.prototype.$beforeRequest= function(options)
{
	if (options.url.indexOf('http') == -1)
	{
		options.url = Vue.prototype.$baseUrl+options.url;
	}	
	if (Vue.prototype.$token) {
		options.header = {
			'Authorization': 'Bearer ' + Vue.prototype.$token
		};
	}	
}

// 配置全局http异步请求
Vue.prototype.$request = function(options, loading) {	
	Vue.prototype.$beforeRequest(options);
	if (loading) {
		uni.showLoading({
			mask: true,
			title: '请稍候...'
		});
		options.complete = () => {
			uni.hideLoading();
		}
	}
	return uni.request(options);
}

// 配置全局http同步请求
Vue.prototype.$requestSync = function(options) {	
	Vue.prototype.$beforeRequest(options);
	return new Promise((resolve, reject) => {
		options.success = (res) => {
			console.log(res); // 控制台显示数据信息
			resolve(res);
		}
		options.fail = (res) => {
			console.log(res); // 控制台显示数据信息
			common.toast("网络不给力，请稍后再试~");
			reject("Error");
		}
		uni.request(options);
	});
}

app.$mount();