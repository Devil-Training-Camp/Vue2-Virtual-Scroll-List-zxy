<template>
  <div id="wrapper" ref="wrapperRef" @scroll.passive="handleScroll">
    <div class="scroll-bar" ref="scrollBarRef"></div>
    <div class="scroll-list" :style="scrollListStyle">
      <div v-for="(row, index) in visibleData" :col-index="row.id" :key="index" ref="rowRef" class="row-wrapper">
        <div v-for="rowData in row.rowsData" :key="rowData.level" class="row">
          <span>{{ rowData.level }}</span>
          <span>{{ rowData.username }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      list: [],
      rowHeight: 50, // 预估行高，
      itemWidth: 45, // 预估元素宽度
      positions: [], // 存储位置信息
      rowStartIndex: [], // 行初始index
      colStartIndex: 0, // 列初始index
      colMaxCount: 0, // 列展示最大数量
      buffer: 3
    }
  },
  mounted() {
    this.getData()
    this.calMaxCount()
  },
  updated() {
    this.$nextTick(() => {
      console.log('positions', this.positions, this.list);
      let nodes = this.$refs.rowRef
      let list = this.list
      if(!nodes || !nodes.length) return
      nodes.forEach(node => {
        let colIndex = node.getAttribute('col-index') - 1
        let oldHeight = this.positions[colIndex].height
        let height = list[colIndex].rowHeight
        node.style.height = height + 'px'
        let val = oldHeight - height
        console.log(colIndex, oldHeight, height);
        if(val) {
          this.positions[colIndex].height = height
          this.positions[colIndex].bottom = this.positions[colIndex].bottom - val
          for(let i = colIndex + 1; i < this.positions.length; i ++) {
            this.positions[i].top = this.positions[i-1].bottom
            this.positions[i].bottom = this.positions[i].top + this.positions[i].height
          }
        }
      })
      console.log('update--positions', this.positions);
      this.$refs.scrollBarRef.style.height = this.positions[this.positions.length - 1].bottom + 'px'
    })
  },
  computed: {
    colEndIndex() {
      let index = this.colStartIndex + this.colMaxCount + this.buffer
      if(!this.list[index]) {
        index = this.list.length
      }
      return index
    },
    colStartIndexCom() {
      let index = 0
      if(this.colStartIndex <= this.colMaxCount) {
        index = 0
      } else {
        index = this.colStartIndex - this.buffer
      }
      return index
    },
    visibleData() {
      return this.list.slice(this.colStartIndexCom, this.colEndIndex)
    },
    scrollListStyle() {
      let pos = this.positions[this.colStartIndexCom]
      return {
        transform: `translate3d(0, ${pos?.top}px, 0)`
      }
    }
  },
  methods: {
    async getData() {
      const res = await axios.get('http://localhost:9527/lists')
      if(res.status === 200) {
        this.list = res.data
        this.cacheColPos()
      }
    },
    calMaxCount() {
      this.colMaxCount = Math.ceil(this.$refs.wrapperRef.clientHeight / this.rowHeight)
    },
    // 存储位置信息
    cacheColPos() {
      let rowHeight = this.rowHeight
      this.positions = this.list.map((item, index) => {
        return {
          top: index * rowHeight,
          bottom: (index + 1) * rowHeight,
          height: rowHeight
        }
      })
    },
    handleScroll() {
      // 使用requestAnimationFrame请求动画帧实现节流效果
      let requestAnimationFrame = window.requestAnimationFrame
      let fps = 30
      let interval = 1000 / fps
      let then = Date.now()
      requestAnimationFrame(() => {
        let now = Date.now()
        this.setColStartIndex()
        if(now - then >= interval) {
          then = now
          requestAnimationFrame(arguments.callee)
        }
      })
    },
    setColStartIndex() {
      const { scrollTop, scrollLeft } = this.$refs.wrapperRef
      console.log('scrollTop', scrollTop);
      this.colStartIndex = this.getColStartIndex(scrollTop)
    },
    getColStartIndex(value) {
      let start = 0, end = this.positions.length - 1, temp = null
      while(start <= end) {
        let middle = parseInt((start + end) / 2)
        let middleValue = this.positions[middle].bottom
        if(middleValue == value) {
          return middle + 1
        } else if (middleValue > value) {
          if(temp == null || temp > middle) {
            temp = middle
          } 
          end = middle - 1
        } else {
          start = middle + 1
        }
      }
      return temp
    }
  }
}
</script>

<style scoped>
#wrapper{
  position: relative;
  width: 1200px;
  height: 800px;
  border: 1px solid #000;
  overflow: auto;
}
.scroll-list{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.row-wrapper{
  display: flex;
  flex-direction: row;
}
.row{
  display: flex;
  flex-direction: column;
  width: 100px;
  min-width: 100px;
  border: 1px solid transparent;
  border-right-color: #ccc;
  border-bottom-color: #ccc;
  box-sizing: border-box;
}
</style>