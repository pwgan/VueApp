<template>
	<view class="container">
		<scroll-view :scroll-y="true" :scroll-top="scrollTop" :show-scrollbar='true' :refresher-enabled='true'
			@scroll="scroll" @refresherrefresh="pull" :refresher-triggered="isShow" refresher-background="#f4f4f4"
			:style="{ height: height + 'px'}">
			<view v-for="item in card">
				<tui-card :title="{text: item.ProcessName, color: 'blue'}" :tag="{'text': item.ProcessInstanceCode}"
					style="margin-top: 30rpx;" @tap="approveProcess(item)">
					<template v-slot:body>
						<view class="tui-default">
							<tui-row marginBottom="10px" :gutter="10">
								<tui-col :span="12">
									<view class="tui-col__demo">申请人：{{item.LauncherEmployeeName}}</view>
								</tui-col>
								<tui-col :span="12">
									<view class="tui-col__demo">部门：{{item.LauncherDepartmentName}}</view>
								</tui-col>
							</tui-row>
							<tui-row marginBottom="10px" :gutter="10">
								<tui-col :span="12">
									<view class="tui-col__demo">紧急程度：{{item.UrgencyLevelName}}</view>
								</tui-col>
							</tui-row>
							<tui-row :marginBottom="item.LaunchReason?'10px':'0'" :gutter="10">
								<tui-col :span="24">
									<view class="tui-col__demo">申请理由：</view>
								</tui-col>
							</tui-row>
							<tui-row :gutter="10" v-if="item.LaunchReason">
								<tui-col :span="24">
									<view class="tui-col__demo">{{item.LaunchReason}}</view>
								</tui-col>
							</tui-row>
						</view>
					</template>
					<template v-slot:footer>
						<view class="tui-default">
							<tui-row marginBottom="10px" :gutter="10"
								style="margin-bottom: 0;vertical-align: middle!important;">
								<tui-col :span="19" style="vertical-align: middle!important;">
									<view class="tui-col__demo">{{item.LaunchTime}}</view>
								</tui-col>
								<tui-col :span="5">
									<view class="tui-col__demo">
										<tui-button width="100%" height="50rpx" :size="24" @tap="approveConfirm(item)">确认同意</tui-button>
									</view>
								</tui-col>
							</tui-row>
						</view>
					</template>
				</tui-card>
			</view>
		</scroll-view>
		<tui-dialog :buttons="buttons" :show="showDialog" title="提示" @click="confirm">
			<template v-slot:content>
				确认同意审批吗?
			</template>
		</tui-dialog>
		<view class="thorui-padding thorui-white__bg">
			<tui-pagination :total="total" color="#fff" backgroundColor="#5677fc" currentColor="#5677fc"
				:current="current" :pageSize="pageSize" @change="change"></tui-pagination>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				card: [],
				//搜索条件，默认为空
				formData: {},
				//时间组件是否可见
				showBeginDate: false,
				showEndDate: false,
				//分页查询
				total: 0,
				current: 1,
				pageSize: 5,
				//用于点击后回到页面最上方
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				//动态样式高度
				winHeight: 0,
				height: 0,
				top: 0,
				isShow: false,
				//确认审批弹框
				showDialog: false,
				buttons:[{
					text: '取消'
				}, {
					text: '确定',
					color: '#586c94'
				}],
				//弹框确认点击方法不能传递具体实例对象，因此定义一个对象用于接收
				selectObj: null
			}
		},
		onLoad: function(option) {
			//获取手机分辨率设置页面样式
			setTimeout(() => {
				uni.getSystemInfo({
					success: res => {
						let header = 92;
						let top = 0;
						//#ifdef H5
						top = 44;
						//#endif
						this.height = res.windowHeight - uni.upx2px(header) - 30;
						this.top = top + uni.upx2px(header);
						let winHeight = res.windowHeight - uni.upx2px(50);
						let barHeight = winHeight - uni.upx2px(204);
						this.winHeight = winHeight;
					}
				})
			}, 100)
			this.getApproveList()
		},
		// 监听原生标题栏按钮点击事件
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url: '/pages/Approve/ApproveShared?formData=' + encodeURIComponent(JSON.stringify(this.formData))
			})
		},
		methods: {
			//滑动时记录scrollTop
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			//下拉刷新
			pull() {
				var that = this;
				if (!that.isShow) {
					that.PageIndex = 1;
					that.isShow = true; //下拉加载，先让其变true再变false才能关闭
					that.getApproveList()
					//关闭加载状态 (转动的圈)，需要一点延时才能关闭
					setTimeout(e => {
						that.isShow = false;
					}, 300)
				}
			},
			//翻页
			async change(e) {
				this.current = e.current
				await this.backToTop()
				this.getApproveList()
			},
			//回到最顶端
			backToTop(){
				let that = this
				that.scrollTop = that.old.scrollTop
				that.$nextTick(function(){
					that.scrollTop = 0
				})
			},
			//选择条件后回调查询
			async queryList(data){
				await this.resetData(data)
				this.getApproveList()
			},
			//重新赋值搜索条件
			resetData(data){
				this.formData = data
				this.current = 1
				this.pageSize = 5
			},
			getApproveList() {
				let that = this
				let model = that.formData
				model.PageIndex = that.current
				model.PageSize = that.pageSize
				this.$request({
					url: "/ProcessInstance/GetWaitApproveProcess",
					data: model,
					success: function(res) {
						let result = res.data
						if(result.Success){
							that.total = result.Data.Count
							that.card = result.Data.Data
						}
					}
				})
			},
			//点击后进入审批页面
			approveProcess(item){
				this.$request({
					url: "/ProcessInstance/GetProcessInstanceById?ProcessInstanceId=" + item.ProcessInstanceId,
					success: function(data) {
						uni.navigateTo({
							url: '/pages' + item.ApprovalPageUrl + '?applicantInfo=' + encodeURIComponent(JSON.stringify(data.data.Data))
						})
					}
				})
			},
			//确认同意
			approveConfirm(item) {
				var that = this
				let personalConfig = JSON.parse(uni.getStorageSync('personalConfig'))
				if(personalConfig.IsApprovalReconfirmation == true){
					that.showDialog = true
					//弹框确认点击方法不能传递具体实例对象，因此定义一个对象进行赋值
					that.selectObj = item
				}else{
					that.save(item)
				}
			},
			save(item){
				var that = this
				const model = {
					ApproveAction: 1,
					ProcessInstanceId: item.ProcessInstanceId
				}
				this.$request({
					url: item.ApprovalPageUrl,
					method: 'POST',
					data: model,
					success: function(res) {
						var result = res.data
						if (result.Success) {
							that.tui.toast('审批成功', 2000, true)
							that.getApproveList();
						} else {
							that.tui.toast(result.Msg, 2000)
						}
					}
				})
			},
			confirm(e){
				this.showDialog = false
				if(e.index == 1){
					this.save(this.selectObj)
				}
			}
		}
	}
</script>

<style>
	page {
		background: #f4f4f4;
	}

	.d-container {
		padding: 20rpx 5rpx
	}

	.thorui-padding {
		position: fixed;
		bottom: 0;
		flex-direction: column;
		width: 100%;
	}

	.container {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-default {
		padding: 20rpx 30rpx;
	}

	.tui-article {
		position: relative;
	}

	.tui-article-img {
		width: 100%;
		height: 300rpx;
		display: block;
	}

	.tui-article-title {
		position: absolute;
		left: 0;
		bottom: 0;
		color: #fff;
		font-size: 32rpx;
		font-weight: 500;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6));
	}

	/* 隐藏scroll-view滚动条*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	/*页面滑动*/

	.tui-scroll-page {
		width: 100%;
		/* height: 1500rpx; */
		/* height: 150vw; */
		/* 		box-sizing: border-box;
		position: relative;
		overflow: auto */
		/* touch-action:none; */
	}

	.tui-hover {
		background: rgba(0, 0, 0, 0.2)
	}
</style>
