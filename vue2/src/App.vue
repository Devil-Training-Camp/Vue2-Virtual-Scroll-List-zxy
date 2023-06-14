<template>
  <div id="app">
    <RecycleScroller 
      :url="url"
      :rowHeight="rowHeight"
      :pageSize="pageSize"
      :loadingText="loadingText"
    >
      <div class="item" slot-scope="scope">
        <span>{{ scope.data.id }}</span>——<span>{{ scope.data.username }}</span>
      </div>
    </RecycleScroller>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      url: 'http://localhost:9527/list',
      rowHeight: 50,
      pageSize: 20,
      loadingText: '加载数据中...'
    }
  }
}
</script>

<style>
#app{
  height: 800px;
  width: 500px;
  margin: 0 auto;
  border: 1px solid #000;
}
.item{
  height: 50px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #000;
  box-sizing: border-box;
}
</style>