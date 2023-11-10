const { Cart, Item, Category, Coupon } = require('../models')
const cartController = {
  getCart: (req, res, next) => {
    const defaultCode = 'please enter discount!!'
    const code = req.query.code || defaultCode
    return Promise.all([
      Cart.findAll({
        where: { userId: req.user.id },
        include: [
          { model: Item, include: [Category] }
        ]
      }),
      Coupon.findOne({
        where: { code: code },
        raw: true
      })
    ])
      .then(([carts, coupon]) => {
        carts = carts.map(cart => ({
          ...cart.toJSON(),
          totalPrice: cart.Item.price * cart.count
        }))
        let total = 0
        for (let i = 0; i < carts.length; i++) {
          total += carts[i].totalPrice
        }
        const fare = 80
        const discount = (coupon.discount * 0.01) || 1
        const totalWithDiscount = parseInt(total * discount)
        const finalTotalPrice = totalWithDiscount + fare
        res.render('cart/index', {
          carts,
          totalWithDiscount,
          fare,
          finalTotalPrice,
          code
        })
      })
      .catch(err => next(err))
  },
  addCart: (req, res, next) => {
    const { count, itemId } = req.body
    if (!itemId) throw new Error('無此商品!!!')
    return Cart.findOne({
      where: { itemId }
    })
      .then(cart => {
        if (!cart) {
          return Cart.create({
            userId: req.user.id,
            itemId,
            count
          }).then(cart => {
            req.flash('success_messages', '成功加入購物車')
            return res.redirect('back')
          })
            .catch(err => next(err))
        } else {
          req.flash('error_messages', '已加入過購物車')
          res.redirect('back')
        }
      })
      .catch(err => next(err))
  },
  deleteCart: (req, res, next) => {
    return Cart.findByPk(req.params.id)
      .then(cart => {
        if (!cart) throw new Error('購物車內沒有此商品！！！')
        return cart.destroy()
      })
      .then(() => res.redirect('/cart'))
      .catch(err => {
        console.log(err)
        next(err)
      })
  },
  patchCart: (req, res, next) => {
    return Cart.findByPk(req.params.id)
      .then(cart => {
        if (!cart) throw new Error('購物車沒有此商品!!!')
        return cart.update({
          count: req.body.count
        })
      })
      .then(() => {
        res.redirect('/cart')
      })
      .catch(err => next(err))
  },
  getCouponPage: (req, res) => {
    res.render('cart/coupon')
  },
  getCoupon: (req, res, next) => {
    let couponLength
    return Coupon.findAll()
      .then(coupons => {
        couponLength = coupons.length
        const randomNumber = Math.floor(Math.random() * couponLength) + 1
        return Coupon.findByPk(randomNumber)
      })
      .then(coupon => {
        res.render('cart/hadCoupon', { coupon: coupon.toJSON() })
      })
      .catch(err => next(err))
  }
}
module.exports = cartController
