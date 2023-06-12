<template>
  <div class="wrapper" ref="wrapperRef" @scroll.passive="wrapperScroll">
    <div v-for="item in currentData" :key="item" class="item">
      第{{item + 1}}个
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

let data = []
const rowHeight = 50
let maxCount = ref(0)
let startIndex = ref(0)
let endIndex = ref(0)
const wrapperRef = ref(null)

onMounted(() => {
  loadData()
  calcMaxCount()
})

let currentData = computed(() => {
  return data.slice(startIndex.value, endIndex.value)
})


// 初始化数据 
const loadData = () => {
  let res = []
  for(let i = 0; i < 1000; i ++) {
    res.push(i)
  }
  data.push(...res)
}

// 计算视口最大容量
const calcMaxCount = () => {
  maxCount = Math.ceil(wrapperRef.value.clientHeight / rowHeight) + 2
  endIndex.value = maxCount
}

// 容器滚动事件
const wrapperScroll = () => {
  startIndex.value = Math.ceil(wrapperRef.value.scrollTop / rowHeight)
  let index = startIndex.value + maxCount
  if(!data[index]){
    endIndex.value = data.length - 1
  } else {
    endIndex.value = index
  }
}
</script>

<style scoped>
.wrapper{
  height: 800px;
  width: 500px;
  overflow: auto;
  border: 1px solid #000;
}
.item{
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-bottom: 1px solid #ccc;
}
</style>
