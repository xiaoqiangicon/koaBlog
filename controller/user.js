const { exec } = require('../db/mysql');
const { genPassword } = require('../utils/cryp');

const login = async (username, password) => {
  // 生成加密密码
  password = genPassword(password);
  const sql = `
    select username, realname from users where username='${username}' and password='${password}'
  `
  const rows = await exec(sql);
  return rows[0] || {}
}

const register = async (username, password, realname) => {
  password = genPassword(password);

  const checkSql = `select username from users where username='${username}'`
  const checkRows = await exec(checkSql);

  if (checkRows[0]) {
    return { errno: 1, msg: '用户名已存在' }
  }
  
  const sql = `insert into users (username, password, realname) 
  values ('${username}', '${password}', '${realname}')`

  const rows = await exec(sql);
  return rows[0] || {}
}

module.exports = {
  login,
  register,
}