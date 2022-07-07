<template>
	<view>
		<view class="tui-item-flex">
			<view class="tui-item-main">
				<text style="font-weight: bold;padding-left: 10rpx;">{{applicantInfo.ProcessInstanceCode}} </text>
			</view>
			<view class="tui-btn-box" style="margin-top: 40rpx;padding-right: 10rpx;">
				<text :class="['iconfont',getStatusIcon(applicantInfo.ProcessStatus,applicantInfo.ApproveResult)]"
					:style="{color:getStatusColor(applicantInfo.ProcessStatus,applicantInfo.ApproveResult), 'font-size': '160rpx','z-index':'999'}"></text>
			</view>
		</view>
		<tui-list-view title="申请人信息">
			<tui-list-cell>
				<view class="tui-item-box">
					<text class="tui-list-cell_name">申请人</text>
					<view class="tui-right">{{applicantInfo.LauncherEmployeeName}}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell>
				<view class="tui-item-box">
					<text class="tui-list-cell_name">部门</text>
					<view class="tui-right">{{getFullDepartmentName(applicantInfo)}}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell>
				<view class="tui-item-box">
					<text class="tui-list-cell_name">申请时间</text>
					<view class="tui-right">{{applicantInfo.LaunchTime}}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell>
				<view class="tui-item-box">
					<text class="tui-list-cell_name">职务</text>
					<view class="tui-right">{{applicantInfo.LauncherJobName}}</view>
				</view>
			</tui-list-cell>
		</tui-list-view>
	</view>
</template>

<script>
	export default {
		props: {
			applicantInfo: {
				default: null,
				type: Object
			}
		},
		data() {
			return {

			}
		},
		methods: {
			getStatusIcon(processStatus, approveResult) {
				if (processStatus == 3) {
					return "iconyichexiao";
				} else if (processStatus == 1) {
					return "iconshenhezhong";
				} else if (processStatus == 4) {
					return "iconyituihui1";
				} else {
					if (approveResult == 1) {
						return "iconyitongguo";
					} else {
						return "iconyijujue";
					}
				}
			},
			getStatusColor(processStatus, approveResult) {
				if (processStatus == 3) {
					return "gray";
				} else if (processStatus == 1) {
					return "#1E9FFF";
				} else if (processStatus == 4) {
					return "#FFB800";
				} else {
					if (approveResult == 1) {
						return "green";
					} else {
						return "#fa3534";
					}
				}
			},
			getFullDepartmentName(applicantInfo) {
				let launcherDepartmentFullName = applicantInfo.LauncherDepartmentName;
				if (applicantInfo.LauncherDepartmentName2) {
					launcherDepartmentFullName += ">" + applicantInfo.LauncherDepartmentName2;
				}
				if (applicantInfo.LauncherDepartmentName3) {
					launcherDepartmentFullName += ">" + applicantInfo.LauncherDepartmentName3;
				}
				return launcherDepartmentFullName;
			}
		}
	}
</script>

<style>
	.tui-list-cell {
		padding-top: 20rpx !important;
		padding-bottom: 20rpx !important;
	}

	.tui-title {
		width: 100%;
		font-size: 28rpx;
		color: #888;
		padding: 24rpx 30rpx 20rpx;
		box-sizing: border-box;
	}

	.container {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-item-box {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.tui-list-cell_name {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-right {
		margin-left: auto;
		font-size: 26rpx;
		color: #999;
	}

	.tui-item-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100rpx;
		background-color: #FFFFFF;
	}

	.tui-item-main {
		height: 30rpx;
		display: flex;
		font-size: 25rpx;
		line-height: 86rpx;
		padding-left: 0rpx;
		align-items: center;
		width: 80%;
	}

	.tui-btn-box {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
