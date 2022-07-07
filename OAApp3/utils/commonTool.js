/**
 * 数据处理
 * @author echo.
 * @version 1.5.0
 **/
import Vue from 'vue'
const commonTool = {
	selectPage: function(ProcessId, PId, Type) {
		let pageUrl = ''
		let pageType = Type == 'ReLaunch' ? 'ReLaunch' : 'Approve'
		switch (ProcessId) {
			case 1:
				pageUrl = '/pages/LeaveAskProcess/' + pageType
				break
			case 2:
				pageUrl = '/pages/CarAskProcess/' + pageType
				break
			case 3:
				pageUrl = '/pages/OfficialSealAskProcess/' + pageType
				break
			case 4:
				pageUrl = '/pages/MeetingsAskProcess/' + pageType
				break
			case 5:
				pageUrl = '/pages/EgressAskProcess/' + pageType
				break
			case 6:
				pageUrl = '/pages/BusinessTravelAskProcess/' + pageType
				break
			case 7:
				pageUrl = '/pages/LendMoneyAskProcess/' + pageType
				break
			case 8:
				pageUrl = '/pages/FreightCharges/' + pageType
				break
			case 9:
				pageUrl = '/pages/AgentLeaveAskProcess/' + pageType
				break
			case 10:
				pageUrl = '/pages/OvertimeAskProcess/' + pageType
				break
			case 11:
				pageUrl = '/pages/ReimbursementAskProcess/' + pageType
				break
			case 12:
				pageUrl = '/pages/RequisitionAskProcess/' + pageType
				break
			case 13:
				pageUrl = '/pages/CertificateAskProcess/' + pageType
				break
			case 14:
				pageUrl = '/pages/PerformanceAuditAskProcess/' + pageType
				break
			case 15:
				pageUrl = '/pages/OffTimeAskProcess/' + pageType
				break
			case 16:
				pageUrl = '/pages/MonitoringViewAskProcess/' + pageType
				break
			case 17:
				pageUrl = '/pages/PunchAskProcess/' + pageType
				break
			case 18:
				pageUrl = '/pages/SAPUItems/' + pageType
				break
			case 19:
				pageUrl = '/pages/SAPRequisition/' + pageType
				break
			case 21:
				pageUrl = '/pages/AssetRequisitioAskProcess/' + pageType
				break
			case 22:
				pageUrl = '/pages/LowConsumableRequisitionsAskProcess/' + pageType
				break
			case 23:
				pageUrl = '/pages/USAPPurchaseOrderAskProcess/' + pageType
				break
			case 24:
				pageUrl = '/pages/USAPProductTreeAddAsk/' + pageType
				break
			case 25:
				pageUrl = '/pages/IMGeneralASKProcess/' + pageType
				break
			case 26:
				pageUrl = '/pages/ComputerNeedsAskProcess/' + pageType
				break
			case 27:
				pageUrl = '/pages/SocialSecurityFundAskProcess/' + pageType
				break
			case 28:
				pageUrl = '/pages/AssetTransferAskProcess/' + pageType
				break
			case 30:
				pageUrl = '/pages/AssetHandleAskProcess/' + pageType
				break
			case 31:
				pageUrl = '/pages/EquipmentAcceptanceAskProcess/' + pageType
				break
			case 32:
				pageUrl = '/pages/IMRequisitionAskProcess/' + pageType
				break
			case 33:
				pageUrl = '/pages/USAPProductTreeUpdateAsk/' + pageType
				break
			case 34:
				pageUrl = '/pages/USAPCustomerAddAskProcess/' + pageType
				break
			case 35:
				pageUrl = '/pages/USAPPurchaseOrderServiceAskProcess/' + pageType
				break
			case 36:
				pageUrl = '/pages/USAPSupplierAddAskProcess/' + pageType
				break
			case 37:
				pageUrl = '/pages/ProvidentFundAskProcess/' + pageType
				break
			case 38:
				pageUrl = '/pages/VisitorsAskProcess/' + pageType
				break
			case 39:
				pageUrl = '/pages/USAPRequisitionServiceAskProcess/' + pageType
				break
			case 40:
				pageUrl = '/pages/MaterialInStorageAskProcess/' + pageType
				break
			case 41:
				pageUrl = '/pages/MaterialOutStorageAskProcess/' + pageType
				break
			case 42:
				pageUrl = '/pages/USAPSporadicMaterialAskProcess/' + pageType
				break
			case 43:
				pageUrl = '/pages/RegularWorkerBecomeAskProcess/' + pageType
				break
			case 44:
				pageUrl = '/pages/DimissionAskProcess/' + pageType
				break
			case 45:
				pageUrl = '/pages/RecruitmentAskProcess/' + pageType
				break
			case 46:
				pageUrl = '/pages/JobExchangeAskProcess/' + pageType
				break
			case 47:
				pageUrl = '/pages/IMFinishedProductsAskProcess/' + pageType
				break
			default:
				uni.showToast({
					title: '暂未开放，请前往pc端进行审批',
					duration: 1500,
					icon: 'none'
				});
				break
		}
		let url = pageUrl + '?Pid=' + PId
		if (Type != '' && Type != null && Type != undefined) {
			url = url + '&type=' + Type
		}
		return url;
	},
	//获取客户端ID
	getClientId() {
		//获取客户端ID和版本号
		var clientid = '';
		var storageClientId = uni.getStorageSync('clientid')
		if (storageClientId) {
			clientid = storageClientId
		} else {
			// #ifdef APP-PLUS
			switch (uni.getSystemInfoSync().platform) {
				case 'android':
					plus.device.getAAID({
						success: function(e) {
							clientid = e.aaid;
							console.log(clientid);
							uni.setStorageSync('clientid', clientid);
						},
						fail: function(e) {
							console.log(e);
						}
					});
					break;
				case 'ios':
					plus.device.getInfo({
						success: function(e) {
							clientid = e.uuid;
							uni.setStorageSync('clientid', clientid);
						},
						fail: function(e) {
							console.log(e);
						}
					});
					break;
				default:
					break;
			}
			if (!clientid) {
				clientid = plus.device.uuid;
				uni.setStorageSync('clientid', clientid);
			}
			// #endif
		}
		return clientid;
	},
	//动态获取下拉框的选项
	getPickerOptions(url) {
		return new Promise((resolve, reject) => {
			if(url){
				Vue.prototype.$request({
					url: url,
					success: function(res) {
						var result = res.data
						if (result.Success) {
							let list = result.Data
							result.Data.forEach(arr => {
								arr.text = arr.Name
								arr.value = String(arr.Value)
							})
							resolve(result.Data)
						}
					}
				})
			}
		})
	},
	//获取流程相关信息
	getProcessObj(processId){
		return new Promise((resolve, reject) => {
			Vue.prototype.$request({
				url: '/ProcessDefine/Get?ProcessId=' + processId,
				success: function(res) {
					var result = res.data
					if (result.Success) {
						resolve(result.Data)
					}
				}
			})
		})
	}
}

module.exports = {
	selectPage: commonTool.selectPage,
	getClientId: commonTool.getClientId,
	getPickerOptions: commonTool.getPickerOptions,
	getProcessObj: commonTool.getProcessObj
}
