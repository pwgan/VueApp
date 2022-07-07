<template>
	<view>
		<!--header-->
		<view class="container">
			<view class="tui-header">
				<view class="tui-header-bottom">
					<view class="tui-bottom-item" :class="[proDropIndex==0?'tui-btmItem-active':'']"
						@tap="btnDropChange(0)">
						<view class="tui-bottom-text" :class="[proDropIndex==0?'tui-active':'']">部门</view>
						<tui-icon :name="proDropIndex==0?'arrowup':'arrowdown'" :size="14"
							:color="proDropIndex==0?'#5677fc':'#444'"></tui-icon>
					</view>
				</view>
			</view>
			<tui-top-dropdown :show="dropShow" :paddingbtm="110" :translatey="216" @close="btnCloseDrop">
				<scroll-view class="tui-scroll-box" scroll-y scroll-with-animation :scroll-top="scrollTop">
					<view class="tui-seizeaseat-20"></view>
					<view class="tui-drop-item" :class="[item.selected?'tui-bold':'']"
						v-for="(item,index) in proDropData" :key="index" @tap.stop="btnSelected" :data-index="index">
						<tui-icon name="check" :size="16" color="#5677fc" :bold="true" v-if="item.selected"></tui-icon>
						<text class="tui-ml tui-middle">{{item.name}}</text>
					</view>
					<view class="tui-seizeaseat-30"></view>
				</scroll-view>
				<view class="tui-drop-btnbox">
					<view class="tui-drop-btn tui-button-white" hover-class="tui-button-white_hover"
						:hover-stay-time="150" @tap="reset">重置</view>
					<view class="tui-drop-btn tui-button-primary" hover-class="tui-button-hover" :hover-stay-time="150"
						@tap="btnCloseDrop">确定</view>
				</view>
			</tui-top-dropdown>
		</view>
		</br>
		</br></br></br>
		<view class="page">
			<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{height:winHeight+'px'}">
				<view class="search-bar">
					<view class="search-bar-form">
						<view class="search-bar-box">
							<icon class="icon-search-in-box" type="search" :size="16"></icon>
							<input confirm-type="search" class="search-bar-input" placeholder="请输入姓名或工号"
								placeholder-class="phcolor" :value="inputVal" @input="inputTyping"
								@confirm="searchEmployee" />
							<icon type="clear" :size="15" v-if="inputShowed" @tap="clearInput"></icon>
						</view>
					</view>
					<tui-button width="120rpx" height="58rpx" :size="24" shape="circle" @click="searchEmployee">搜索
					</tui-button>
				</view>
				<view class="tui-list search-result" v-if="inputShowed">
					<tui-radio-group>
						<tui-label v-for="(item,index) in searchResult"
						:key="index" @tap="selectEmployee" :data-name="item" :hover-stay-time='150'>
							<tui-list-cell>
								<view class="thorui-align__center">
									<tui-radio :checked="item.checked" :value="item.EmployeeId" color="#07c160"
										borderColor="#999" @change="Change">
									</tui-radio>
									<view class="tui-list-cell-navigate">
										<view class="content">
											<view class="title">{{item.EmployeeName}}</view>
											<view class="sub-title">{{item.EmployeeId}}</view>
										</view>
									</view>
								</view>
							</tui-list-cell>
						</tui-label>
					</tui-radio-group>
<!-- 					<view class="tui-list-cell" hover-class="tui-list-cell-hover" v-for="(item,index) in searchResult"
						:key="index" @tap="selectEmployee" :data-name="item" :hover-stay-time='150'>
						<tui-radio-group>
							<tui-list-cell>
								<view class="thorui-align__center">
									<tui-radio :checked="item.checked" :value="item.EmployeeId" color="#07c160"
										borderColor="#999" @change="Change">
									</tui-radio>
									<view class="tui-list-cell-navigate">
										<view class="content">
											<view class="title">{{item.EmployeeName}}</view>
											<view class="sub-title">{{item.EmployeeId}}</view>
										</view>
									</view>
								</view>
							</tui-list-cell>
						</tui-radio-group>
					</view> -->
				</view>
				<view v-if="!inputShowed">
					<view class="tui-list city-list">
						<tui-radio-group>
							<block v-for="(list,index) in lists" :key="index" v-if="list.data[0]">
								<view class="tui-list-cell-divider" :id="list.letter">
									{{list.letter}}
								</view>
								<tui-label v-for="(item,index2) in list.data" :key="index2"
									:data-name="item.EmployeeName" :hover-stay-time='150'>
									<tui-list-cell>
										<view class="thorui-align__center">
											<tui-radio :checked="item.checked" :value="item.EmployeeId" color="#07c160"
												borderColor="#999" @change="Change">
											</tui-radio>
											<view class="tui-list-cell-navigate"
												:class="[list.data.length-1==index2?'last':'']">
												<view class="content">
													<view class="title">{{item.EmployeeName}}</view>
													<view class="sub-title">{{item.EmployeeId}}</view>
												</view>
											</view>
										</view>
									</tui-list-cell>
								</tui-label>
							</block>
						</tui-radio-group>
					</view>
				</view>
			</scroll-view>
			<view class="tui-indexed-list-bar" :style="{height:indexBarHeight+'px'}" @touchstart="touchStart"
				@touchmove.stop="touchMove" @touchend.stop="touchEnd" @touchcancel.stop="touchCancel"
				v-if="!inputShowed">
				<text v-for="(items,index)  in lists" :key="index" class="tui-indexed-list-text"
					:style="{height:indexBarItemHeight+'px'}">
					{{items.letter=="well"?"#":items.letter}}
				</text>
			</view>
			<view class="tui-indexed-list-alert" v-if="touchmove && lists[touchmoveIndex].letter">
				{{lists[touchmoveIndex].letter=="well"?"#":lists[touchmoveIndex].letter}}
			</view>
		</view>
	</view>
