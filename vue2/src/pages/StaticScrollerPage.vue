<template>
  <StaticScroller :data="data" :rowHeight="rowHeight" :buffer="buffer" :item-key="'id'">
    <div class="scroll-item" slot-scope="scope">
      <span>{{ scope.item.id }}</span>——<span>{{ scope.item.username }}</span>
    </div>
  </StaticScroller>
</template>

<script>
import axios from 'axios'
import StaticScroller from '../plugins/StaticScroller.vue'

export default {
  data() {
    return {
      data: [],
      rowHeight: 50,
      buffer: 8
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const res = await axios.get('http://localhost:9527/list?page=1&pageSize=10000')
      if(res.status === 200) {
        this.data = res.data
      }
    }
  },
  components: {
    StaticScroller
  }
}
</script>

<style scoped>
.scroll-item{
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}
</style>