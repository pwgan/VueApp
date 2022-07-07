<template>
	<view class="container">
		<view class="tui-searchbox">
			<view class="tui-search-input" @tap="search">
				<icon type="search" :size="13" color="#999"></icon>
				<text class="tui-search-text">搜索Thorui商品</text>
			</view>
		</view>
		<scroll-view scroll-y scroll-with-animation class="tab-view" :scroll-into-view="scrollViewId"
			:style="{ height: height + 'px', top: top + 'px' }">
			<view :id="`id_${index}`" v-for="(item, index) in tabbar" :key="index" class="tab-bar-item"
				:class="[currentTab == index ? 'active' : '']" :data-current="item.value" @tap.stop="swichNav">
				<text>{{ item.name }}</text>
			</view>
		</scroll-view>
		<view class="page">
			<scroll-view scroll-y class="right-box" :style="{ height: height + 'px', top: top + 'px' }">
				<view class="tui-list city-list">
					<block v-for="(list,index) in lists" :key="index" v-if="list.data[0]">
						<view class="tui-list-cell-divider" :id="list.letter">
							{{list.letter}}
						</view>
						<tui-checkbox-group>
							<tui-label v-for="(item,index2) in list.data" :key="index2" :data-name="item.EmployeeName">
								<tui-list-cell>
									<view class="thorui-align__center">
										<tui-checkbox :checked="item.Checked" :value="item.EmployeeId"
											:name="item.EmployeeName" color="#07c160" borderColor="#999"
											@change="Change">
										</tui-checkbox>
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
						</tui-checkbox-group>
					</block>
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
	export default {
		data() {
			return {
				tabbar: [{
						"name": "部门名称",
						"value": ""
					}
					// '推荐分类',
					// '进口超市',
					// '国际名牌',
					// '奢侈品',
					// '海囤全球',
					// '男装',
					// '女装',
					// '男鞋',
					// '女鞋',
					// '钟表珠宝',
					// '手机数码',
					// '电脑办公',
					// '家用电器',
					// '玩具乐器',
					// '运动户外',
					// '宠物生活',
					// '特产馆'
				],
				height: 0, //scroll-view高度
				top: 0,
				currentTab: 0, //预设当前项的值
				scrollViewId: "id_0",
				// //索引
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
				checkedList: [],
			};
		},
		onLoad: function(options) {
			setTimeout(() => {
				uni.getSystemInfo({
					success: res => {
						let header = 92;
						let top = 0;
						//#ifdef H5
						top = 44;
						//#endif
						this.height = res.windowHeight - uni.upx2px(header);
						this.top = top + uni.upx2px(header);
						let winHeight = res.windowHeight- uni.upx2px(50);
						let barHeight = winHeight - uni.upx2px(204);
						this.winHeight = winHeight;
						this.indexBarHeight = barHeight;
						this.indexBarItemHeight = barHeight / 25;
						console.log(this.top)
						this.titleHeight = this.top;
					}
				});
			}, 50);
			this.getList();
		},
		methods: {
			Change(e) {
				console.log(e)
				if (e.checked == true) {
					this.checkedList.push(e)
				} else {
					this.checkedList.some((item, i) => {
						if (item.value == e.value) {
							this.checkedList.splice(i, 1)
							return true
						}
					})
				}
			},
			confirm: function(e) {
				console.log(this.checkedList)
				this.$emit('confirm', this.checkedList);
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
			getList() {
				var that = this
				this.$request({
					url: '/Department/GetTopDepartmentList',
					method: 'GET',
					success: function(data) {
						data.data.Data.forEach(item => {
							that.tabbar.push({
								"name": item.DepartmentName,
								// "selected": false,
								"value": item.DepartmentId
							})
						})
					}
				})
			},
			// 点击标题切换当前页时改变样式
			swichNav: function(e) {
				let cur = e.currentTarget.dataset.current;
				// console.log(cur)
				if (this.currentTab == cur) {
					return false;
				} else {
					this.currentTab = cur;
					this.checkCor();
				}
				this.getContacts(cur)
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
								if (that.checkedList.length > 0) {
									that.checkedList.forEach(arr1 => {
										that.lists.forEach(arr2 => {
											if (arr2.data.length > 0) {
												arr2.data.forEach(item => {
													if (arr1.value == item
														.EmployeeId) {
														item.Checked =
															true;
														console.log(item
															.EmployeeName
														)
													}
												})
											}
										})
									})
								}
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
			// //索引点击跳转
			touchStart(e) {
				console.log(e)
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
			},
			//判断当前滚动超过一屏时，设置tab标题滚动条。
			checkCor: function() {
				if (this.currentTab > 6) {
					this.scrollViewId = `id_${this.currentTab - 2}`;
				} else {
					this.scrollViewId = `id_0`;
				}
			},
			detail(e) {
				uni.navigateTo({
					url: '/pages/index/productDetail/productDetail'
				});
			},
			productList(e) {
				let key = e.currentTarget.dataset.key;
				uni.navigateTo({
					url: '/pages/index/productList/productList?searchKey=' + key
				});
			},
			search: function() {
				uni.navigateTo({
					url: '/pages/common/search/search'
				});
			}
		}
	};
</script>

<style>
	page {
		background: #fcfcfc;
	}

	/* 左侧导航布局 start*/

	/* 隐藏scroll-view滚动条*/

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.tui-searchbox {
		width: 100%;
		height: 92rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		z-index: 100;
	}

	.tui-searchbox::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #d2d2d2;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.tui-search-input {
		width: 100%;
		height: 60rpx;
		background: #f1f1f1;
		border-radius: 30rpx;
		font-size: 26rpx;
		color: #999;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-search-text {
		padding-left: 16rpx;
	}

	.tab-view {
		/* height: 100%; */
		width: 200rpx;
		position: fixed;
		left: 0;
		z-index: 10;
	}

	.tab-bar-item {
		width: 200rpx;
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
	}

	.active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fcfcfc;
	}

	.active::before {
		content: '';
		position: absolute;
		border-left: 8rpx solid #e41f19;
		height: 30rpx;
		left: 0;
	}

	/* 左侧导航布局 end*/

	.right-box {
		width: 100%;
		position: fixed;
		padding-left: 220rpx;
		box-sizing: border-box;
		left: 0;
	}

	.page-view {
		width: 100%;
		overflow: hidden;
		padding-top: 20rpx;
		padding-right: 20rpx;
		box-sizing: border-box;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.swiper {
		width: 100%;
		height: 220rpx;
		border-radius: 12rpx;
		overflow: hidden;
		transform: translateZ(0);
	}

	/* #ifdef MP-WEIXIN */
	.swiper .wx-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	.swiper .wx-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	.swiper .wx-swiper-dot-active::before {
		background: #fff;
	}

	.swiper .wx-swiper-dot.wx-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	/* #ifndef MP-WEIXIN */
	>>>.swiper .uni-swiper-dot {
		width: 8rpx;
		height: 8rpx;
		display: inline-flex;
		background: none;
		justify-content: space-between;
	}

	>>>.swiper .uni-swiper-dot::before {
		content: '';
		flex-grow: 1;
		background: rgba(255, 255, 255, 0.8);
		border-radius: 16rpx;
		overflow: hidden;
	}

	>>>.swiper .uni-swiper-dot-active::before {
		background: #fff;
	}

	>>>.swiper .uni-swiper-dot.uni-swiper-dot-active {
		width: 16rpx;
	}

	/* #endif */

	.slide-image {
		width: 100%;
		height: 220rpx;
	}

	.class-box {
		padding-top: 30rpx;
	}

	.class-item {
		background: #fff;
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
	}

	.class-name {
		font-size: 22rpx;
	}

	.g-container {
		/* padding-top: 20rpx; */
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.g-box {
		width: 33.3333%;
		text-align: center;
		padding-top: 40rpx;
	}

	.g-image {
		width: 120rpx;
		height: 120rpx;
	}

	.g-title {
		font-size: 22rpx;
	}
</style>

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
