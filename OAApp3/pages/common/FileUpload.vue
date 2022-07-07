<template>
	<view style="width: 100%;">
		<view class="tui-item-flex" style="height:80rpx;">
			<view class="tui-title" style="padding: 35rpx;">
				{{labelName}}
			</view>
			<view class="tui-btn-box">
				<lsjUpload ref="lsjUpload" @input="onInput" width="100rpx" height="50rpx" @callback="onCallback">
					<tui-button type="green" shape="circle" width="100rpx" height="50rpx" :size="24" style="margin-left: -15rpx;">选择</tui-button>
				</lsjUpload>
			</view>
		</view>
		<tui-list-view>
			<tui-list-cell v-for="(item, i) in filelist" :key="i" :arrow="false">
				<view class="tui-item-flex">
					<view class="tui-item-main">
						<tui-badge type="gray">{{i+1}}</tui-badge>
						<tui-overflow-hidden :lineClamp="1" size="25" @click="showAll(i)">
							{{item.FileName + item.FileExtension}}
						</tui-overflow-hidden>
					</view>
					<view class="tui-btn-box">
						<tui-icon name="close" :size="16" color="red" @tap="deleteFile(i)"></tui-icon>
					</view>
				</view>
			</tui-list-cell>
		</tui-list-view>

		<tui-loading :text="percent" v-show="loadShow"></tui-loading>
		<tui-dialog :buttons="buttons" :show="fullNameDialogShow" title="文件全名" @click="closeDialog">
			<template v-slot:content>
				{{fullName}}
			</template>
		</tui-dialog>
	</view>

</template>

<script>
	import lsjUpload from '@/components/lsj-upload/components/lsj-upload/lsj-upload.vue'
	export default {
		name: "fileUpload",
		components: {
			lsjUpload
		},
		props: {
			labelName: {
				type: String,
				default: "附件类型名称"
			}
		},
		data() {
			return {
				filelist: [],
				percent: "上传中1%",
				loadShow: false,
				fullNameDialogShow:false,
				fullName:'',
				buttons:[ {
					text: '确定',
					color: '#EB0909'
				}]
			}
		},
		onReady() {
			this.create();
		},
		methods: {
			create() {
				console.log("创建附件上传DOM")
				// 初始化参数并创建上传DOM			
				this.$refs.lsjUpload.create({
					// #ifdef APP-PLUS
					cuWebview: this.$mp.page.$getAppWebview(), // app必传
					// #endif
					url: this.$baseUrl + '/File/UploadFile', //替换为你的接口地址
					name: 'file', // 附件key
					size: 10, // 附件上传大小上限(M)，默认10M
					debug: true,
					header: {
						'Authorization': 'Bearer ' + this.$token
					},
				});
			},
			onInput(e) {
				console.log('上传进度', e);
				this.percent = `上传中${e}%`;
				if (this.loadShow == false) {
					this.loadShow = true;
				}
			},
			onCallback(e) {
				this.loadShow = false;
				this.percent = "上传中1%";
				if (e.success) {
					let returnData = JSON.parse(e.responseText);
					if (returnData.Success) {
						this.filelist.push({
							FileName: returnData.Data.FileName,
							FilePath: returnData.Data.FilePath,
							FileExtension: returnData.Data.FileExtension
						})
					} else {
						uni.showToast({
							title: returnData.Msg,
							icon: "none"
						});
					}

				} else {
					uni.showToast({
						title: "网络出错",
						icon: "none"
					});
				}

			}, // 删除已上传的文件
			deleteFile(i) {
				this.filelist.splice(i, 1);
			},
			showAll(i)
			{
				let item =this.filelist[i];				
				this.fullName=item.FileName + item.FileExtension;
				this.fullNameDialogShow=true;
			},
			closeDialog(){
				this.fullNameDialogShow=false;
			},
			// 返回文件列表信息
			getFileList(typeFirst, typeFirstName, typeSecond, typeSecondName, typeThird, typeThirdName) {
				this.filelist.forEach((item) => {
					if (typeFirst) {
						item.BusinessTypeFirst = typeFirst;
					}
					if (typeFirstName) {
						item.BusinessTypeFirstName = typeFirstName;
					}
					if (typeSecond) {
						item.BusinessTypeSecond = typeSecond;
					}
					if (typeSecondName) {
						item.BusinessTypeSecondName = typeSecondName;
					}
					if (typeThird) {
						item.BusinessTypeThird = typeThird;
					}
					if (typeThirdName) {
						item.BusinessTypeThirdName = typeThirdName;
					}
				});
				return this.filelist;
			}
		}

	}
</script>

<style>
	.ttitle {
		height: 50rpx;
		font-size: 24rpx;
		display: flex;
		align-items: center;
		justify-content: left;
	}

	.fileName {
		margin-left: 10rpx;
		word-break: break-all;
	}

	.tui-item-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
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
<style>
	.tui-title {
		width: 100%;
		font-size: 28rpx;
		color: #888;
		padding: 24rpx 30rpx 20rpx;
		box-sizing: border-box;
	}
</style>