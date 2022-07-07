<template>
	<view class="container">
		<LauncherInfo :applicantInfo="applicantInfo" v-if="showApplicant"></LauncherInfo>
		<tui-list-view title="公章申请">
			<tui-list-cell>
				<view class="tui-item-box">
					<text class="tui-list-cell_name">公章名称</text>
					<view class="tui-right">{{formData.OfficialSeal}}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell>
				<view class="tui-item-box">
					<text class="tui-list-cell_name">申请状态</text>
					<view class="tui-right">{{formData.StatusName}}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell>
				<view class="tui-item-box">
					<text class="tui-list-cell_name">借用时间</text>
					<view class="tui-right">{{formData.BeginDate}}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell>
				<view class="tui-item-box">
					<text class="tui-list-cell_name">归还时间</text>
					<view class="tui-right">{{formData.EndDate}}</view>
				</view>
			</tui-list-cell>
			<tui-list-cell :unlined="true">申请理由</tui-list-cell>
			<tui-textarea :placeholder="formData.Remarks" :borderTop="false" :borderBottom="false" padding="0 30rpx" disabled>
			</tui-textarea>
		</tui-list-view>
		<tui-list-view title="申请明细">
			<!-- 为了实现table的横向滑动，需要加两个<tui-table>标签，其他页面使用时需要将整个<view>标签复制过去 -->
			<view class="tui-table__container">
				<tui-table :borderLeft="false">
					<tui-tr>
						<tui-td :backgroundColor="index == 0 ? '#f8fcff' : '#fff'" :top="index == 0"
							:hidden="index != 0" :shrink="false" bold v-for="(item, index) in tableHeader" :key="index"
							:span="item.span">
							{{ item.title }}
						</tui-td>
					</tui-tr>
					<tui-tr v-for="(item, index) in formData.DetailList" :key="index">
						<tui-td :top="idx == 0" :hidden="idx != 0" :backgroundColor="idx == 0 ? '#f8fcff' : '#fff'"
							:shrink="false" :span="obj.span" v-for="(obj, idx) in tableHeader" :key="idx">
							{{ item[obj.key] }}
						</tui-td>
					</tui-tr>
				</tui-table>
				<scroll-view scroll-x class="tui-table__scroll">
					<tui-table :borderLeft="false">
						<tui-tr>
							<tui-td backgroundColor="#fff" :shrink="false" :hidden="index == 0" bold
								v-for="(item, index) in tableHeader" :key="index" :span="item.span">{{ item.title }}
							</tui-td>
						</tui-tr>
						<tui-tr v-for="(item, index) in formData.DetailList" :key="index">
							<tui-td backgroundColor="#fff" :shrink="false" :hidden="idx == 0" :span="obj.span"
								v-for="(obj, idx) in tableHeader" :key="idx">{{ item[obj.key] }}</tui-td>
						</tui-tr>
					</tui-table>
				</scroll-view>
			</view>
		</tui-list-view>
		<tui-list-view title="审批记录" unlined="all">
			<ApproveRecord ref="ApproveRecord"></ApproveRecord>
		</tui-list-view>
		<form @submit="formSubmit" v-if="showApproveComponent">
			<tui-list-view title="审批">
				<!-- 如果审批时有数据需要进行提交，将内容放在此注释与组件中间 -->
				<ApproveComponent ref="ApproveComponent"></ApproveComponent>
			</tui-list-view>
		</form>
	</view>
</template>
<script>
	const commonTool = require('@/utils/commonTool.js');
	const form = require("@/components/common/tui-validation/tui-validation.js")
	export default {
		data() {
			return {
				//公共变量，用于组件
				formData: '',
				applicantInfo: '',
				approveRecords: [],
				showApplicant: false,
				showApproveComponent: false,
				//表头，span参数为占据的栅栏格数，如总计大于24，表格会支持左右滑动
				tableHeader: [{
						title: '序号',
						key: 'SerialNumber',
						span: 4
					},
					{
						title: '文件名',
						key: 'FileName',
						span: 8
					},
					{
						title: '数量',
						key: 'Count',
						span: 4
					},
					{
						title: '备注',
						key: 'Remarks',
						span: 12
					}
				]
			}
		},
		onLoad(option) {
			this.applicantInfo = JSON.parse(decodeURIComponent(option.applicantInfo))
			this.getFormData(this.applicantInfo)
			uni.setNavigationBarTitle({
				title: this.applicantInfo.ProcessFullName + '审批'
			});
		},
		methods: {
			getFormData(obj) {
				let _this = this
				_this.applicantInfo = obj;
				_this.showApplicant = true
				// 获取表单信息
				this.$request({
					url: _this.applicantInfo.BaseUrl + "/Get?ProcessInstanceId=" + _this.applicantInfo.ProcessInstanceId,
					success: function(data) {
						_this.formData = data.data.Data;
					}
				})
				// 加载审批记录
				_this.$nextTick(function(){
					_this.$refs.ApproveRecord.getApproveRecords(_this.applicantInfo.ProcessInstanceId)
				})
				//如果审批流程还未结束，展示审批组件
				if(!_this.applicantInfo.HasApproved){
					_this.showApproveComponent = true
					_this.$nextTick(function(){
						// 动态获取审批动作
						_this.$refs.ApproveComponent.resetApproveList(_this.applicantInfo.CurrentApproveActions)
					})
				}
			},
			formSubmit(e){
				let data = e.detail.value
				// 封装所有数据后再调审批组件的提交方法
				this.$refs.ApproveComponent.submit(data, this.applicantInfo)
			}
		}
	}
</script>
<style>
	.tui-list-cell {
		padding-top: 20rpx !important;
		padding-bottom: 20rpx !important;
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

	.tui-table__container {
		width: 100%;
		overflow-x: hidden;
		position: relative;
	}

	.tui-table__scroll {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
	}
</style>
