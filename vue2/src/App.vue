<template>
  <div id="app">
    <el-tabs v-model="activeName">
      <el-tab-pane label="元素固定高度" name="static">
        <div class="wrapper">
          <StaticScrollerPage />
        </div>
      </el-tab-pane>
      <el-tab-pane label="元素不定高度" name="dynamic">
        <DynamicScrollerPage />
      </el-tab-pane>
      <el-tab-pane label="下拉加载" name="page">
        <PageScrollerPage />
      </el-tab-pane>
      <el-tab-pane label="横向滚动" name="fourth">定时任务补偿</el-tab-pane>
      <el-tab-pane label="横纵向滚动" name="fifth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StaticScrollerPage from './pages/StaticScrollerPage.vue'
import DynamicScrollerPage from './pages/DynamicScrollerPage.vue'
import PageScrollerPage from './pages/PageScrollerPage.vue'

export default {
  name: 'App',
  data() {
    return {
      activeName: 'static'
    }
  },
  components: {
    StaticScrollerPage,
    DynamicScrollerPage,
    PageScrollerPage
  }
}
</script>

<style scoped>
.wrapper{
  width: 500px;
  height: 800px;
  border: 1px solid #000;
}
</style>