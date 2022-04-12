const db = require('../mysql/index.js')

exports.login = (req, res) => {
  let userInfo = req.body
  // console.log(userInfo);
  let str = "select * from sp_users where mg_name=?"
  db.query(str, userInfo.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length == 1) {
      if (results[0].mg_pwd === userInfo.password) {
        return res.send({status:0,data:results[0],msg:'登陆成功！'})
      }else{
        return res.send({status:1,msg:'密码错误，登录失败！'})
      }
    } else {
      return res.cc('没有该用户信息！')
    }
  })
}

// 注册回调函数
exports.register = (req, res) => {
  let u = req.body
  let str = "select * from sp_users where mg_name=?"
  db.query(str, req.body.username, (err, results) => {
    if (err) return res.cc(err)
    if (results.length == 1) {
      return res.cc('用户名已经被注册！')
    } else {
      let addStr = "insert into sp_users (mg_name,mg_pwd,mg_time,mg_phone,mg_sex,mg_money,create_time) values(?,?,?,?,?,?,?)"
      db.query(addStr,[u.username,u.password, u.mg_time,u.phone,u.sex,0,Date.now()], (err1, results1) => {
        if (err1) return res.cc(err1)
        if (results1.affectedRows !== 1) {
          return res.cc('注册失败！')
        } else {
          return res.cc('注册成功！',0)
        }
      })
    }
  })
}
// 根据id查询用户信息
exports.userInfo = (req, res) => {
  let str = "select * from sp_users where mg_id=?"
  db.query(str, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) {
      return res.cc('查询用户信息失败！')
    } else {
      return res.send({status:0,data:results[0]})
    }
  })
}

// 根据id修改用户的个人信息
/**
 * @param userId:用户id
 * @param mg_name:用户姓名
 * @param mg_pwd:用户密码
 * @param mg_sex:用户性别
 * @param mg_phone:用户手机号
 * @param mg_money:用户余额
 */
 exports.updateUserInfo = async (req, res) => {
  //  收到用户提交的表单
    let u = req.body
    let str= "update sp_users set mg_pwd=?,mg_sex=?,mg_phone=?,mg_money=? where mg_id=?"
    db.query(str, [u.mg_pwd, u.mg_sex, u.mg_phone, u.mg_money, u.mg_id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('修改用户信息失败！')
      return res.cc('修改成功！',0)
    })
}

// 根据id增加用户的余额
/**
 * @param userId:用户id
 */
 exports.addUserMoney = (req, res) => {
  //  收到用户提交的表单
    let u = req.body
    let str= "update sp_users set mg_money=? where mg_id=?"
    db.query(str, [u.mg_money, u.mg_id], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('用户充值失败！')
      return res.cc('用户充值成功！',0)
    })
}


// 获取用户购物车信息
exports.cart = (req, res) => {
  /***
   * 1.首先传入用户id
   * 2.在购物车表中根据用户id查询所有数据信息
   * 3.再根据每个对象中商品id查到对应商品信息
   */
  let str = `SELECT 
                  c.cart_id,
                  c.mg_id,
                  c.goods_id,
                  c.goods_number,
                  c.goods_state,
                  g.goods_name,
                  g.goods_pic,
                  g.goods_des,
                  g.goods_price 
            from  
                  sp_cart as c  
            left join 
                  sp_goods as g 
            on 
                  c.goods_id =g.goods_id
            where 
                  c.mg_id=?`
  db.query(str,req.params.id,(err, results) => {
    if (err) return res.cc(err)
    if (!results.length) return res.cc('用户购物车没有商品！')
    results.forEach(item => {
      if (item.goods_state) {
        item.goods_state = true
      } else {
        item.goods_state = false
      }
    });
    return res.send({status:0,data:results})
  })
  // 
  // let strTwo = "select * from sp_goods where find_in_set(goods_id,(select c.goods_id from sp_cart AS c where c.cart_id=?))"
  // let str = "select * from sp_users where mg_id=?"
  
  // db.query(str, req.params.id, (err2, res2) => {
  //   if(err2) return res.cc(err2)
  //   db.query(strTwo, res2[0].cart_id, (err, results) => {
  //     if(err) return res.cc(err)
  //     res2[0].goods_list = results
  //     res.send(res2)
  //   })
  // })
}
/**
 * 把商品加入购物车
 * 需要接受三个参数
 * 用户的id，商品的id，商品数量
 */