</template>

<script>
	const cityData = require('@/utils/index.list.js')
	export default {
		data() {
			return {
				//下拉框选择
				proDropList: [],
				department: [],
				proDropData: [],
				proDropIndex: -1,
				dropShow: false,
				scrollTop: 0,
				dropdownShow: false,
				popupShow: false,
				//索引
				lists: [],
				touchmove: false, // 是否在索引表上滑动
				touchmoveIndex: -1,
				titleHeight: 0, // A字距离窗口顶部的高度
				indexBarHeight: 0, // 索引表高度
				indexBarItemHeight: 0, // 索引表子项的高度
				scrollViewId: '', // scroll-view滚动到的子元素的id
				winHeight: 0,
				inputShowed: false, // 输入框是否显示
				inputVal: '', // 搜索框输入的内容
				searchResult: [], // 搜索结果
				checkedData: []
			}
		},
		onLoad() {
			this.getList();
			const that = this;
			//获取手机分辨率设置页面样式
			uni.getSystemInfo({
				success: function(res) {
					let winHeight = res.windowHeight;
					let barHeight = winHeight - uni.upx2px(204);
					that.winHeight = winHeight;
					that.indexBarHeight = barHeight;
					that.indexBarItemHeight = barHeight / 25;
					that.titleHeight = uni.upx2px(128);
				}
			})
		},
		methods: {
			Change(e) {
				if (e.checked == true) {
					this.checkedData = e
				} else {
					this.checkedData = null
				}
			},
			//下拉查询
			btnDropChange(index) {
				this.proDropIndex = index;
				this.dropShow = true;
				this.dropdownShow = false
			},
			btnSelected: function(e) {
				this.reset();
				let index = e.currentTarget.dataset.index;
				let obj = this.proDropData[index];
				this.$set(obj, 'selected', !obj.selected)
			},
			reset() {
				let arr = this.proDropData;
				for (let item of arr) {
					item.selected = false;
				}
				this.proDropData = arr
			},
			btnCloseDrop() {
				this.scrollTop = 1;
				this.$nextTick(() => {
					this.scrollTop = 0
				});
				this.dropShow = false;
				this.proDropIndex = -1;
				let arr = this.proDropData;
				for (let item of arr) {
					if (item.selected == true) {
						this.getContacts(item.value)
					}
				}
			},
			//获取所有1级部门
			getList() {
				var that = this
				this.$request({
					url: '/Department/GetTopDepartmentList',
					method: 'GET',
					success: function(data) {
						data.data.Data.forEach(item => {
							that.department.push({
								"name": item.DepartmentName,
								"selected": false,
								"value": item.DepartmentId
							})
						})
						that.proDropData = that.department;
					}
				})
			},
			//根据部门ID获取所有员工
			getContacts(departmentId) {
				const that = this;
				const model = {
					PageIndex: 1,
					PageSize: 500,
					directDepartmentId: departmentId,
					IsEnable: 1,
					IsDelete: 0
				};
				this.$request({
					url: '/Employee/SelectPeopleForApp',
					method: 'GET',
					data: model,
					success: function(data) {
						uni.getSystemInfo({
							success: function(res) {
								that.lists = data.data.Data;
								// console.log(that.lists)
								console.log(that.checkedData)
								if (that.checkedData.length > 0) {
									that.checkedData.forEach(arr1 => {
										that.lists.forEach(arr2 => {
											if (arr2.data.length > 0) {
												arr2.data.forEach(item => {
													if (arr1.value == item
														.EmployeeId) {
														item.Checked =
															true;
													}
												})
											}
										})
									})
								}
								// that.$forceUpdate();

							},
						})
					}
				})
			},
			clearInput() {
				this.inputVal = "";
				this.inputShowed = false;
				this.searchResult = [];
				uni.hideKeyboard() //强行隐藏键盘
			},
			inputTyping(e) {
				this.inputVal = e.detail.value
			},
			//搜索员工
			searchEmployee() {
				if (!this.inputVal) {
					this.tui.toast("请输入姓名或工号")
					return
				}
				let result = []
				this.$request({
					url: '/Employee/SelectPeopleForAppByIdOrName?iDOrName=' + this.inputVal,
					method: 'GET',
					success: function(data) {
						data.data.Data.forEach((item, index) => {
							result.push({
								EmployeeName: item.EmployeeName,
								EmployeeId: item.EmployeeId
							})
						})
					}
				})
				this.inputShowed = true;
				this.searchResult = result;
			},
			// 选择员工
			selectEmployee(e) {
				//返回并刷新上一页面
			},
			//索引点击跳转
			touchStart(e) {
				this.touchmove = true
				let pageY = e.touches[0].pageY
				let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight)
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchMove(e) {
				let pageY = e.touches[0].pageY;
				let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight)
				let item = this.lists[index]
				if (item) {
					this.scrollViewId = item.letter;
					this.touchmoveIndex = index;
				}
			},
			touchEnd() {
				this.touchmove = false;
				this.touchmoveIndex = -1
			},
			touchCancel() {
				this.touchmove = false;
				this.touchmoveIndex = -1
			}
		}
	}
