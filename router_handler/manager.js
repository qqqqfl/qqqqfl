const db = require('../mysql/index')

// 获取用户所有信息
exports.getAllUser = (req, res) => {
  let str = "select * from sp_users where is_delete=0"
  db.query(str, (err, results) => {
    if (err) return res.cc(err)
    return res.send({ status: 0, data: results })
  })
}

//获取用户所有的订单
exports.getAllOrder = (req, res) => {
  // let str = " select * from sp_order o,sp_address ad where o.user_id=? and o.addr_id=ad.ad_id order by create_time desc"
  let str = `select o.order_id,
                    o.user_id,
                    o.order_number,
                    o.order_price,
                    o.pay_status,
                    o.order_pay,
                    o.addr_id,
                    o.create_time,
                    o.is_delete,
                    ad.ad_id,
                    ad.user_id,
                    ad.ad_name,
                    ad.ad_phone,
                    ad.ad_addr,
                    u.mg_id,
                    u.mg_name,
                    u.mg_pwd,
                    u.mg_phone,
                    u.mg_money,
                    u.mg_time,
                    u.mg_sex,
                    u.mg_state
   from sp_order o,sp_address ad,sp_users u where o.addr_id=ad.ad_id and o.user_id=u.mg_id order by create_time desc`
  db.query(str, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    // res.send({status:0,data:results})
    return res.send({status:0,data:results})
  })
}

//获取用户所有的订单
exports.sendOrder = (req, res) => {
  let payOrder = req.body
  let str = "update sp_order set pay_status=2 where order_id=?"
  db.query(str, payOrder.orderId, (err, results) => {
    if (err) return res.cc(err)
    if(results.affectedRows!==1)return res.cc('订单发货失败，请检查或刷新后重试')
    return res.cc('订单发货成功！', 0)
  })
}


//添加商品
exports.addGoods = (req, res) => {
  let g = req.body
  let str = "select * from sp_goods where goods_name=?"
  db.query(str, g.goodsName, (err, results) => {
    if (err) return res.cc(err)
    // 检查是否存在同名商品
    if (results.length == 1) return res.cc('商品已存在，请修改后重试！')
    // 不存在就添加商品进去
    let addStr = "insert into sp_goods (goods_name,goods_pic,goods_des,goods_price,goods_num,goods_units,category_id,create_time) values(?,?,?,?,?,?,?,?)"
    db.query(addStr, [g.goodsName,g.goodsPic,g.goodsDes,g.goodsPrice,g.goodsNum,g.goodsUnits,g.categoryId,Date.now()], (err, results) => {
      if (err) return res.cc(err)
      if(results.affectedRows!==1)return res.cc('添加商品失败')
      return res.cc('添加成功', 0)
    })
  })
  
}


//添加商品分类
exports.addGoodsType = (req, res) => {
  let str = "select * from sp_category where category_name=?"
  db.query(str,req.body.categoryName,(err, results) => {
    if(err)return res.cc(err)
    if (results.length == 1) return res.cc('分类名称已存在！')
    let str1 = "insert into sp_category (category_name,parent_id,category_level) values(?,?,?)"
    db.query(str1,[req.body.categoryName,0,1], (err1, result) => {
      if (err1) return res.cc(err1)
      if (result.affectedRows !== 1) return res.cc('添加分类失败')
      return res.cc('添加成功',0)
    })
  })
}

//获取分类详情根据id
exports.typeById = (req, res) => {
  let str = "select * from sp_category where id=?"
  db.query(str, req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if(results.length!==1)return res.cc('查询失败')
    return res.send({status:0,data:results[0]})
  })
}


//根据id修改分类名称
exports.updType = (req, res) => {
  let str = "update sp_category set category_name=? where id=?"
  db.query(str, [req.body.categoryName,req.body.id], (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('修改失败')
      return res.cc('修改成功',0)
    })
}


//根据id删除分类
exports.deleteType = (req, res) => {
  let str = "delete from sp_category where id=?"
  db.query(str,req,params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('删除失败')
      return res.cc('删除成功',0)
    })
}


// 管理员获取所有商品的评论
exports.getAllComment = (req, res) => {
  let str = "SELECT c.id,c.create_time,c.comment,u.mg_name,g.goods_name,g.goods_pic FROM sp_comment c,sp_users u,sp_goods g  where c.mg_id=u.mg_id and c.goods_id=g.goods_id;"
  db.query(str, (err, results) => {
    if (err) return res.cc(err)
    return res.send({status:0,data:results})
  })
}

// 管理员获取首页轮播图
exports.getAllBanner = (req, res) => {
  let str = "SELECT b.banner_pic,b.id,b.create_time,g.goods_name,b.goods_id from sp_banner b,sp_goods g where b.goods_id=g.goods_id"
  db.query(str, (err, results) => {
    if (err) return res.cc(err)
    return res.send({status:0,data:results})
  })
}

// 管理员添加轮播图
/**
 * 
 * @param {banner_pic} 轮播图图片地址 
 * @param {goods_id} 关联商品id 
 * @param {create_time} 上传时间 
 * 
 */
exports.addBanner = (req, res) => {
  let str = "insert into sp_banner (banner_pic,goods_id,create_time) values(?,?,?)"
  db.query(str, [req.body.bannerPic,req.body.goodsId,Date.now()],(err, results) => {
    if (err) return res.cc(err)
    if(results.affectedRows!==1)return res.cc('添加失败')
    // return res.send({status:0,data:results})
    return res.cc('添加成功',0)
  })
}


//
/**
 * 管理员获取每天的销售额
 */
// exports.getSalesVolume = (req, res) => {
//   let str = "select order_price,create_time from sp_order"
//   db.query(str, (err, results) => {
//     if (err) return res.cc(err)
//     results.forEach(item => {
//       item.create_time = (new Date(parseInt(item.create_time)).toLocaleString().replace(/:\d{1,2}$/, ' ')).split(' ')[0]
//       let arr = []
//       arr.forEach(i => {
//         if (i.create_time !== item.create_time) {
//           arr.push(item)
//         } else {
//           i.order_price+=item.order_price
//         }
//       })
//       return arr
//     });
//     res.send(results)

//   })
// }
//
/**
 * 管理员获取每天的销售额
 */
exports.getSalesVolume = (req, res) => {
    let str = "select order_price,create_time from sp_order where create_time like '?%'"
    db.query(str,parseInt((Date.now() - (req.params.n*86400000)) / 100000000), (err, results) => {
      if (err) return res.cc(err)
      res.send(results)
    })
}


/**
 * 管理员获取七天内的总销售额
 */
exports.getTotalSales = (req, res) => {
    let str = "select order_price,create_time from sp_order where create_time < ?"
    db.query(str,parseInt(Date.now() - (req.params.n*86400000)), (err, results) => {
      if (err) return res.cc(err)
      res.send(results)
    })
}


