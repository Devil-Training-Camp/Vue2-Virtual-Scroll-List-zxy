class VirtualScroller {
  topHiddenCount = 0
  bottomHiddenCount = 0
  scrollTop = 0
  paddingTop = 0
  paddingBottom = 0
  lastVisibleItemIndex = 0

  constructor({
    element, // 容器id
    rowHeight, // dom行高
    pageSize,
    buffer, // 缓冲数据
    renderItem,
    loadMore 
  }) {
    this.scroller = document.querySelector(element)
    this.rowHeight = rowHeight
    this.pageSize = pageSize
    this.buffer = buffer
    this.renderItem = renderItem
    this.loadMore = loadMore
    this.data = []

    const contentBox = document.createElement('div')
    this.contentBox = contentBox
    this.scroller.appendChild(contentBox)

    this.loadInitData()
    this.scroller.addEventListener('scroll', throttle(this.handleScroll, 150))
  }
  loadInitData() {
    const scrollerRect = this.scroller.getBoundingClientRect()
    const height = scrollerRect.height
    this.scroller.style.height = height
    this.height = height
    const minCount = Math.ceil(height / this.rowHeight)
    const page = Math.ceil(minCount / this.pageSize)
    const newData = this.loadMore(page * this.pageSize)
    this.data.push(...newData)
    this.renderNewData(newData)
  }
  renderNewData(newData) {
    newData.forEach(item => {
      this.contentBox.appendChild(this.renderRow(item))
    })
  }
  renderRow(item) {
    return this.renderItem(item)
  }
  handleScroll = (e) => {
    const { clientHeight, scrollHeight, scrollTop } = e.target
    console.log(scrollHeight, clientHeight, scrollTop, scrollHeight - (clientHeight + scrollTop));
    if (scrollHeight - (clientHeight + scrollTop) < 100) {
      const newData = this.loadMore(this.pageSize);
      this.data.push(...newData);
    }
    const direction = scrollTop > this.scrollTop ? 1 : -1
    this.toggleTopItems(direction)
    this.toggleBottomItems(direction)
    this.scrollTop = scrollTop
  }
  toggleTopItems(direction) {
    const { scrollTop } = this.scroller
    const firstVisibleItemIndex = Math.floor(scrollTop / this.rowHeight)
    const firstExistItemIndex = Math.max(0, firstVisibleItemIndex - this.buffer)
    const rows = this.contentBox.children
    if(direction === 1) {
      for(let i = this.topHiddenCount; i < firstExistItemIndex; i ++) {
        if(rows[0]) rows[0].remove()
      }
    }
    if(direction === -1) {
      for(let i = this.topHiddenCount - 1; i >= firstExistItemIndex; i --) {
        const item = this.data[i]
        const row = this.renderRow(item)
        this.contentBox.prepend(row)
      }
    }
    this.topHiddenCount = firstExistItemIndex;
    this.paddingTop = this.topHiddenCount * this.rowHeight;
    this.contentBox.style.paddingTop = this.paddingTop + 'px';
  }
  toggleBottomItems(direction) {
    const { scrollTop, clientHeight } = this.scroller;
    const lastVisibleItemIndex = Math.floor((scrollTop + clientHeight) / this.rowHeight);
    const lastExistingItemIndex = lastVisibleItemIndex + this.buffer;
    this.lastVisibleItemIndex = lastVisibleItemIndex;
    const rows = [...this.contentBox.children];
    if (direction === -1) {
      for (let i = lastExistingItemIndex + 1; i <= this.data.length; i++) {
        const row = rows[i - this.topHiddenCount];
        if (row) row.remove();
      }
    }
    if (direction === 1) {
      for (let i = this.topHiddenCount + rows.length; i <= lastExistingItemIndex; i++) {
        const item = this.data[i];
        if (!item) break;
        const row = this.renderRow(item);
        this.contentBox.append(row);
      }
    }
    this.bottomHiddenCount = Math.max(0, this.data.length - (this.topHiddenCount + this.contentBox.children.length) - this.buffer);
    this.paddingBottom = this.bottomHiddenCount * this.rowHeight;
    this.contentBox.style.paddingBottom = this.paddingBottom + 'px';
  }
}

function throttle(fn, wait) {
  let lastTime = 0;
  let timer;
  return function (...args) {
    function run() {
      const now = new Date().valueOf();
      if (now - lastTime > wait) {
        fn.apply(this, args);
        lastTime = now;
      }
    }
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(run, wait);
    run();
  }
}