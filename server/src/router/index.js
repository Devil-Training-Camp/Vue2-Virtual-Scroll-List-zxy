const Router = require('koa-router')
const { faker } = require('@faker-js/faker')
const router = new Router()

router.get('/list', async (ctx, next) => {
  let url = ctx.request.url
  let params = url.split('?')[1].split('&')
  let delParam = {}
  params.forEach(param => {
    let splitParam = param.split('=')
    delParam[splitParam[0]] = splitParam[1]
  })
  ctx.body = genData(delParam.page, delParam.pageSize)
})

// 生成数据
function genData(page, pageSize) {
  if(page > 20) return []
  let data = []
  for(let i = 0; i < pageSize; i ++) {
    data.push({
      id: (page - 1) * pageSize + i + 1,
      username: faker.internet.userName(),
      avatar: i % 3 === 0 ? 'https://img2.baidu.com/it/u=2046001661,4089174313&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1686934800&t=da782e303382c93a9f0d1340a0c6b78f' : ''
    })
  }
  return data
}


module.exports = router