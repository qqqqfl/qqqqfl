const express=require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
//上传图片的模板
var multer=require('multer');
//生成的图片放入uploads文件夹下
var upload=multer({dest:'public/uploads/'})
//图片上传必须用post方法
router.post('/img',upload.single('file'),(req,res)=>{
    // console.log(req.file);
    fs.readFile(req.file.path,(err,data)=>{
        //如果读取失败
        var newP = 'public/uploads/'+req.file.originalname
        // var newP = req.files.file.name
        
        if (err) { return res.send('上传失败') }
        // console.log(__dirname+newP);
    //如果读取成功
    //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
        //如果读取成功
    //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
    let time=Date.now()+parseInt(Math.random()*999)+parseInt(Math.random()*2222);
    //拓展名
    let extname=req.file.mimetype.split('/')[1]
    //拼接成图片名
    let keepname=time+'.'+extname
    //三个参数
    //1.图片的绝对路径
    //2.写入的内容
    //3.回调函数
        
    fs.writeFile(path.join(__dirname,'../public/uploads/'+keepname),data,(err)=>{
    //三个参数
    //1.图片的绝对路径
    //2.写入的内容
    //3.回调函数
    // fs.writeFile(path.join(__dirname,newP),data,(err)=>{
        if (err) { return res.send('写入失败') }
        
        res.send({err:0,msg:'上传ok',name:keepname,data:'/uploads/'+keepname})
    });
 });
})
module.exports=router;
