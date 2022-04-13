const express = require('express');
//引包
var bodyParser = require('body-parser')
const app = express()
const path = require('path')
var fs = require('fs')
// const formidableMiddleware = require('express-formidable');
 
app.use(express.static(path.join(__dirname,'public')));

// app.use(formidableMiddleware());



// 配置跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 配置解析表单中间件
// app.use(express.urlencoded({ extended: false }))
// 配置 body-parser 中间件
// 只要加入这个配置，在 req 请求对象上会多出来一个属性：body
// 也就是说可以直接通过 req.body 来获取表单 POST 请求体数据了
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())



app.all('/', function(req, res){
    console.log("=======================================");
    console.log("请求路径："+req.url);
    var filename = req.url.split('/')[req.url.split('/').length-1];
    var suffix = req.url.split('.')[req.url.split('.').length-1];
    console.log("文件名：", filename);
    if(req.url==='/'){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(get_file_content(path.join(__dirname, 'html', 'index.html')));
    }else if(suffix==='css'){
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.end(get_file_content(path.join(__dirname, 'public', 'css', filename)));
    }else if(suffix in ['gif', 'jpeg', 'jpg', 'png']) {
        res.writeHead(200, {'Content-Type': 'image/'+suffix});
        res.end(get_file_content(path.join(__dirname, 'public', 'images', filename)));
    }
});



//配置 错误快捷中间件
app.use((req, res, next) => {
  // status = 0 为成功，status = 1 为失败；默认将status设置为 1 ，方便处理失败情况
  res.cc = (err,status=1) => {
    res.send({
      // 状态
      status,
      // 错误信息，判断 err 是错误对象还是字符串
      message:err instanceof Error ? err.message : err
    })
  }
  next()
})


//数据模型
//路由配置
const upload=require('./router/upload.js');
app.use('/upload',upload)


// 导入注册用户模块 并注册为中间件
const userRouter = require('./router/user.js')
app.use('/user', userRouter)

// 导入注册商品模块 并注册为中间件
const goodsRouter = require('./router/goods.js')
app.use('/goods', goodsRouter)

// 导入注册管理员模块 并注册为中间件
const mgRouter = require('./router/manager.js');
app.use('/mg', mgRouter)






app.listen(8082, () => {
  console.log('serve at running http://127.0.0.1:8082');
})