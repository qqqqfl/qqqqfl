const db = require('../mysql/index')

exports.goodsList = (req, res) => {
  // let str = "select * from sp_category"
  // let cateData;
  // db.query(str, (err, results) => {
  //   if (err) return res.cc(err)
  //   // return res.send(results)
  //   cateData = results
  //   let str2 = "select * from sp_goods"
  //   let goodsData;
  //   db.query(str2, (err2, resu) => {
  //     if (err2) return res.cc(err2)
  //     // return res.send(results)
  //     // cateData = results
  //     goodsData = resu
  //     cateData.forEach(item => {
  //       item.data = []
  //       goodsData.forEach(i => {
  //         if (item.id == i.category_id) {
  //           item.data.push(i)
  //         }
  //       })
  //     });
  //   return res.send(cateData)
  //   })
  //   // res.send(goodsData)
  // })
  let str = "select * from sp_goods g left join sp_category c on g.category_id=c.id"
  db.query(str, (err, results) => {
    if (err) return res.cc(err)
    return res.send({status:0,data:results})
  })
}

/**
 * 1.获取一级商品分类 表中字段 level=0 为一级分类
 * 2.获取二级商品分类 用二级分类中父id 找到对应一级分类
 * 3.获取商品总列表 商品对应父id 为二级分类
 * 4.遍历三个数组 依次套入
 */
exports.goodsType = (req, res) => {
  
  // let str = "select * from sp_category where category_level=0"
  // db.query(str, (err, results) => {
  //   if (err) return res.cc(err)
    let str1 = "select * from sp_category where category_level=1"
    db.query(str1, (err1, res1) => {
      
      let str2 = "select * from sp_goods"
      let goodsData;
      db.query(str2, (err2, res2) => { 
      if (err2) return res.cc(err2)
        // results.forEach(item => {
        //   item.data = []
          res1.forEach(i => {
            i.data=[]
            // if (i.parent_id == item.id) {
            //   item.data.push(i)
            // }
            res2.forEach(i2 => {
              if (i.id == i2.category_id) {
                i.data.push(i2)
              }
            })

          })
        // })
       return res.send({status:0,data:res1})
      })
    // })

  })
}

// 根据商品id查找商品详情
exports.goodsDetails = (req, res) => {
  
  let str = "select * from sp_goods g left join sp_category c on g.category_id=c.id where goods_id=?"
  db.query(str,req.params.id, (err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('查找商品失败')
    res.send({status:0,data:results[0]})
  })
}

// 传入商品id,和用户id把对应商品信息和数量加入该用户的购物车中
exports.addCart = (req, res) => {
  // 首先传入用户id 查看该用户对应的购物车信息
  let str1 = "select * from sp_cart where mg_id=?"
  // 查找用户购物车中的商品id 是否和 新加入的商品id 一样
  // 如果一样就提示用户该商品已经在购物车中，请勿重复添加
  db.query(str1, req.body.id, (err, results) => {
    if (err) return res.cc(err)
    // return res.send({ status: 0, data: results })
    const isHave =  results.some(item => item.goods_id == req.body.goodsId)
    if (isHave) {
        return res.cc('该商品已经在购物车中，请勿重复添加')
    } else {
      // 定义插入语句
      let str = "insert into sp_cart (mg_id,goods_id,goods_number,create_time,goods_state) values(?,?,?,?,?)"
      db.query(str,[req.body.id,req.body.goodsId,req.body.goodsNum,Date.now(),'0'], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('加入购物车失败')
        return res.cc('加入购物车成功',0)
      })
    }
    // res.send({status:0,data:results[0]})
  })
  
  
}

// 根据商品id修改商品信息
exports.updGoods = (req, res) => {
  let g = req.body
  let str = 'update sp_goods set goods_name=?,goods_des=?,goods_price=?,goods_num=? where goods_id=?'
  db.query(str, [g.goods_name,g.goods_des,g.goods_price,g.goods_num,g.goods_id],(err, results) => {
    if (err) return res.cc(err)
    if (results.affectedRows !== 1) return res.cc('修改失败')
    res.cc('修改成功',0)
  })
}

// 用户生成订单后减少商品库存
// 根据商品id修改商品库存
exports.updGoodsNum = (req, res) => {
  let g = req.body
  console.log(g);
  let str = "select goods_id,goods_num from sp_goods where goods_id=?"
  db.query(str, g.goodsId,(err, results) => {
    if (err) return res.cc(err)
    if (results.length !== 1) return res.cc('查询商品数量出错')
    // res.send(results)
    let str = 'update sp_goods set goods_num=? where goods_id=?'
    let num = parseInt(results[0].goods_num) - parseInt(g.goodsNum)
    // res.send(num)
    if(num<0)return res.cc('库存不够，请修改购买数量！')
    db.query(str, [num,g.goodsId],(err, results) => {
      if (err) return res.cc(err)
      if (results.affectedRows !== 1) return res.cc('修改库存失败')
      res.cc('修改库存成功',0)
    })
  })
  
}