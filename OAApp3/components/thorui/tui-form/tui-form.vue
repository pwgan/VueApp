<template>
	<view class="tui-form__box" :style="{backgroundColor:backgroundColor,padding:padding,borderRadius:radius}">
		<slot></slot>
		<view class="tui-form__errmsg"
			:style="{top:tipTop+'px',padding:tipPadding,backgroundColor:tipBackgroundColor,fontSize:tipSize+'rpx',color:tipColor,borderRadius:tipRidus}"
			v-if="showMessage" :class="{'tui-message__show':errorMsg}">{{errorMsg}}</view>
		<view class="tui-form__mask" v-if="disabled"></view>
	</view>
</template>

<script>
	const form = require("./tui-validation.js")
	export default {
		name: "tui-form",
		props: {
			//表单数据对象
			model: {
				type: Object,
				default () {
					return {}
				}
			},
			//表单验证规则
			rules: {
				type: Array,
				default () {
					return []
				}
			},
			//表单背景颜色
			backgroundColor: {
				type: String,
				default: 'transparent'
			},
			//表单padding值
			padding: {
				type: String,
				default: '0'
			},
			//是否显示校验错误信息
			showMessage: {
				type: Boolean,
				default: true
			},
			//表单圆角值
			radius: {
				type: String,
				default: '0'
			},
			//是否禁用该表单内的所有组件,透明遮罩层
			disabled: {
				type: Boolean,
				default: false
			},
			//提示框top值 px
			tipTop: {
				type: Number
					// #ifdef H5
					,
				default: 44
					// #endif
					// #ifndef H5
					,
				default: 0
				// #endif
			},
			//错误提示框padding值
			tipPadding: {
				type: String,
				default: '20rpx'
			},
			//错误提示框背景色
			tipBackgroundColor: {
				type: String,
				default: '#f74d54'
			},
			//错误提示字体大小
			tipSize: {
				type: Number,
				default: 28
			},
			//错误提示字体颜色
			tipColor: {
				type: String,
				default: '#fff'
			},
			//错误提示框圆角值
			tipRidus: {
				type: String,
				default: '12rpx'
			},
			//错误消息显示时间 ms
			duration: {
				type: Number,
				default: 2000
			}
		},
		data() {
			return {
				errorMsg: '',
				timer: null
			};
		},
		beforeDestroy() {
			this.clearTimer()
		},
		methods: {
			clearTimer() {
				clearTimeout(this.timer)
				this.timer = null;
			},
			validate() {
				return new Promise((resolve, reject) => {
					let checkRes = form.validation(this.model, this.rules);
					let obj = {
						isPass: true,
						errorMsg: checkRes
					};
					if (!checkRes) {
						resolve(obj)
					} else {
						if (this.showMessage) {
							this.clearTimer()
							this.errorMsg = checkRes;
							this.timer = setTimeout(() => {
								this.errorMsg = ''
							}, this.duration)
						}
						obj.isPass = false;
						reject(obj)
					}
				})
			}
		}
	}
</script>

<style scoped>
	.tui-form__box {
		width: 100%;
		box-sizing: border-box;
		position: relative;
	}

	.tui-form__errmsg {
		position: fixed;
		z-index: 990;
		left: 20rpx;
		right: 20rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		word-break: break-all;
		opacity: 0;
		transform: translateZ(0) translateY(-100%);
		transition: all 0.25s ease-in-out;
	}

	.tui-message__show {
		transform: translateZ(0) translateY(0);
		opacity: 1;
	}

	.tui-form__mask {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		background-color: transparent;
		z-index: 99;
	}
</style>