</script>

<style>
	/* 隐藏scroll-view滚动条*/
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	/*header*/
	.tui-header {
		width: 100%;
		/* padding-top: 34rpx; */
		/* box-shadow: 0 15rpx 10rpx -15rpx #f2f2f2; */
		box-sizing: border-box;
		background-color: #fff;
		position: fixed;
		z-index: 1000;
	}

	.tui-header-top,
	.tui-header-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 26rpx;
		color: #333;
	}

	.tui-top-item {
		height: 26rpx;
		line-height: 26rpx;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-topitem-active {
		position: relative;
		font-weight: bold;
	}

	.tui-topitem-active::after {
		content: '';
		position: absolute;
		width: 44rpx;
		height: 6rpx;
		background: #5677fc;
		border-radius: 6rpx;
		bottom: -10rpx;
		left: 50%;
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
	}

	.tui-price-arrow {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 20rpx;
	}

	.tui-bottom-item .tui-icon-class,
	.tui-screen .tui-icon-class {
		margin-left: 6rpx;
	}

	.tui-icon-box {
		line-height: 12px !important;
		padding: 0 !important;
		display: block !important;
		position: relative;
	}

	.tui-arrow-up {
		top: 5px;
	}

	.tui-arrow-down {
		top: -3px;
	}

	.tui-header-bottom {
		margin-top: 56rpx;
		height: 108rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		align-items: flex-start;
		overflow: hidden;
	}

	.tui-bottom-text {
		line-height: 24rpx;
	}

	.tui-bottom-item {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 18rpx 12rpx;
		border-radius: 40rpx;
		box-sizing: border-box;
		background: #f2f2f2;
		margin-right: 20rpx;
		white-space: nowrap;
	}

	.tui-bottom-item:last-child {
		margin-right: 0;
	}

	.tui-btmItem-active {
		padding-bottom: 60rpx;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-active {
		color: #5677fc;
	}

	.tui-ml {
		margin-left: 6rpx;
	}

	.tui-seizeaseat-20 {
		height: 20rpx;
	}

	.tui-seizeaseat-30 {
		height: 30rpx;
	}

	.tui-middle {
		vertical-align: middle;
	}

	.tui-drop-item .tui-icon-class {
		vertical-align: middle;
	}

	/*header*/

	/*header 下拉选择*/

	.tui-scroll-box {
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
	}

	.tui-drop-btnbox {
		width: 100%;
		height: 100rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		box-sizing: border-box;
		display: flex;
	}

	.tui-drop-btn {
		width: 50% !important;
		border-radius: 0 !important;
		font-size: 32rpx !important;
		text-align: center;
		height: 100rpx;
		line-height: 100rpx;
		border: 0;
	}


	/*header 下拉选择*/

	.top-dropdown {
		margin-top: 360rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
	}

	.tui-share-box {
		padding: 0 50rpx;
		box-sizing: border-box;
	}

	.tui-drop-input-box {
		padding: 50rpx;
		box-sizing: border-box;
	}

	.tui-animation {
		display: inline-block;
		transform: rotate(0deg);
		transition: all 0.2s;
	}

	.tui-animation-show {
		transform: rotate(180deg);
	}

	.tui-selected-list {
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		transform: translateZ(0);
	}

	.tui-dropdown-scroll {
		height: 400rpx;
	}

	.tui-cell-class {
		display: flex;
		align-items: center;
		padding: 26rpx 30rpx !important;
	}

	.tui-ml-20 {
		margin-left: 20rpx;
	}

	.tui-share {
		background: #e8e8e8;
		position: relative;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-share-title {
		font-size: 26rpx;
		color: #7E7E7E;
		text-align: center;
		line-height: 26rpx;
		padding: 20rpx 0 50rpx 0;
	}

	.tui-share-top,
	.tui-share-bottom {
		min-width: 101%;
		padding: 0 20rpx 0 30rpx;
		white-space: nowrap;
	}

	.tui-mt {
		margin-top: 30rpx;
		padding-bottom: 150rpx;
	}

	.tui-share-item {
		width: 126rpx;
		display: inline-block;
		margin-right: 24rpx;
		text-align: center;
	}

	.tui-item-last {
		margin: 0;
	}

	.tui-empty {
		display: inline-block;
		width: 30rpx;
		visibility: hidden;
	}

	.tui-share-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fafafa;
		height: 126rpx;
		width: 126rpx;
		border-radius: 32rpx;
	}

	.tui-share-text {
		font-size: 24rpx;
		color: #7E7E7E;
		line-height: 24rpx;
		padding: 20rpx 0;
		white-space: nowrap;
	}

	.tui-btn-cancle {
		width: 100%;
		height: 100rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		background: #f6f6f6;
		font-size: 36rpx;
		color: #3e3e3e;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-hover {
		background: rgba(0, 0, 0, 0.2)
	}

	page {
		height: 100%;
		overflow: hidden;
	}

	.page {
		height: 100%;
		overflow: hidden;
	}

	.scrollList {
		flex: 1;
	}

	.search-bar {
		display: flex;
		align-items: center;
		position: relative;
		padding: 30rpx 30rpx 30rpx;
		background-color: #fff;
		/* box-shadow: 0 2px 2px #ccc;*/
	}

	.search-bar-form {
		flex: 1;
		position: relative;
		border-radius: 32rpx;
		background: #f2f5f7;
		margin-right: 20rpx;
	}

	.search-bar-box {
		display: flex;
		align-items: center;
		position: relative;
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 64rpx;
		z-index: 1;
	}

	.search-bar-input {
		line-height: normal;
		width: 100%;
		padding-left: 20rpx;
		font-size: 30rpx;
		color: #333;
		background: #f2f5f7;
	}

	.phcolor {
		font-size: 30rpx;
	}


	.icon-search {
		position: relative;
		height: 26rpx;
		margin-right: 20rpx;
		font-size: inherit;
	}

	.cancel-btn {
		padding-left: 30rpx;
	}

	.btn-primary {
		height: 62rpx;
		width: 122rpx;
		font-size: 30rpx;
		line-height: 62rpx;
		margin-left: 30rpx;
	}

	.search-result::before {
		display: none;
	}

	.search-result::after {
		display: none;
	}

	.tui-list-cell {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.tui-list-cell-hover {
		background-color: #eee !important;
	}

	.tui-list-cell-navigate {
		width: 100%;
		position: relative;
		padding: 25rpx 0 25rpx 30rpx;
		font-size: 28rpx;
		color: #333;
		display: flex;
		align-items: center;
	}

	.tui-list-cell-navigate::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #eaeef1;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 150rpx;
	}

	.img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.content {
		width: 80%;
		padding-left: 30rpx;
	}

	.title {
		width: 400rpx;
		font-size: 34rpx;
		padding-bottom: 10rpx;
		color: #333;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis
	}

	.sub-title {
		width: 100%;
		color: #7A7A7A;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 28rpx;
	}

	.tui-list {
		background-color: #fff;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-list-cell-divider {
		height: 66rpx;
		padding-left: 30rpx;
		font-size: 26rpx;
		color: #999;
		background: #f2f5f7;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
	}

	.tui-indexed-list-bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		z-index: 9999;
		position: absolute;
		top: 200rpx;
		right: 0;
		padding-right: 10rpx;
		width: 44rpx;
	}

	.tui-indexed-list-text {
		font-size: 22rpx;
	}

	.tui-indexed-list-bar.active {
		background-color: rgb(200, 200, 200);
	}

	.tui-indexed-list-alert {
		position: absolute;
		z-index: 20;
		width: 120rpx;
		height: 120rpx;
		right: 90rpx;
		top: 50%;
		margin-top: -60rpx;
		border-radius: 16rpx;
		text-align: center;
		line-height: 120rpx;
		font-size: 50rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
