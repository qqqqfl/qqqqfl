// 导入express
const express = require('express')
// 创建路由
const router = express.Router()


const { goodsList,goodsType,goodsDetails ,addCart,updGoods,updGoodsNum} = require('../router_handler/goods')

// 获取商品列表接口
router.get('/list', goodsList)

// 获取商品分类接口
router.get('/type', goodsType)

// 获取商品详情接口
router.get('/details:id', goodsDetails)

// 获取商品详情接口
router.post('/addCart', addCart)

// 获取商品详情接口
router.post('/updGoods', updGoods)

// 获取商品详情接口
router.post('/updGoodsNum', updGoodsNum)


module.exports = router