<template>
	<view class="container">
		<form @submit="formSubmit" @reset="formReset">
			<!-- 选择框，用于触发选择器和页面展示名称 -->
			<tui-list-cell arrow style="margin-top: 30rpx;">
				<tui-input label="所属公司" v-model="formData.CompanyName" placeholder="请选择" textRight @tap="selectCompany"
					disabled backgroundColor="transparent" :borderBottom="false" padding="0 20rpx 0 0"></tui-input>
			</tui-list-cell>
			<tui-list-cell arrow>
				<tui-input label="公章" v-model="formData.SealName" placeholder="请选择" name="SealName" @tap="selectSeal"
					disabled backgroundColor="transparent" :borderBottom="false" textRight padding="0 20rpx 0 0">
				</tui-input>
			</tui-list-cell>
			<tui-list-cell arrow style="margin-top: 30rpx;">
				<tui-input label="申请类型" v-model="formData.TypeName" placeholder="请选择" name="TypeName" @tap="selectType"
					disabled backgroundColor="transparent" :borderBottom="false" textRight padding="0 20rpx 0 0">
				</tui-input>
			</tui-list-cell>
			<tui-list-cell arrow>
				<tui-input label="用途" v-model="formData.PurposeName" placeholder="请选择" name="PurposeName"
					@tap="selectPurpose" disabled backgroundColor="transparent" :borderBottom="false" textRight
					padding="0 20rpx 0 0"></tui-input>
			</tui-list-cell>
			<tui-list-cell arrow>
				<tui-input label="开始时间" v-model="formData.BeginDate" placeholder="请选择" name="BeginDate"
					@tap="selectBeginDate" disabled backgroundColor="transparent" :borderBottom="false" textRight
					padding="0 20rpx 0 0"></tui-input>
			</tui-list-cell>
			<tui-list-cell arrow v-if="formData.Type != '2'">
				<tui-input label="结束时间" v-model="formData.EndDate" placeholder="请选择" name="EndDate" @tap="selectEndDate"
					disabled backgroundColor="transparent" :borderBottom="false" textRight padding="0 20rpx 0 0">
				</tui-input>
			</tui-list-cell>

			<!-- 单独给一个input框只是用来展示标签，实际填写内容在textarea -->
			<tui-input label="申请理由" disabled :borderBottom="false"></tui-input>
			<tui-textarea name="Remarks" placeholder="请输入" :borderTop="false" padding="0 30rpx"></tui-textarea>

			<!-- 动态明细 -->
			<view v-for="(item, index) in DetailList" class="detailList">
				<tui-row>
					<tui-col :span="12">
						<view class="tui-title">明细{{DetailList.length == 1 ? '' : (index + 1)}}</view>
					</tui-col>
					<tui-col :span="12" style="text-align: right;">
						<view class="tui-title" v-if="DetailList.length > 1" style="color: #5677fc;"
							@tap="deleteDetail(index)">删除</view>
					</tui-col>
				</tui-row>
				<tui-input label="文件名" v-model="item.FileName" placeholder="请输入" textRight></tui-input>
				<tui-input label="数量" v-model="item.Count" type="number" placeholder="请输入" textRight></tui-input>
				<tui-input label="备注" disabled :borderBottom="false"></tui-input>
				<tui-textarea v-model="item.Remarks" placeholder="请输入" :borderTop="false" padding="0 30rpx">
				</tui-textarea>
				<tui-input v-if="index + 1 == DetailList.length" padding="16rpx 30rpx" placeholder="添加明细" disabled
					@tap="addDetail()" placeholderStyle="color:#448efc;font-weight:800;font-size:26rpx">
					<template v-slot:left>
						<view class="tui-left__icon">
							<tui-icon name="add-fill" color="#577eff" size="20" style="margin-right: 10rpx;"></tui-icon>
						</view>
					</template>
				</tui-input>
			</view>

			<fileUpload ref="fileUpload" labelName="附件"></fileUpload>
			
			<!-- 将选择紧急程度和提交按钮封装于组件中 -->
			<LaunchComponent v-if="showLaunch" ref="LaunchComponent" :processObj="processObj"></LaunchComponent>

			<!-- 			<img src="D:\\OAFile\\2021_08_01\\bae659ecf0af4f809133ad7700f162f6.png" />
			<tui-input label="附件" disabled :borderBottom="false" style="margin-top: 30rpx;"></tui-input>
			<tui-upload :value="value" :serverUrl="serverUrl" :header="header" @complete="result" @remove="remove"></tui-upload> -->

			<!-- 下拉选择器确认后赋值，用于实际传值value，页面不可见 -->
			<tui-input name="CompanyId" v-model="formData.CompanyId" style="display: none;"></tui-input>
			<tui-input name="SealId" v-model="formData.SealId" style="display: none;"></tui-input>
			<tui-input name="Type" v-model="formData.Type" style="display: none;"></tui-input>
			<tui-input name="Purpose" v-model="formData.Purpose" style="display: none;"></tui-input>
		</form>
		<!-- 选择器组件 -->
		<tui-picker :show="showCompany" :pickerData="companyArray" @hide="showCompany = false" @change="changeCompany">
		</tui-picker>
		<tui-picker :show="showSeal" :pickerData="sealArray" @hide="showSeal = false" @change="changeSeal">
		</tui-picker>
		<tui-picker :show="showType" :pickerData="typeArray" @hide="showType = false" @change="changeType">
		</tui-picker>
		<tui-picker :show="showPurpose" :pickerData="purposeArray" @hide="showPurpose = false" @change="changePurpose">
		</tui-picker>
		<tui-datetime ref="BeginDate" :type="1" @confirm="changeBeginDate"></tui-datetime>
		<tui-datetime ref="EndDate" :type="1" @confirm="changeEndDate"></tui-datetime>
	</view>
