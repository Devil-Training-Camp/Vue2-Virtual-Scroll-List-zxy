<template>
  <div id="wrapper" ref="wrapper" @scroll.passive="handleScroll">
    <div class="scroll-bar"></div>
    <div class="scroll-list">
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
      let endIndex = this.startIndex + this.maxCount
      if(!this.list[endIndex]) {
        endIndex = this.list.length
      }
      return endIndex
    },
    visibleData() {
      return this.list.slice(this.startIndex, this.endIndex)
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