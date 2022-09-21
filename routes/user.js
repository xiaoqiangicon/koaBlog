const router = require('koa-router')();
const { login, register } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user');

router.post('/register', async(ctx, next) => {
  const { username, password, realname } = ctx.request.body;

  const result = await register(username, password, realname);
  if (result.errno) {
    ctx.body = result;
  } else {
    ctx.body = {
      errno: 0,
    }
  }
})

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body;

  const result = await login(username, password);
  
  if (result.username) {
    ctx.session.username = result.username;
    ctx.session.realname = result.realname;

    ctx.body = new SuccessModel('登陆成功')
    return;
  } else {
    ctx.body = new ErrorModel('登陆失败')
    return;
  }
})

router.get('/session-test', async (ctx, next) => {
  if (ctx.session.veiwCount === null) {
    ctx.session.veiwCount = 0;
  }
  ctx.session.veiwCount++;
  ctx.body = {
    errno: 0,
    veiwCount: ctx.session.veiwCount
  }
})

module.exports = router