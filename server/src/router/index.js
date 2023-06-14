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
    })
  }
  return data
}


module.exports = router