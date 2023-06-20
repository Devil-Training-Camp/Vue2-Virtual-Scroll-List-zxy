<template>
  <div id="wrapper" ref="wrapperRef" @scroll.passive="handleScroll">
    <div class="scroll-bar" ref="scrollBarRef"></div>
    <div class="scroll-list" :style="scrollListStyle">
      <div v-for="item in visibleData" :key="item[itemKey]">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      startIndex: 0,
      maxCount: 0,
    }
  },
  props: {
    data: Array,
    rowHeight: Number,
    buffer: Number,
    itemKey: String
  },
  mounted() {
    this.calMaxCount()
  },
  computed: {
    endIndex() {
      let endIndex = this.startIndex + this.maxCount + this.buffer
      if(!this.list[endIndex]) {
        endIndex = this.list.length
      }
      return endIndex
    },
    startIndexCom() {
      let startIndex = 0
      if(this.startIndex <= this.maxCount) {
        startIndex = 0
      } else {
        startIndex = this.startIndex - this.buffer
      }
      return startIndex
    },
    visibleData() {
      return this.list.slice(this.startIndexCom, this.endIndex)
    },
    scrollListStyle() {
      return {
        transform: `translate3d(0, ${this.startIndexCom * this.rowHeight}px, 0)`
      }
    }
  },
  watch: {
    data: function(newVal) {
      this.list = Object.freeze(newVal)
      this.setScrollBarHeight()
    }
  },
  methods: {
    calMaxCount() {
      this.maxCount = Math.ceil(this.$refs.wrapperRef.clientHeight / this.rowHeight)
    },
    setScrollBarHeight() {
      this.$refs.scrollBarRef.style.height = this.list.length * this.rowHeight + 'px'
    },
    handleScroll() {
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
      this.currentScrollTop = scrollTop
      this.startIndex = Math.floor(scrollTop / this.rowHeight)
    }
  }
}
</script>

<style scoped>
#wrapper{
  position: relative;
  height: 100%;
  overflow: auto;
}
.scroll-list{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
</style>