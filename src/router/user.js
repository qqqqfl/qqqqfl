// 导入express
const express = require('express')
// 创建路由
const router = express.Router()

const { login, cart, addCart,register,userInfo,updateGoodsNum ,updateGoodsState,updateAllGoodsState,addAddress,address,updateUserInfo,getAddressById,updAddressById,deleteAddressById ,order,getOrder,payOrder,getAllOrder,getOrderGoods,payOrderById,deleteOrderById,receiptOrderById,addUserMoney, addComment,comment } = require('../router_handler/user')

// 用户登录接口
router.post('/login', login)

// 用户注册接口
router.post('/register', register)

// 用户个人信息接口
router.get('/userInfo:id', userInfo)

// 用户个人信息接口
router.post('/addMoney', addUserMoney)

// 修改用户个人信息接口
router.post('/updateInfo', updateUserInfo)

// 获取用户的购物车信息接口
router.get('/cart:id', cart)

// 获取用户的购物车信息接口
router.post('/updCart', updateGoodsNum)

// 获取用户购物车中商品选中状态
router.post('/updState', updateGoodsState)

// 获取用户购物车中所有商品选中状态
router.post('/updAllState', updateAllGoodsState)

/**
 * 把商品加入购物车
 * 需要接受三个参数
 * 用户的id，商品的id，商品数量
 */
router.post('/addCart', addCart)


/**
 * 添加收货地址
 * 需要接受三个参数
 * 用户的id，用户手机号，具体地址名称
 */
router.post('/addAddress', addAddress)

/**
 * 获取用户所有收货地址
 */
router.get('/address:id', address)

/**
 * 获取用户所有收货地址
 */
router.get('/getAddress:id', getAddressById)


/**
 * 获取用户所有收货地址
 */
router.post('/updAddress', updAddressById)


/**
 * 获取用户所有收货地址
 */
router.get('/deleteAddress:id', deleteAddressById)


/**
 * 用户提交订单
 */
router.post('/order', order)


// 根据用户id拿到用户最新的订单
router.get('/getOrder:id', getOrder)


// 根据用户id拿到用户最新的订单
router.post('/payOrder',payOrder)


// 根据用户id拿到用户所有订单
router.get('/allOrder:id',getAllOrder)


// 根据订单id拿到用户订单对应的商品
router.post('/orderGoods',getOrderGoods)


// 根据订单id支付
router.post('/payOrderById',payOrderById)


// 根据订单id删除订单
router.post('/deleteOrder',deleteOrderById)


// 根据订单id修改订单状态为已收货
router.post('/receiptOrder',receiptOrderById)


// 给已经购买的商品添加评论
router.post('/addComment',addComment)


// 给已经购买的商品添加评论
router.get('/comment:id',comment)



// 向外导出路由
module.exports = router