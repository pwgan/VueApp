<template>
	<view class="container">
		<tui-time-axis v-if="approveRecords.length > 0">
			<tui-timeaxis-item backgroundColor="#fafafa" v-for="(item, index) in approveRecords" :key="index">
				<template v-slot:node>
					<view v-if="item.ApproveAction == 1" class="tui-node" style="background-color: #06AD56;">
						<tui-icon name="check" color="#fff" :size="14" bold></tui-icon>
					</view>
					<view v-if="item.ApproveAction == 2" class="tui-node" style="background-color: #ff0000;">
						<tui-icon name="shut" color="#fff" :size="14" bold></tui-icon>
					</view>
					<view v-if="item.ApproveAction == 3" class="tui-node" style="background-color: #ffaa00;">
						<tui-icon name="refresh" color="#fff" :size="14" bold></tui-icon>
					</view>
					<view v-if="item.ApproveAction == 4" class="tui-node" style="background-color: #00aaff;">
						<tui-icon name="toright" color="#fff" :size="14" bold></tui-icon>
					</view>
				</template>
				<template v-slot:content>
					<view>
						<view class="tui-order-title">{{item.title}}</view>
						<view class="tui-order-desc">{{item.desc}}</view>
						<view class="tui-order-time tui-gray">{{item.time}}</view>
					</view>
				</template>
			</tui-timeaxis-item>
		</tui-time-axis>
		<view v-else style="text-align: center;color: #adadad;">
			暂无审批记录
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				approveRecords: []
			}
		},
		methods: {
			getApproveRecords(pId){
				let _this = this
				this.$request({
					url: "/ProcessInstance/GetApproveRecord?ProcessInstanceId=" + pId,
					success: function(data) {
						data.data.Data.forEach(item => {
							item.title = item.ApproverEmployeeName + '（' + item.ApproverJobName + '）'
							item.desc = '备注：' + (item.ApproveRemarks ? item.ApproveRemarks : '')
							item.time = item.ApproveTime
						})
						_this.approveRecords = data.data.Data;
					}
				})
			}
		}
	}
</script>

<style>
	.container {
		padding: 10rpx 30rpx;
		margin-bottom: 30rpx;
	}
	
	.tui-order-header {
		padding: 30rpx;
		box-sizing: border-box;
		background: #fff;
	}

	.tui-text {
		font-size: 28rpx;
		color: #333;
		padding: 4rpx;
	}

	.tui-bold {
		font-weight: bold;
	}

	.tui-node {
		height: 44rpx;
		width: 44rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		flex-shrink: 0;
	}

	.tui-node-dot {
		height: 16rpx;
		width: 16rpx;
		background-color: #ddd;
		border-radius: 50%;
		/* transform: translateY(45%); */
		margin-top: 6rpx;
	}

	.tui-bg-primary {
		background: #EB0909 !important;
	}

	.tui-order-tracking {
		padding: 30rpx 30rpx 30rpx 40rpx;
		background: #fff;
		margin-top: 20rpx;
		box-sizing: border-box;
	}

	.tui-order-title {
		padding-bottom: 12rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}

	.tui-order-desc {
		padding-bottom: 12rpx;
		font-size: 28rpx;
		color: #333;
	}

	.tui-ptop {
		display: flex;
		justify-content: flex-start;
		line-height: 28rpx;
	}

	.tui-order-time {
		font-size: 24rpx;
		font-weight: bold;
	}

	.tui-gray {
		color: #848484 !important;
	}

	.tui-light-gray {
		color: #888 !important;
	}

	.tui-primary {
		color: #5677fc;
	}
</style>
