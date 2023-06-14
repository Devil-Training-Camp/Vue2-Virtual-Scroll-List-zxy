import RecycleScroller from './RecycleScroller.vue'

const plugin = {
  install(Vue) {
    Vue.component('RecycleScroller', RecycleScroller)
  }
}

export default plugin