exports.addCart = (req, res) => {
  console.log(req.body);
  let userInfo = req.body
  let strUni = "select * from sp_cart where mg_id=?"
  db.query(strUni, userInfo.user_id, (err, results) => {
    if (err) return res.send('出错了')
    // 查询到的结果看有没有相同的商品id
    const isHave = results.some(item => item.goods_id == userInfo.goods_id)
    if (isHave) {
      return res.send({ status: 1, msg: '该商品已经在购物车里了，请勿重复添加！' })
    } else {
      let str = "insert into sp_cart (mg_id,goods_id,goods_number) values(?,?,?)"
      db.query(str, [userInfo.user_id, userInfo.goods_id, userInfo.goods_num], (err, results) => {
        if (results.affectedRows !== 1) {
          return res.send({status:1,msg:'添加失败！'})
        } else {
          res.send({status:0,msg:'添加成功！'})
        }
      })
    }
  })

  // 
}


// 修改购物车中商品对应的数量
/**
 * @param id:用户id
 * @param cart_id:购物车id
 * @param goods_number:商品数量
 */
exports.updateGoodsNum = (req, res) => {
  let goodsInfo = req.body
  let updStr = "update sp_cart set goods_number=? where cart_id=?;"
  db.query(updStr, [goodsInfo.goodsNum, goodsInfo.cartId], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) {
      return res.cc('修改失败')
    }
    return res.cc('修改成功',0)
  })
}

// 修改购物车中商品对应的状态
/**
 * @param id:用户id
 * @param cart_id:购物车id
 * @param goods_state:商品状态 0：未选中，1：已选中
 */
 exports.updateGoodsState = (req, res) => {
  let goodsInfo = req.body
  let updStr = "update sp_cart set goods_state=? where cart_id=?;"
  db.query(updStr, [goodsInfo.goodsState, goodsInfo.cartId], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) {
      return res.cc('修改失败')
    }
    return res.cc('修改成功',0)
  })
}


// 修改购物车中用户对应的所有商品状态
/**
 * @param id:用户id
 * @param goods_state:商品状态 0：未选中，1：已选中
 */
 exports.updateAllGoodsState =(req, res) => {
  let goodsInfo = req.body
   let str = `update sp_cart set goods_state=? where cart_id=?`
   db.query(str, [goodsInfo.goodsState,goodsInfo.cartId], (err, results) => {
     if (err) return res.cc(err)
     return res.cc('成功！', 0)
   })
}

// 查询用户的收货地址
/**
 * @param userId:用户id
 */
exports.address = async (req, res) => {  
  let str = "select * from sp_address where user_id=?"
  db.query(str, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    return res.send({status:0,data:results})
  })
}


// 添加用户的收货地址
/**
 * @param userId:用户id
 * @param user_name:用户姓名
 * @param user_phone:用户手机号
 * @param user_address:用户详情地址 = firstAddress + lastAddress
 */
exports.addAddress = async (req, res) => {
  //  收到用户提交的表单
  let goodsInfo = req.body
  let str = `insert into sp_address (user_id,ad_name,ad_phone,ad_addr) values(?,?,?,?)`
   db.query(str, [goodsInfo.userId,goodsInfo.userName,goodsInfo.userPhone,goodsInfo.userAddress], (err, results) => {
     if (err) return res.cc(err)
     if(results.affectedRows!==1)return res.cc('添加地址失败！')
     return res.cc('成功添加地址！', 0)
   })
}


// 查询用户的某一个收货地址
/**
 * @param ad_id:地址id
 */
 exports.getAddressById = async (req, res) => {  
  let str = "select * from sp_address where ad_id=?"
  db.query(str, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    return res.send({status:0,data:results})
  })
}

// 修改用户的收货地址
/**
 * @param userId:用户id
 * @param ad_name:用户姓名
 * @param ad_addr:用户地址
 * @param ad_phone:用户手机号
 */
 exports.updAddressById = (req, res) => {
  //  收到用户提交的表单
  let a = req.body
  let str = `update sp_address set ad_name=?,ad_addr=?,ad_phone=? where ad_id=?`
   db.query(str, [a.ad_name,a.ad_addr,a.ad_phone,a.ad_id], (err, results) => {
     if (err) return res.cc(err)
     if(results.affectedRows!==1)return res.cc('修改地址失败！')
     return res.cc('修改地址成功！', 0)
   })
}

