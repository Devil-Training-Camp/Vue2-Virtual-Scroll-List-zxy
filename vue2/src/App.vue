<template>
  <div id="app">
    <div class="wrapper" ref="wrapperRef" @scroll.passive="wrapperScrollFn">
      <div :style="blankFillStyle">
        <div class="item" v-for="item in currentList" :key="item">
          第{{ item + 1 }}个
        </div>
        <div class="item" v-if="isRequest">
          加载中...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      list: [], // 
      rowHeight: 50, // 行高
      maxCount: 0, // 视口可展示最大数量
      startIndex: 0, // 记录视口中开始的index
      page: 1, // 请求页码
      isRequest: false // 是否请求中
    }
  },
  mounted() {
    let newList = this.getList(this.page, 2000) // 获取首次渲染数据
    this.list = newList
    this.calcCount() // 计算视口可展示数量 
  },
  computed: {
    endIndex() { // 记录视口中结束的index
      let endIndex = this.startIndex + this.maxCount
      if(!this.list[endIndex]) {
        endIndex = this.list.length
      }
      return endIndex
    },
    currentList() { // 获取需要展示在视口数据
      return this.list.slice(this.startIndex, this.endIndex)
    },
    blankFillStyle() { // 动态设置上下空白占位
      return {
        paddingTop: this.startIndex * this.rowHeight + 'px',
        paddingBottom: (this.list.length - this.endIndex) * this.rowHeight + 'px'
      }
    }
  },
  methods: {
    getList(page, pageSize) {
      this.isRequest = true
      let data = []
      for(let i = (page - 1) * pageSize; i < page * pageSize; i ++) {
        data.push(i)
      }
      this.isRequest = false
      return data
    },
    calcCount() {
      this.maxCount = Math.ceil(this.$refs.wrapperRef.clientHeight / this.rowHeight) + 2 // +2是作为缓冲区
    },
    wrapperScrollFn() {
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
    setDataStartIndex() {
      const { scrollTop } = this.$refs.wrapperRef
      // 计算滚动到哪个index
      let startIndex = Math.ceil(scrollTop / this.rowHeight) - 1
      this.startIndex = startIndex < 0 ? 0 : startIndex
      if(this.startIndex + this.maxCount > this.list.length - 1) {
        // 追加数据
        // if(this.page === 10) {
        //   return
        // }
        let newList = this.getList(++this.page, 2000)
        this.list = [...this.list, ...newList]
      }
    }
  }
}
</script>

<style scoped>
.wrapper{
  width: 500px;
  height: 800px;
  margin: 0 auto;
  border: 1px solid #000;
  overflow: auto;
}
.item{
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}
</style>
