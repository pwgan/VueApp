<template>
	<view class="container">
		<view class="tui-bg-box">
			<image src="/static/images/login/bg_login.png" class="tui-bg-img"></image>
			<image src="/static/images/my/mine_def_touxiang_3x.png" class="tui-photo"></image>
			<view class="tui-login-name">集团综合管理平台</view>
		</view>
		<form :report-submit="true" @submit="formLogin">
			<view class="tui-login-from">
				<view class="tui-line-cell">
					<tui-icon name="card" :size="20" color="#6d7a87"></tui-icon>
					<input placeholder-class="tui-phcolor" class="tui-input" name="EmployeeId" placeholder="请输入工号"
						maxlength="20" :value="EmployeeId" type="number" @input="inputEmployeeId" />
					<view class="tui-icon-close" v-show="EmployeeId" @tap="clearInput(1)">
						<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
					</view>
				</view>
				<view class="tui-line-cell tui-top28">
					<tui-icon name="pwd" :size="20" color="#6d7a87"></tui-icon>
					<input placeholder-class="tui-phcolor" class="tui-input" name="Pwd" :password="true"
						placeholder="请输入密码" :value="Pwd" @input="inputPwd" />
					<view class="tui-icon-close" v-show="Pwd" @tap="clearInput(2)">
						<tui-icon name="close-fill" :size="16" color="#bfbfbf"></tui-icon>
					</view>
				</view>
				<view class="tui-btn-submit">
					<tui-button form-type="submit" :preventClick="true" :disabled="btnDisabled" :loading="btnLoading">登录
					</tui-button>
				</view>

				<!-- <button class="tui-button-primary tui-btn-submit" hover-class="tui-button-hover"
					form-type="submit">登录</button> -->
			</view>
		</form>

		<tui-footer :copyright="appVersion"></tui-footer>
	</view>
</template>

<script>
	const util = require('@/utils/util.js');
	const commonTool = require('@/utils/commonTool.js');
	const form = require('@/components/common/tui-validation/tui-validation.js');
	import jsencrypt from '@/libs/jsencrypt/jsencrypt.vue';
	// #ifdef H5
	import Vue from 'vue'
	// #endif
	export default {
		data() {
			return {
				EmployeeId: '',
				Pwd: '',
				btnDisabled: true,
				btnLoading: false,
				appVersion: '版本号:' + this.$appVersion
			};
		},
		onLoad() {
			if (this.$userInfo.hasOwnProperty('EmployeeId')) {
				this.EmployeeId = this.$userInfo.EmployeeId;
			}
		},
		methods: {
			formLogin: async function(e) {
				try {
					
					this.setBtnDisable();

					let employeeId = e.detail.value.EmployeeId;
					let pwd = e.detail.value.Pwd;

					// #ifdef H5
					let info = ''
					// #endif
					// #ifdef APP-PLUS
					let info = uni.getSystemInfoSync().deviceId;
					// #endif

					//验证规则
					let rules = [{
							name: 'EmployeeId',
							rule: ['required', 'isNum'],
							msg: ['请输入工号', '工号必须是数字']
						},
						{
							name: 'Pwd',
							rule: ['required'],
							msg: ['密码不能为空']
						}
					];

					let formData = {
						EmployeeId: employeeId,
						Pwd: pwd,
						Appversion: this.$appVersion,
						ClientAppId: info
					}
					let checkRes = form.validation(formData, rules);
					if (checkRes) {
						this.tui.toast(checkRes);
						this.setBtnEnable();
						return;
					}

					//加密处理
					var result = await this.$requestSync({
						url: '/Employee/GetPublicKey',
					});

					var encryptKeyData = result.data.Data;
					formData.Pwd = jsencrypt.setEncrypt(encryptKeyData.Key, formData.Pwd + encryptKeyData.Date);
					console.log(formData.Pwd);

					this.$request({
						url: '/Employee/Login',
						method: "POST",
						data: formData,
						success: (res) => {
							var result = res.data
							if (result.Success) {
								// 设置Token、员工基本
								Vue.prototype.$token = result.Data.Token;
								Vue.prototype.$userInfo = result.Data.UserInfo;
								uni.setStorageSync('token', result.Data.Token);
								uni.setStorageSync('userInfo', JSON.stringify(result
									.Data.UserInfo));

								this.$request({
									url: "/UserPersonalConfig/Get?UserId=" +
										result.Data.UserInfo.EmployeeId,
									success: (res) => {
										var data = res.data.Data
											.PersonalConfig;
										if (data != undefined) {
											Vue.prototype.$personalConfig =
												data;
											uni.setStorageSync(
												'personalConfig', JSON
												.stringify(data));
										}
									},
									fail: (res) => {
										this.setBtnEnable();
									}
								});
								this.tui.toast('登录成功', 1500, true);
								// 跳转到首页
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/common/index/Home'
									});
								}, 300)
							} else {
								this.setBtnEnable();
								this.tui.toast(result.Msg, 1500);
							}
						},
						fail: (res) => {
							this.setBtnEnable();
						}
					});
				} catch (e) {
					this.setBtnEnable();
				}
			},
			btnCanClick: function() {
				if (this.EmployeeId && this.Pwd) {
					this.btnDisabled = false;
				} else {
					this.btnDisabled = true;
				}
			},
			inputEmployeeId: function(e) {
				this.EmployeeId = e.detail.value;
				this.btnCanClick();
			},
			inputPwd: function(e) {
				this.Pwd = e.detail.value;
				this.btnCanClick();
			},
			clearInput(type) {
				if (type == 1) {
					this.EmployeeId = '';
				} else {
					this.Pwd = '';
				}
				this.btnCanClick();
			},
			setBtnDisable: function() {
				this.btnDisabled = true;
				this.btnLoading = true;
			},
			setBtnEnable: function() {
				this.btnDisabled = false;
				this.btnLoading = false;
			}
		}
	};
</script>

<style>
	page {
		background-color: #fff;
	}

	.tui-bg-box {
		width: 100%;
		box-sizing: border-box;
		position: relative;
		padding-top: 44rpx;
	}

	.tui-photo {
		height: 138rpx;
		width: 138rpx;
		display: block;
		margin: 10rpx auto 0 auto;
		border-radius: 50%;
		position: relative;
		z-index: 2;
	}

	.tui-login-name {
		/* width: 128rpx; */
		height: 40rpx;
		font-size: 50rpx;
		color: #fff;
		margin: 36rpx auto 0 auto;
		text-align: center;
		position: relative;
		z-index: 2;
	}

	.tui-bg-img {
		width: 100%;
		height: 346rpx;
		display: block;
		position: absolute;
		top: 0;
	}

	.tui-login-from {
		width: 100%;
		padding: 128rpx 104rpx 0 104rpx;
		box-sizing: border-box;
	}

	.tui-input {
		font-size: 32rpx;
		flex: 1;
		display: inline-block;
		padding-left: 32rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tui-line-cell {
		padding: 27rpx 0;
		display: -webkit-flex;
		display: flex;
		-webkiit-align-items: center;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
	}

	.tui-line-cell::after {
		content: '';
		position: absolute;
		border-bottom: 1rpx solid #e0e0e0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		bottom: 0;
		right: 0;
		left: 0;
	}

	.tui-top28 {
		margin-top: 28rpx;
	}

	.tui-btn-class {
		width: 196rpx !important;
		height: 54rpx !important;
		border-radius: 27rpx !important;
		font-size: 28rpx !important;
		padding: 0 !important;
		line-height: 54rpx !important;
	}

	.tui-btn-submit {
		margin-top: 100rpx;
	}
</style>