// 删除用户的收货地址
/**
 * @param adId:收货地址id
 */
 exports.deleteAddressById = (req, res) => {
  let str = `delete from sp_address where ad_id=?`
   db.query(str, req.params.id, (err, results) => {
     if (err) return res.cc(err)
     if(results.affectedRows!==1)return res.cc('删除地址失败！')
     return res.cc('删除地址成功！', 0)
   })
}

// 提交订单
/** 订单相关数据
 * @param userId:用户id
 * @param order_price：订单总金额
 * @param ad_id：订单收货地址
 * @param create_time：订单创建时间
 * @param pay_status：订单付款状态：（默认为0代表未付款）
 * 商品表提交表单
 * @param order_id:订单id
 * @param goods_id:商品id
 * @param goods_number:商品数量
 */
// 1、先插入订单表数据
// 2、再根据订单id插入商品相关数据
// 3、之后在购物车中清除订单中的商品

// 4、在根据订单中商品数量在库存中减少相应数量
exports.order = (req, res) => {
  let orderInfo = req.body.orderForm
  let goodsInfo = req.body.goodsInfo
  let str = "insert into sp_order (user_id,order_number,order_price,pay_status,addr_id,create_time) values(?,?,?,?,?,?)"
  db.query(str, [orderInfo.userId,Date.now(),orderInfo.order_price,0,orderInfo.ad_id,orderInfo.create_time],(err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('插入订单失败')
    let orderId = results.insertId
    // 定义新增语句，根据订单id插入商品相关数据
    let addStr = `insert into sp_order_goods (goods_id,order_id,goods_number) values(?,?,?)`
    for (let i = 0; i < goodsInfo.length; i++){
      db.query(addStr, [goodsInfo[i].goods_id, orderId, goodsInfo[i].goods_number], (err1, results1) => {
      })
    }
    // 定义删除语句，在购物车中清除订单中的商品
    let delStr = "delete from sp_cart where mg_id=? and goods_id=?"
    for (let j = 0; j < goodsInfo.length; j++){
      db.query(delStr,[orderInfo.userId,goodsInfo[j].goods_id],(err,results)=>{})
    }
    // 定义删除语句，在购物车中清除订单中的商品
    // let str = "select goods_num from sp_goods where goods_id=?"
    // let delStr2 = "update set sp_goods goods_num=? where mg_id=? and goods_id=?"
    // for (let j = 0; j < goodsInfo.length; j++){
    //   db.query(delStr,[orderInfo.userId,goodsInfo[j].goods_id],(err,results)=>{})
    // }
    return res.cc('生成订单成功！',0)
  })
}




/** 根据用户id和创建时间找到最新的订单
 * @param userId:用户id
 */
exports.getOrder = (req, res) => {
  let str = "select * from sp_order where user_id=?"
  db.query(str, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    let ct = 0
    let data=[]
    results.forEach(item => {
      if (item.create_time > ct) {
        ct = item.create_time
        data=item
      }
    })
    return res.send({status:0,data})
  })
}


/** 根据用户id和创建时间找到最新的订单
 * @param userId:用户id
 */
exports.getOrder = (req, res) => {
  let str = "select * from sp_order where user_id=?"
  db.query(str, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    let ct = 0
    let data=[]
    results.forEach(item => {
      if (item.create_time > ct) {
        ct = item.create_time
        data=item
      }
    })
    return res.send({status:0,data})
  })
}


/** 根据用户id和创建时间找到最新的订单
 * @param orderId:订单id
 * @param pay_status：订单付款状态：（默认为0代表未付款）
 * @param order_pay: 付款方式（支付方式  0未支付 1余额  2微信  3支付宝）
 * @param userId: 用户id
 * @param orderMoney: 订单金额
 * @param userMoney: 用户余额
 * 
 * 支付成功后要根据订单的金额和用户的余额做扣除
 */
exports.payOrder = (req, res) => {
   let payOrder = req.body
  let str = "update sp_order set pay_status=?,order_pay=? where order_id=?"
  db.query(str, [payOrder.payStatus,payOrder.orderPay,payOrder.orderId], (err, results) => {
    if (err) return res.cc(err)
    if(results.affectedRows!==1)return res.cc('支付状态失败，请检查或刷新后重试')
    // return res.cc('支付成功！', 0)
    let strMoney = "update sp_users set mg_money=? where mg_id=?"
    db.query(strMoney, [payOrder.userMoney - payOrder.orderMoney, payOrder.userId], (err1, results1) => {
      if (err1) return res.cc(err1)
      res.cc(results1,0)
    })
  })
}

