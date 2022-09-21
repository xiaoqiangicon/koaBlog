const router = require('koa-router')();
const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登陆验证函数
const loginCheck = async (ctx, next) => {
  console.log('test', ctx.session.username)
  if (ctx.session.username) {
    await next();
    return;
  }
  ctx.body = new ErrorModel('尚未登陆');
}

router.prefix('/api/blog');

router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || '';
  let keyword = ctx.query.keyword || '';

  if (ctx.query.isadmin) {
    console.log('is admin')
    // 管理员界面
    if (ctx.session.username == null) {
      console.error('is admin, but not login');

      ctx.body = new ErrorModel('未登录')
      return;
    }

    // 强制查询自己的博客
    author = ctx.session.username;
  }

  const listData = await getList(author, keyword);

  ctx.body = new SuccessModel(listData);
})

router.get('/detail', async (ctx, next) => {
  const id = ctx.query.id;
  const detailData = await getDetail(id);
  
  ctx.body = new SuccessModel(detailData);
})

router.post('/new', loginCheck, async (ctx, next) => {
  const author = ctx.session.username;
  ctx.request.body.author = author;
  const result = await newBlog(ctx.request.body);

  ctx.body = new SuccessModel(result);
})

router.post('/update', async (ctx, next) => {
  const loginCheckResult = loginCheck(ctx); 

  if (loginCheckResult) {
    return loginCheckResult;
  }
  const body = ctx.request.body;
  const result = updateBlog(body);

  ctx.body = new SuccessModel(result);
})

router.post('/del', loginCheck, async (ctx, next) => {
  const author = ctx.session.username;
  const { id } = ctx.request.body;

  const result = await delBlog(id, author);
  if (result)
    ctx.body = new SuccessModel(result);
  else 
    ctx.body = new ErrorModel(result);
})

module.exports = router