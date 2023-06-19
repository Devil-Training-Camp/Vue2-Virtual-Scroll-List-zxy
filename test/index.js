let startTime = Date.now()
let oWrapper = document.querySelector('#wrapper')

let index = 0
let id = 0

function load(count) {
  index += 50
  if(index <= count) {
    requestAnimationFrame(() => {
      let fragement = document.createDocumentFragment()
      for(let i = 0; i < 50; i ++) {
        let oLi = document.createElement('li')
        oLi.innerHTML = id ++
        fragement.appendChild(oLi)
      }
      oWrapper.appendChild(fragement)
      load(count)
    })
  }
}
load(10000)

setTimeout(() => {
  console.log(Date.now() - startTime);
}, 0)