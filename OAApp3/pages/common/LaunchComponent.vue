<template>
	<view style="margin-right: 0;">
		<tui-list-cell v-if="processObj.UrgencyLevelCanSelect" arrow style="margin-top: 30rpx;">
			<tui-input label="紧急程度" v-model="formData.UrgencyLevelName" placeholder="请选择" textRight
				name="UrgencyLevelName" @tap="selectUrgencyLeve" disabled backgroundColor="transparent"
				:borderBottom="false" padding="0 20rpx 0 0"></tui-input>
		</tui-list-cell>
		<view style="margin: 50rpx 40rpx 70rpx">
			<tui-button height="76rpx" formType="submit">提交</tui-button>
		</view>
		<tui-input name="UrgencyLevel" v-model="formData.UrgencyLevel" v-if="processObj.UrgencyLevelCanSelect" style="display: none;"></tui-input>
		<tui-picker :show="showUrgencyLeve" :pickerData="urgencyLevelArray" @hide="showUrgencyLeve = false"
			@change="changeUrgencyLeve">
		</tui-picker>
	</view>
</template>

<script>
	export default {
		props: {
			// 流程相关信息实例
			processObj: {
				default: null,
				type: Object
			}
			// childrenExist: {
			// 	default: false,
			// 	type: Boolean
			// }
		},
		data() {
			return {
				showUrgencyLeve: false,
				formData: {
					UrgencyLevel: '',
					UrgencyLevelName: ''
				},
				urgencyLevelArray: [{
					text: '一般',
					value: '1'
				}, {
					text: '急',
					value: '2'
				}, {
					text: '紧急',
					value: '3'
				}]
			}
		},
		methods: {
			selectUrgencyLeve() {
				this.showUrgencyLeve = true
			},
			changeUrgencyLeve(e) {
				this.formData.UrgencyLevel = e.value
				this.formData.UrgencyLevelName = e.text
			},
			// 提交
			save(data) {
				let _this = this
				this.$request({
					url: _this.processObj.BaseUrl + '/Launch',
					method: 'POST',
					data: data,
					success: function(res) {
						var result = res.data
						if (result.Success) {
							uni.showToast({
								title: '提交成功',
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

<style scoped>
	.tui-list-cell {
		padding-top: 20rpx !important;
		padding-bottom: 20rpx !important;
	}
</style>
