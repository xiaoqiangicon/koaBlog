const { exec } = require('../db/mysql');
const xss = require('xss');
const getList = async(author, keyword) => {

  // 1=1永远成立，但是在这可以占位可供where查询
  let sql = `select * from blogs where 1=1 `;
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}' `
  }
  sql += `order by id desc;`;

  // 返回promise；
  return await exec(sql);
}

const getDetail = async(id) => {
  const sql = `select * from blogs where id='${id}'`

  const rows = await exec(sql);
  return rows[0]
}

const updateBlog = async(blogData = {}) => {
  const id = blogData.id;
  const title = blogData.title;
  const content = blogData.content;

  const sql = `
    update blogs set title='${title}', content='${content}' where id=${id}
  `

  const updateData = await exec(sql);
  if (updateData.affectedRows > 0) {
    return true;
  }
  return false;
}

const newBlog = async(blogData) => {

  const title = blogData.title;
  const content = blogData.content;
  const author = blogData.author;
  const createTime = Date.now();

  const sql = `
    insert into blogs (title, content, createtime, author) 
    values ('${title}', '${content}', '${createTime}','${author}')
  `
  const insertData = await exec(sql);
  return {
    id: insertData.insertId
  }
}

const delBlog = async(id, author) => {
  // 考虑数据得软删除，不要使用硬删除，使用state记录
  const sql = `
    delete from blogs where id='${id}' and author='${author}'
  `; 
  const delData = await exec(sql);
  if (delData.affectedRows > 0) {
    return true;
  }
  return false;
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
}