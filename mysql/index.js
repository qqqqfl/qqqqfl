// 导入mysql模块
const mysql = require('mysql')

// 调用mysql的createPool方法并传入配置项
const db = mysql.createPool({
  host: 'http://127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'vue_shop_db',
  multipleStatements:true
})

// 向外导入数据库
module.exports = db