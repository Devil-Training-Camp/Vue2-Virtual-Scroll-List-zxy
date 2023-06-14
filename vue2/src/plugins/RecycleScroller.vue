<template>
  <div class="wrapper" ref="wrapper" @scroll.passive="wrapperScrollFn">
    <div :style="blankFillStyle">
      <div v-for="(item, index) in visibleData" :key="index">
        <slot :data="item" />
      </div>
      <div v-if="isRequest" class="loading">
        {{ loadingText }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RecycleScroller',
  data() {
    return {
      listData: [], // 列表数据
      page: 1,
      maxCount: 0, // 视口可显示数据条数
      startIndex: 0, // 记录滚动后顶部item的index
      isRequest: false, // 网络较慢时显示文案优化交互
      currentScrollTop: 0 // 滚动条位置
    }
  },
  props: {
    url: { // 请求url
      type: String,
      required: true
    },
    rowHeight: { // 行高
      type: Number,
      default: 50
    },
    pageSize: { // 每次请求数据条数
      type: Number,
      default: 20
    },
    loadingText: {
      default: '加载数据中...'
    }
  },
  mounted() {
    this.getData(this.page, this.pageSize)
    this.calMaxCount()
  },
  activited() { // 路由切换定位列表滚动位置
    this.$nextTick(() => {
      this.$refs.wrapper.scrollTop = this.currentScrollTop
    })
  },
  computed: {
    endIndex() { // 记录滚动后底部item的index
      let endIndex = this.maxCount * 2 + this.startIndex // 底部缓冲一屏数据
      if(!this.listData[endIndex]){
        endIndex = this.listData.length
      }
      return endIndex
    },
    visibleData() { // 视口数据
      let startIndex = 0 // 顶部缓冲一屏数据
      if(this.startIndex <= this.maxCount) {
        startIndex = 0
      } else {
        startIndex = this.startIndex - this.maxCount
      }
      return this.listData.slice(startIndex, this.endIndex)
    },
    blankFillStyle() {
      let startIndex = 0
      if(this.startIndex <= this.maxCount) {
        startIndex = 0
      } else {
        startIndex = this.startIndex - this.maxCount
      }
      return {
        paddingTop: startIndex * this.rowHeight + 'px',
        paddingBottom: (this.listData.length - this.endIndex) * this.rowHeight + 'px'
      }
    }
  },
  methods: {
    async getData(page, pageSize) { // 生成数据
      this.isRequest = true
      const res = await axios.get(this.url + `?page=${page}&pageSize=${pageSize}`)
      if(res.status === 200) {
        this.listData.push(...res.data)
        this.page ++
        this.isRequest = false
      }
    },
    calMaxCount() { // 计算视口可显示数据条数
      this.maxCount = Math.ceil(this.$refs.wrapper.clientHeight / this.rowHeight) + 1
    },
    wrapperScrollFn() { // 滚动事件
      // 使用requestAnimationFrame请求动画帧实现节流效果
      let requestAnimationFrame = window.requestAnimationFrame
      let fps = 30
      let interval = 1000 / fps
      let then = Date.now()
      requestAnimationFrame(() => {
        let now = Date.now()
        this.setDataStartIndex()
        if(now - then >= interval) {
          then = now
          requestAnimationFrame(arguments.callee)
        }
      })
    },
    setDataStartIndex() { // 设置startIndex
      if(this.isRequest) return
      const { scrollTop } = this.$refs.wrapper
      this.currentScrollTop = scrollTop
      this.startIndex = Math.floor(scrollTop / this.rowHeight)
      if(this.startIndex + this.maxCount > this.listData.length - 1) {
        this.getData(this.page, this.pageSize)
      }
    }
  }
}
</script>

<style scoped>
.wrapper{
  height: 100%;
  overflow: auto;
}
.loading{
  text-align: center;
}
</style>