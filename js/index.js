const virtualScroller = new VirtualScroller({
  element: '#wrapper',
  rowHeight: 50,
  pageSize: 50,
  buffer: 10,
  renderItem: function (dataItem) {
    const oDiv = document.createElement('div')
    oDiv.classList.add('item')
    oDiv.innerText = dataItem
    return oDiv
  },
  loadMore: function(pageSize) {
    const data = []
    for(let i = 0; i < pageSize; i ++) {
      const dataItem = `第${this.data.length + i}个`
      data.push(dataItem)
    }
    return data
  }
})