<template>	
	<view class="content">
		<fileUpload ref="fileUpload" labelName="测试附件"></fileUpload>
		<tui-button @tap="getFile()">获取附件</tui-button>
		<image class="logo" src="/static/logo.png" @tap="testLaunch"></image>
		<view @tap="testApprove">测试审批</view>
		<view @tap="testApproveList" style="margin-top: 50rpx;">测试审批列表</view>
		<view @tap="testApproveShared" style="margin-top: 50rpx;">测试审批查询</view>
		<image class="logo" src="/static/logo.png" @tap="testSelectPeople"></image>
		<image class="logo" src="/static/logo.png" @tap="testSelectNewPeople"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<tui-button @tap="logOut()">退出登录</tui-button>
		<tui-modal :show="modal" title="提示" content="确定退出登录吗？" :maskClosable="false" @click="confirmLogOut"></tui-modal>
	</view>
</template>

<script>
	import fileUpload from '@/pages/common/FileUpload.vue'
	export default {
		components:{
			fileUpload
		},
		data() {
			return {
				title: 'Hello',
				modal: false
			}
		},
		onLoad() {

		},
		created() {			
			console.log('token：',this.$token);
			console.log('用户信息：',this.$userInfo);
			console.log('个性化配置：',this.$personalConfig);
		},
		onReady(){
			//创建附件DOM
			this.$refs.fileUpload.create();
		},
		methods: {
			getFile(){
				var files=this.$refs.fileUpload.getFileList();
				uni.showToast({
					title:"附件总数:"+files.length.toString(),					
				})
			},
			logOut() {
				this.modal = true
			},
			confirmLogOut(e) {
				let index = e.index
				if(index == 0){
					this.modal = false
				}else{
					// 清空缓存信息并登出
					getApp().clearAndLogOut()
				}
			},
			testLaunch(){
				uni.navigateTo({
					url: '/pages/OfficialSealAskProcess/Launch'
				})
			},
			testApprove(){
				// let pId = '32B5C716-0D84-4685-BACE-AD7800EF7FAF'
				let pId = 'd381082c-e51c-4c09-94ae-ad710104d8bf'
				this.$request({
					url: "/ProcessInstance/GetProcessInstanceById?ProcessInstanceId=" + pId,
					success: function(data) {
						uni.navigateTo({
							url: '/pages/OfficialSealAskProcess/Approve?applicantInfo=' + encodeURIComponent(JSON.stringify(data.data.Data))
						})
					}
				})
			},
			testApproveShared(){
				uni.navigateTo({
					url: '/pages/Approve/ApproveShared'
				})
			},
			testApproveList(){
				uni.navigateTo({
					url: '/pages/Approve/WaitApproveProcess'
				})
			},
			testSelectPeople(){
				uni.navigateTo({
					url: '/pages/common/SelectAnyPeople'
				})
			},
			testSelectNewPeople(){
				uni.navigateTo({
					url: '/pages/common/SelectPeople'
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
