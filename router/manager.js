// 导入express
const express = require('express')
// 创建路由
const router = express.Router()

const { getAllUser,getAllOrder,sendOrder,addGoods, addGoodsType,typeById ,updType,deleteType, getAllComment,getAllBanner,addBanner, getSalesVolume, getTotalSales} = require('../router_handler/manager')

// 管理员获取所有用户
router.get('/allUser', getAllUser)


// 管理员获取所有用户订单
router.get('/allOrder', getAllOrder)

// 管理员改变订单状态
router.post('/sendOrder',sendOrder)

// 管理员改变订单状态
router.post('/addGoods',addGoods)

// 管理员添加商品分类
router.post('/addType',addGoodsType)

// 管理员获取商品详情
router.get('/type:id',typeById)

// 管理员根据分类id删除分类
router.get('/deleteType:id',deleteType)

// 管理员添加商品分类
router.post('/updType',updType)

// 管理员获取所有商品评论
router.get('/allComment',getAllComment)

// 管理员获取所有商品评论
router.get('/allBanner',getAllBanner)

// 管理员添加轮播图
router.post('/addBanner',addBanner)

// 管理员获取销售额
router.get('/getSv:n',getSalesVolume)

// 管理员获取销售额
router.get('/getTotalSv:n',getTotalSales)


module.exports = router