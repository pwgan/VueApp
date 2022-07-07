<template>
	<!-- 审批条件查询公共页面 -->
	<view class="container">
		<scroll-view class="tui-drawer-scroll" scroll-y :style="{ height: drawerH + 'px' }">
			<view class="tui-drawer-title">
				<text class="tui-title-bold">流程单号</text>
			</view>
			<view class="tui-drawer-content">
				<input v-model="formData.ProcessInstanceCode" placeholder-class="tui-phcolor" class="tui-input"
					placeholder="请输入" maxlength="30" />
			</view>

			<view class="tui-drawer-title">
				<text class="tui-title-bold">发起人工号</text>
			</view>
			<view class="tui-drawer-content">
				<input v-model="formData.EmployeeId" placeholder-class="tui-phcolor" class="tui-input" placeholder="请输入"
					maxlength="20" type="number" />
			</view>

			<view class="tui-drawer-title">
				<text class="tui-title-bold">发起人姓名</text>
			</view>
			<view class="tui-drawer-content">
				<input v-model="formData.EmployeeName" placeholder-class="tui-phcolor" class="tui-input"
					placeholder="请输入" maxlength="20" />
			</view>

			<view class="tui-drawer-title">
				<text class="tui-title-bold">开始时间</text>
			</view>
			<view class="tui-drawer-content" @tap="selectBeginDate">
				<input v-model="formData.BeginDate" placeholder-class="tui-phcolor" class="tui-input" placeholder="请选择"
					disabled />
			</view>

			<view class="tui-drawer-title">
				<text class="tui-title-bold">结束时间</text>
			</view>
			<view class="tui-drawer-content" @tap="selectEndDate">
				<input v-model="formData.EndDate" placeholder-class="tui-phcolor" class="tui-input" placeholder="请选择"
					disabled />
			</view>

			<view class="tui-drawer-title" @tap="showTabs">
				<text class="tui-title-bold">流程类型</text>
				<view class="tui-all-box tui-icon-ml" v-if="!tabsVisible">
					<view class="tui-attr-right" v-if="!formData.ProcessId">全部</view>
					<view class="tui-attr-right" style="color: red;" v-else>{{formData.ProcessName}}</view>
					<tui-icon name="arrowdown" :size="14" color="#444"></tui-icon>
				</view>
				<view class="tui-all-box tui-icon-ml" v-else>
					<view class="tui-attr-right" style="color: red;" v-if="formData.ProcessId">
						{{formData.ProcessName}}
					</view>
					<tui-icon name="arrowup" :size="14" color="#444"></tui-icon>
				</view>
			</view>
			<tui-row v-if="tabsVisible">
				<tui-col :span="12" v-for="(item,index) in navbar">
					<view @tap="selectItem(item, index)">
						<view
							:class="formData.ProcessId == item.Value?'tui-attr-item tui-btmItem-active':'tui-attr-item'"
							style="font-size: 26rpx;">
							<view class="tui-attr-ellipsis">{{item.Name}}</view>
						</view>
					</view>
				</tui-col>
			</tui-row>

		</scroll-view>
		<view class="tui-attr-btnbox">
			<view class="tui-attr-safearea">
				<view class="tui-drawer-btn tui-drawerbtn-black" hover-class="tui-white-hover" :hover-stay-time="150"
					@tap="resetData">重置
				</view>
				<view class="tui-drawer-btn tui-drawerbtn-primary" hover-class="tui-red-hover" :hover-stay-time="150"
					@tap="confirmData">确定</view>
			</view>
		</view>

		<tui-datetime ref="beginDate" :type="1" @confirm="changeBeginDate" @cancel="closeBeginDate"></tui-datetime>
		<tui-datetime ref="endDate" :type="1" @confirm="changeEndDate" @cancel="closeEndDate">
		</tui-datetime>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				height: 64, //header高度
				drawerH: 0, //抽屉内部scrollview高度
				tabsVisible: false, //全部流程类型可见
				selectTypeIndex: -1, //选中类型标签的index
				navbar: [], //接受所有的流程类型
				formData: {
					ProcessInstanceCode: '',
					EmployeeId: null,
					EmployeeName: '',
					BeginDate: null,
					EndDate: null,
					ProcessId: 0,
					ProcessName: ''
				},
				showBeginDate: false,
				showEndDate: false
			}
		},
		onLoad(option) {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif
			uni.getSystemInfo({
				success: res => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? obj.top + obj.height + 8 : res.statusBarHeight + 44;
					this.drawerH = res.windowHeight - uni.upx2px(100) - this.height + 30;
				}
			});
			let model = JSON.parse(decodeURIComponent(option.formData))
			console.log(model)
			this.bindFormData(model)
			this.getProcessList()
			this._freshing = false
		},
		methods: {
			//绑定数据
			bindFormData(model){
				if(model.ProcessInstanceCode){
					this.formData.ProcessInstanceCode = model.ProcessInstanceCode
				}
				if(model.EmployeeId){
					this.formData.EmployeeId = model.EmployeeId
				}
				if(model.EmployeeName){
					this.formData.EmployeeName = model.EmployeeName
				}
				if(model.BeginDate){
					this.formData.BeginDate = model.BeginDate
				}
				if(model.EndDate){
					this.formData.EndDate = model.EndDate
				}
				if(model.ProcessId){
					this.formData.ProcessId = model.ProcessId
				}
				if(model.ProcessName){
					this.formData.ProcessName = model.ProcessName
				}
			},
			//显示（或隐藏）全部类型
			showTabs() {
				this.tabsVisible = !this.tabsVisible
			},
			//选中某个流程
			selectItem(item, index) {
				if (this.formData.ProcessId && this.formData.ProcessId == item.Value) {
					this.formData.ProcessName = ''
					this.formData.ProcessId = ''
				} else {
					this.formData.ProcessName = item.Name
					this.formData.ProcessId = item.Value
				}
			},
			//隐藏时间控件
			closeBeginDate() {
				this.showBeginDate = false
			},
			closeEndDate() {
				this.showEndDate = false
			},
			//选中时间控件
			changeBeginDate(e) {
				this.formData.BeginDate = e.result
			},
			changeEndDate(e) {
				this.formData.EndDate = e.result
			},
			//显示时间控件
			selectBeginDate(e) {
				this.$refs.beginDate.show();
			},
			selectEndDate(e) {
				this.$refs.endDate.show();
			},
			//获取所有流程类型
			getProcessList() {
				let that = this
				this.$request({
					url: "/ProcessDefine/GetProcessNameList",
					success: function(res) {
						let result = res.data
						if(result.Success){
							that.navbar = result.Data
						}
					}
				})
			},
			//确定
			confirmData() {
				let that = this
				let pages = getCurrentPages() // 获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面。
				let nowPage = pages[pages.length - 1] //当前页页面实例
				let prevPage = pages[pages.length - 2] //上一页页面实例
				prevPage.$vm.queryList(that.formData) // 給上一頁綁定方法otherFun,傳參object
				uni.navigateBack({
					delta: 1 // 可以不傳delta值，默認為1
				})
			},
			//重置
			resetData() {
				let that = this
				that.formData = {
					ProcessInstanceCode: '',
					EmployeeId: null,
					EmployeeName: '',
					BeginDate: null,
					EndDate: null,
					ProcessId: 0,
					ProcessName: ''
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}

	.container {
		padding-bottom: env(safe-area-inset-bottom);
	}

	/* 隐藏scroll-view滚动条*/

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.tui-header {
		z-index: 999 !important;
	}

	.tui-header-box {
		width: 100%;
		background: #fff;
		position: fixed;
		z-index: 1001;
		left: 0;
		top: 0;
	}

	/* 	.tui-header {
		display: flex;
		align-items: flex-start;
	} */

	.tui-back {
		margin-left: 8rpx;
		height: 32px !important;
		width: 32px !important;
	}

	/* 	.tui-searchbox {
		width: 100%;
		height: 30px;
		margin-right: 30rpx;
		border-radius: 15px;
		font-size: 12px;
		background: #f7f7f7;
		padding: 3px 10px;
		box-sizing: border-box;
		color: #999;
		display: flex;
		align-items: center;
		overflow: hidden;
	} */

	/* #ifdef MP */
	.tui-search-mr {
		margin-right: 20rpx !important;
	}

	/* #endif */

	.tui-search-text {
		padding-left: 16rpx;
	}

	/* 	.tui-search-key {
		max-width: 80%;
		height: 100%;
		padding: 0 16rpx;
		margin-left: 12rpx;
		display: flex;
		align-items: center;
		border-radius: 15px;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
	}

	.tui-key-text {
		box-sizing: border-box;
		padding-right: 12rpx;
		font-size: 12px;
		line-height: 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	} */

	/*screen*/

	/* 	.tui-header-screen {
		width: 100%;
		box-sizing: border-box;
		background: #fff;
		position: fixed;
		z-index: 1000;
	}

	.tui-screen-top,
	.tui-screen-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
		color: #333;
	} */

	/* 	.tui-screen-top {
		height: 88rpx;
		position: relative;
		background: #fff;
	}

	.tui-top-item {
		height: 28rpx;
		line-height: 28rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-topitem-active {
		color: #e41f19;
	} */

	/* 	.tui-screen-bottom {
		height: 100rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		align-items: center;
		overflow: hidden;
	}

	.tui-bottom-text {
		line-height: 26rpx;
		max-width: 82%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	} */

	/* 	.tui-bottom-item {
		flex: 1;
		width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 12rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		margin-right: 20rpx;
		white-space: nowrap;
		height: 60rpx;
		border-radius: 40rpx;
	}

	.tui-bottom-item:last-child {
		margin-right: 0;
	} */

	.tui-btmItem-active {
		background-color: #fcedea !important;
		color: #e41f19;
		font-weight: bold;
		position: relative;
	}

	.tui-btmItem-active::after {
		content: '';
		position: absolute;
		border: 1rpx solid #e41f19;
		width: 100%;
		height: 100%;
		border-radius: 40rpx;
		left: 0;
		top: 0;
	}

	/* 	.tui-btmItem-tap {
		position: relative;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.tui-btmItem-tap::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 22rpx;
		background: #f7f7f7;
		left: 0;
		top: 58rpx;
	} */

	.tui-bold {
		font-weight: bold;
	}

	.tui-active {
		color: #e41f19;
	}

	.tui-addr-left {
		padding-left: 6rpx;
	}

	.tui-seizeaseat-20 {
		height: 20rpx;
	}

	.tui-seizeaseat-30 {
		height: 30rpx;
	}

	/*screen*/

	/*顶部下拉选择 属性*/

	/* 	.tui-scroll-box {
		width: 100%;
		height: 480rpx;
		box-sizing: border-box;
		position: relative;
		z-index: 99;
		color: #fff;
		font-size: 30rpx;
		word-break: break-all;
	}

	.tui-drop-item {
		color: #333;
		height: 80rpx;
		font-size: 28rpx;
		padding: 20rpx 40rpx 20rpx 40rpx;
		box-sizing: border-box;
		display: inline-block;
		width: 50%;
	} */

	/* 	.tui-drop-btnbox {
		width: 100%;
		height: 100rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		display: flex;
	}

	.tui-drop-btn {
		width: 50%;
		font-size: 32rpx;
		text-align: center;
		height: 100rpx;
		line-height: 100rpx;
		border: 0;
	} */

	.tui-btn-red {
		background: #e41f19;
		color: #fff;
	}

	.tui-red-hover {
		background: #c51a15 !important;
		color: #e5e5e5;
	}

	.tui-btn-white {
		background: #fff;
		color: #333;
	}

	.tui-white-hover {
		background: #e5e5e5;
		color: #2e2e2e;
	}

	/*顶部下拉选择 属性*/

	/*顶部下拉选择 综合*/

	/* 	.tui-dropdownlist {
		width: 100%;
		position: absolute;
		background-color: #fff;
		border-bottom-left-radius: 24rpx;
		border-bottom-right-radius: 24rpx;
		overflow: hidden;
		box-sizing: border-box;
		padding-top: 10rpx;
		padding-bottom: 26rpx;
		left: 0;
		top: 88rpx;
		visibility: hidden;
		transition: all 0.2s ease-in-out;
		z-index: 999;
	}

	.tui-dropdownlist-show {
		visibility: visible;
	} */

	/* 	.tui-dropdownlist-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: -1;
		transition: all 0.2s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	} */

	/* 	.tui-dropdownlist-item {
		color: #333;
		height: 70rpx;
		font-size: 28rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	} */

	/*顶部下拉选择 综合*/

	.tui-drawer-box {
		width: 686rpx;
		font-size: 24rpx;
		overflow: hidden;
		position: relative;
		padding-top: 30rpx !important;
		/* padding-bottom: 50rpx; */
	}

	.tui-drawer-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 80rpx;
	}

	.tui-title-bold {
		font-size: 26rpx;
		font-weight: bold;
		flex-shrink: 0;
	}

	.tui-location {
		margin-right: 6rpx;
	}

	.tui-attr-right {
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: right;
		font-size: 26rpx;
	}

	.tui-all-box {
		width: 90%;
		white-space: nowrap;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.tui-drawer-content {
		padding: 16rpx 30rpx 30rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.tui-input {
		border: 0;
		height: 64rpx;
		border-radius: 32rpx;
		width: 100%;
		background-color: #f7f7f7;
		text-align: center;
		font-size: 24rpx;
		color: #333;
	}

	/* 	.tui-phcolor {
		text-align: center;
		color: #b2b2b2;
		font-size: 24rpx;
	} */

	.tui-flex-attr {
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.tui-attr-item {
		width: 90%;
		text-align: center;
		height: 64rpx;
		background-color: #f7f7f7;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4rpx;
		box-sizing: border-box;
		border-radius: 32rpx;
		margin-left: 5%;
		margin-right: 3%;
		margin-top: 7%;
	}

	.tui-attr-item:nth-of-type(3n) {
		margin-right: 0%;
	}

	.tui-attr-btnbox {
		width: 100%;
		/* position: absolute; */
		border-top: 1px solid #e8e8e8;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		padding: 0 30rpx;
		background: #fff;
	}

	.tui-attr-safearea {
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: env(safe-area-inset-bottom);
		vertical-align: middle;
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-attr-btnbox::before {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		border-top: 1px solid #eaeef1;
		transform: scaleY(0.5) translateZ(0);
		transform-origin: 0 0;
	}

	.tui-drawer-btn {
		width: 47%;
		text-align: center;
		height: 60rpx;
		border-radius: 30rpx;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.tui-drawerbtn-black {
		border: 1rpx solid #555;
	}

	.tui-drawerbtn-primary {
		background: #e41f19;
		color: #fff;
	}

	/* 商品列表*/

	/* 	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	.tui-product-container {
		flex: 1;
		margin-right: 10rpx;
	}

	.tui-product-container:last-child {
		margin-right: 0;
	}

	.tui-pro-item {
		width: 100%;
		margin-bottom: 10rpx;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
		transition: all 0.15s ease-in-out;
	}

	.tui-flex-list {
		display: flex;
		margin-bottom: 1rpx !important;
	} */

	/* 	.tui-pro-img {
		width: 100%;
		display: block;
	}

	.tui-proimg-list {
		width: 260rpx;
		height: 260rpx !important;
		flex-shrink: 0;
		border-radius: 12rpx;
	}

	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.tui-pro-tit {
		color: #2e2e2e;
		font-size: 26rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}

	.tui-pro-price {
		padding-top: 18rpx;
	} */

	/* 	.tui-sale-price {
		font-size: 34rpx;
		font-weight: 500;
		color: #e41f19;
	}

	.tui-factory-price {
		font-size: 24rpx;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}

	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 24rpx;
		color: #656565;
	} */

	/* 商品列表*/
</style>
