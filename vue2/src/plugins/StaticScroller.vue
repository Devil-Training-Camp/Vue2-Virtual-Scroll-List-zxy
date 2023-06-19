<template>
  <div id="wrapper" ref="wrapper" @scroll.passive="handleScroll">
    <!-- <div class="scroll-bar" :style="`transform`"></div> -->
    <div class="scroll-list" :style="blankFillStyle">
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
    visibleData() {
      let startIndex = 0
      if(this.startIndex <= this.maxCount) {
        startIndex = 0
      } else {
        startIndex = this.startIndex - this.buffer
      }
      return this.list.slice(startIndex, this.endIndex)
    },
    blankFillStyle() {
      let startIndex = 0
      if(this.startIndex <= this.maxCount) {
        startIndex = 0
      } else {
        startIndex = this.startIndex - this.buffer
      }
      return {
        paddingTop: startIndex * this.rowHeight + 'px',
        paddingBottom: (this.list.length - this.endIndex) * this.rowHeight + 'px'
      }
    }
  },
  watch: {
    data: function(newVal) {
      this.list = Object.freeze(newVal)
    }
  },
  methods: {
    calMaxCount() {
      this.maxCount = Math.ceil(this.$refs.wrapper.clientHeight / this.rowHeight)
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
    setDataStartIndex() { // 设置startIndex
      const { scrollTop } = this.$refs.wrapper
      this.currentScrollTop = scrollTop
      this.startIndex = Math.floor(scrollTop / this.rowHeight)
    }
  }
}
</script>

<style scoped>
#wrapper{
  height: 100%;
  overflow: auto;
}
</style>