</template>
<script>
	import fileUpload from '@/pages/common/FileUpload.vue'
	const commonTool = require('@/utils/commonTool.js');
	const form = require("@/components/common/tui-validation/tui-validation.js")
	export default {
		components:{
			fileUpload
		},
		data() {
			return {
				value: [],
				serverUrl: this.$baseUrl + '/File/UploadFile',
				header: {
					Authorization: 'Bearer ' + this.$token
				},

				processObj: null,
				showLaunch: false,
				formData: {
					CompanyId: '',
					CompanyName: '',
					SealId: '',
					SealName: '',
					Type: '',
					TypeName: '',
					Purpose: '',
					PurposeName: '',
					BeginDate: '',
					EndDate: ''
				},
				DetailList: [{
					FileName: '',
					Count: '',
					Remarks: ''
				}],
				showCompany: false,
				showSeal: false,
				showType: false,
				showPurpose: false,
				companyArray: [{
					text: '7M',
					value: '1'
				}, {
					text: '5C',
					value: '2'
				}, {
					text: 'IM',
					value: '3'
				}, {
					text: '九龙',
					value: '4'
				}, {
					text: '三捷',
					value: '5'
				}],
				sealArray: [],
				//定义一个数组接收所有公章选项，用于根据公司筛选公章
				initSealList: [],
				typeArray: [{
					text: '正常申请',
					value: '1'
				}, {
					text: '外出申请',
					value: '2'
				}],
				purposeArray: [{
					text: '收入证明',
					value: '1'
				}, {
					text: '其他',
					value: '2'
				}],
				rules: []
			}
		},
		onReady(){
			//创建附件DOM
			this.$refs.fileUpload.create();
		},
		async onLoad() {
			this.initSealArray()
			// uni.showLoading({
			// 	title: '加载中'
			// });
			// this.processObj = JSON.parse(decodeURIComponent(option.processObj))
			// uni.setNavigationBarTitle({
			// 	title: this.processObj.ProcessFullName
			// });
			this.processObj = await commonTool.getProcessObj(3)
			this.showLaunch = true
			uni.setNavigationBarTitle({
				title: this.processObj.ProcessFullName
			});
		},
		methods: {
			selectCompany() {
				this.showCompany = true
			},
			selectSeal() {
				this.showSeal = true
			},
			selectType() {
				this.showType = true
			},
			selectPurpose() {
				this.showPurpose = true
			},
			selectBeginDate(e) {
				this.$refs.BeginDate.show();
			},
			selectEndDate(e) {
				this.$refs.EndDate.show();
			},
			changeCompany(e) {
				this.formData.CompanyId = e.value
				this.formData.CompanyName = e.text
				if (e.value) {
					var filterArray = this.initSealList.filter(function(item) {
						if (item.CompanyId == e.value) {
							return item;
						}
					});
					this.sealArray = filterArray.length > 0 ? filterArray : [{
							text: '',
							value: ''
						}],
						this.formData.SealId = ''
					this.formData.SealName = ''
				}
			},
			changeSeal(e) {
				this.formData.SealId = e.value
				this.formData.SealName = e.text
			},
			changeType(e) {
				this.formData.Type = e.value
				this.formData.TypeName = e.text
			},
			changePurpose(e) {
				this.formData.Purpose = e.value
				this.formData.PurposeName = e.text
			},
			changeBeginDate(e) {
				this.formData.BeginDate = e.result
			},
			changeEndDate(e) {
				this.formData.EndDate = e.result
			},
			async initSealArray() {
				const arrayList = await commonTool.getPickerOptions('/OfficialSeal/GetListForSelect')
				this.sealArray = arrayList
				this.initSealList = arrayList
			},
			addDetail() {
				this.DetailList.push({
					FileName: '',
					Count: '',
					Remarks: ''
				})
			},
			deleteDetail(index) {
				this.DetailList.splice(index, 1);
			},
			result(e) {
				console.log(e)
			},
			remove(e) {
				console.log(e)
			},
			formSubmit: function(e) {
				let _this = this
				//表单规则
				let rules = [{
					name: "SealId",
					rule: ["required"], //可使用区间，此处主要测试功能
					msg: ["请选择公章"]
				}, {
					name: "Type",
					rule: ["required"],
					msg: ["请选择申请类型"]
				}, {
					name: "Purpose",
					rule: ["required"],
					msg: ["请选择用途"]
				}, {
					name: "BeginDate",
					rule: ["required"],
					msg: ["请选择开始时间"]
				}];
				//进行表单检查
				let formData = e.detail.value;
				let checkRes = form.validation(formData, rules);
				if (!checkRes) {
					if(formData.Type == '1' && !formData.EndDate){
						this.tui.toast('请选择结束时间', 1500);
						return
					}
					//明细数据封装
					formData.DetailList = _this.DetailList
					this.$refs.LaunchComponent.save(formData)
				} else {
					this.tui.toast(checkRes, 1500);
				}
			},
			formReset: function(e) {
				console.log("清空数据")
			}
		}
	}
</script>

<style scoped>
	.tui-list-cell {
		padding-top: 20rpx !important;
		padding-bottom: 20rpx !important;
	}

	.detailList>>>.tui-input__wrap {
		padding-top: 20rpx !important;
		padding-bottom: 20rpx !important;
	}
</style>
<style>
	.tui-title {
		width: 100%;
		font-size: 28rpx;
		color: #888;
		padding: 24rpx 30rpx 20rpx;
		box-sizing: border-box;
	}
</style>
