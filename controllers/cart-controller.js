const { Cart, Item, Category } = require('../models')
const cartController = {
  getCart: (req, res, next) => {
    return Cart.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Item, include: [Category] }
      ]
    })
      .then(carts => {
        carts = carts.map(cart => ({
          ...cart.toJSON(),
          totalPrice: cart.Item.price * cart.count
        }))
        let total = 0
        for (let i = 0; i < carts.length; i++) {
          total += carts[i].totalPrice
        }
        const fare = 80
        const finalTotalPrice = total + fare
        res.render('cart/index', {
          carts,
          total,
          fare,
          finalTotalPrice
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
  }
}
module.exports = cartController
