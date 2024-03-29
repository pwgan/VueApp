<template>
	<view class="tui-pagination__box">
		<view class="tui-pagination__btn" :class="{'tui-pagination__disabled':currentIndex === 1}"
			:style="{width:width+'rpx',height:height+'rpx',borderColor:borderColor,backgroundColor:backgroundColor,borderRadius:radius}"
			hover-class="tui-pagination__hover" :hover-stay-time="120" @click="clickPrev">
			<text :style="{color:color,fontSize:size+'rpx'}" v-if="!custom">{{prevText}}</text>
			<slot name="prev"></slot>
		</view>
		<view class="tui-pagination__num" v-if="isPage">
			<text :style="{color:currentColor,fontSize:pageFontSize+'rpx'}">{{currentIndex}}</text>
			<text :style="{color:pageColor,fontSize:pageFontSize+'rpx'}">/{{maxPage || 0}}</text>
		</view>
		<view class="tui-pagination__btn" :class="{'tui-pagination__disabled':currentIndex === maxPage}"
			:style="{width:width+'rpx',height:height+'rpx',borderColor:borderColor,backgroundColor:backgroundColor,borderRadius:radius}"
			hover-class="tui-pagination__hover" :hover-stay-time="120" @click="clickNext">
			<text :style="{color:color,fontSize:size+'rpx'}" v-if="!custom">{{nextText}}</text>
			<slot name="next"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tui-pagination",
		props: {
			prevText: {
				type: String,
				default: '上一页'
			},
			nextText: {
				type: String,
				default: '下一页'
			},
			width: {
				type: Number,
				default: 156
			},
			height: {
				type: Number,
				default: 68
			},
			borderColor: {
				type: String,
				default: 'transparent'
			},
			backgroundColor: {
				type: String,
				default: '#fff'
			},
			color: {
				type: String,
				default: '#333'
			},
			size: {
				type: [Number, String],
				default: 28
			},
			radius: {
				type: String,
				default: '8rpx'
			},
			//是否自定义按钮显示内容
			custom: {
				type: Boolean,
				default:false
			},
			//当前页码
			current: {
				type: [Number, String],
				default: 1
			},
			//当前页码字体颜色
			currentColor: {
				type: String,
				default: '#5677fc'
			},
			//页码字体颜色
			pageColor: {
				type: String,
				default: '#333'
			},
			//页码字体大小
			pageFontSize: {
				type: [Number, String],
				default: 36
			},
			//是否需要展示页码
			isPage: {
				type: Boolean,
				default: true
			},
			//数据总量
			total: {
				type: [Number, String],
				default: 0
			},
			//每页数据量
			pageSize: {
				type: [Number, String],
				default: 10
			}
		},
		computed: {
			maxPage() {
				let maxPage = 1
				let total = Number(this.total)
				let pageSize = Number(this.pageSize)
				if (total && pageSize) {
					maxPage = Math.ceil(total / pageSize)
				}
				return maxPage
			}
		},
		watch: {
			current(val) {
				this.currentIndex = +val
			}
		},
		created() {
			this.currentIndex = +this.current
		},
		data() {
			return {
				currentIndex: 1
			};
		},
		methods: {
			clickPrev() {
				if (Number(this.currentIndex) === 1) return;
				this.currentIndex -= 1
				this.change('prev')
			},
			clickNext() {
				if (Number(this.currentIndex) === this.maxPage) return;
				this.currentIndex += 1
				this.change('next')
			},
			change(e) {
				this.$emit('change', {
					type: e,
					current: this.currentIndex
				})
			}
		}
	}
</script>

<style scoped>
	.tui-pagination__box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		position: relative;
		overflow: hidden;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.tui-pagination__btn {
		/* #ifndef APP-NVUE */
		display: flex;
		box-sizing: border-box;
		/* #endif */
		position: relative;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		border-width: 1rpx;
		border-style: solid;
		flex-shrink: 0;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.tui-pagination__hover {
		opacity: 0.5;
	}

	.uni-pagination__num {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.tui-pagination__disabled {
		opacity: 0.3;
		/* #ifdef H5 */
		cursor: not-allowed;
		/* #endif */
	}
</style>