//获取用户所有的订单
exports.getAllOrder = (req, res) => {
  // let str = " select * from sp_order o,sp_address ad where o.user_id=? and o.addr_id=ad.ad_id order by create_time desc"
  let str = "select * from sp_order o,sp_address ad where o.user_id=? and o.addr_id=ad.ad_id order by create_time desc"
  db.query(str, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    // res.send({status:0,data:results})
    return res.send({status:0,data:results})
  })
}

//获取用户订单相关联的商品表
exports.getOrderGoods = (req, res) => {
  let str = " select * from sp_order_goods og,sp_goods g where og.order_id=? and g.goods_id=og.goods_id"
  db.query(str, req.body.orderId, (err, results) => {
    if (err) return res.cc(err)
    res.send({ status: 0, data: results })
  })
}

/** 根据用户id和创建时间找到最新的订单
 * @param orderId:订单id
 * @param pay_status：订单付款状态：（默认为0代表未付款）
 * @param order_pay: 付款方式（支付方式  0未支付 1余额  2微信  3支付宝）
 * @param userId: 用户id
 * @param orderMoney: 订单金额
 * @param userMoney: 用户余额
 * 
 * 支付成功后要根据订单的金额和用户的余额做扣除
 */
 exports.payOrderById = (req, res) => {
  let payOrder = req.body
 let str = "update sp_order set pay_status=?,order_pay=? where order_id=?"
 db.query(str, [payOrder.payStatus,payOrder.orderPay,payOrder.orderId], (err, results) => {
   if (err) return res.cc(err)
   if(results.affectedRows!==1)return res.cc('支付状态失败，请检查或刷新后重试')
   // return res.cc('支付成功！', 0)
   let strMoney = "update sp_users set mg_money=? where mg_id=?"
   db.query(strMoney, [payOrder.userMoney - payOrder.orderMoney, payOrder.userId], (err1, results1) => {
     if (err1) return res.cc(err1)
     if (results1.affectedRows !== 1) return res.cc('支付失败')
     return res.cc('支付成功',0)
   })
 })
}

/** 根据订单id删除订单
 * @param orderId:订单id
 */
 exports.deleteOrderById = (req, res) => {
  let payOrder = req.body
 let str = "delete from sp_order where order_id=?"
 db.query(str, payOrder.orderId, (err, results) => {
   if (err) return res.cc(err)
   if(results.affectedRows!==1)return res.cc('删除订单失败，请检查或刷新后重试')
   return res.cc('删除订单成功！', 0)
 })
}


/** 根据订单id修改订单状态为 已收货
 * @param orderId:订单id
 */
 exports.receiptOrderById = (req, res) => {
  let payOrder = req.body
  let str = "update sp_order set pay_status=3 where order_id=?"
  db.query(str, payOrder.orderId, (err, results) => {
    if (err) return res.cc(err)
    if(results.affectedRows!==1)return res.cc('订单收货失败，请检查或刷新后重试')
    return res.cc('订单收货成功！', 0)
  })
}


// 用户评论已购买的商品
exports.addComment = (req, res) => {
  let b = req.body
  // console.log(b);
  let str = "update sp_order_goods set cm_state=1 where id=?"
  db.query(str,b.orderGoodsId, (err, results) => {
    if (err) return res.cc(err)
    if(results.affectedRows!==1)return res.cc('评论失败，请检查或刷新后重试')
    // return res.cc('订单收货成功！', 0)
    let addStr = "insert into sp_comment (mg_id,goods_id,order_id,order_goods_id,comment,create_time) values(?,?,?,?,?,?)"
    db.query(addStr,[b.userId,b.goodsId,b.orderGoodsId,b.orderId,b.comment,Date.now()], (err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('添加评论失败')
      return res.cc('添加成功！',0)
    })
  })
}


// 根据商品id查询评论
exports.comment = (req, res) => {
  let str = "select * from sp_comment c left join sp_users u on c.mg_id=u.mg_id where c.goods_id=?"
  db.query(str,req.params.id, (err, results) => {
    if (err) return res.cc(err)
    return res.send({status:0,data:results})
  })
}