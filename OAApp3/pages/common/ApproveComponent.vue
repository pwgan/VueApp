<template>
	<view class="container">
		<tui-radio-group name="ApproveAction" v-model="val" style="display: inline-block;width: 100%;">
			<view class="thorui-cells thorui-white__bg thorui-align__center">
				<tui-label v-for="(item,index) in actionList">
					<view class="thorui-align__center">
						<tui-radio :value="item.value"></tui-radio>
						<text class="tui-text">{{item.name}}</text>
					</view>
				</tui-label>
			</view>
		</tui-radio-group>
		<tui-input label="备注" disabled :borderBottom="false" :borderTop="true"></tui-input>
		<tui-textarea name="ApproveRemarks" placeholder="请输入审批备注" :borderTop="false" padding="0 30rpx">
		</tui-textarea>
		<view style="margin: 50rpx 40rpx 70rpx">
			<tui-button height="76rpx" formType="submit">提交</tui-button>
		</view>
		<tui-dialog :buttons="buttons" :show="showDialog" title="提示" @click="confirm">
			<template v-slot:content>
				确认同意审批吗?
			</template>
		</tui-dialog>
	</view>
</template>
<script>
	const commonTool = require('@/utils/commonTool.js');
	const form = require("@/components/common/tui-validation/tui-validation.js")
	export default {
		data() {
			return {
				val: '',
				initActions: [{
						name: '同意',
						value: '1',
						checked: false
					},
					{
						name: '拒绝',
						value: '2',
						checked: false
					},
					{
						name: '退回',
						value: '3',
						checked: false
					}
				],
				actionList: [],
				formData: null,
				applicantInfo: null,
				//确认审批弹框
				showDialog: false,
				buttons:[{
					text: '取消'
				}, {
					text: '确定',
					color: '#586c94'
				}]
			}
		},
		onLoad() {

		},
		methods: {
			resetApproveList(data) {
				var newList = []
				var list = data.split('|')
				list.forEach((arr, index) => {
					newList.push(this.initActions[index])
				})
				this.actionList = newList
			},
			submit(data, applicantInfo){
				data.ProcessInstanceId = applicantInfo.ProcessInstanceId
				this.formData = data
				this.applicantInfo = applicantInfo
				this.showDialog = true
			},
			confirm(e){
				this.showDialog = false
				if(e.index == 1){
					this.save()
				}
			},
			save(){
				let that = this
				that.$request({
					url: that.applicantInfo.BaseUrl + '/Approve',
					method: 'POST',
					data: that.formData,
					success: function(res) {
						var result = res.data
						if (result.Success) {
							uni.showToast({
								title: '审批成功',
								duration: 2000,
								icon: 'success'
							});
							setTimeout(function() {
								uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
									delta: 1
								});
							}, 500)
						} else {
							uni.showToast({
								title: result.Msg,
								duration: 2000,
								icon: 'none'
							});
						}
					}
				})
			}
		}
	}
</script>
<style>
	.container {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
<style scoped>
	.thorui-cells::after {
		border: 0 !important;
	}

	.tui-label__box {
		margin-right: 100rpx !important;
	}

	.tui-text {
		margin-left: 10rpx;
	}
</style>
