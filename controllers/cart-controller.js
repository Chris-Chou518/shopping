const { Cart, User, Item, Category } = require('../models')
const cartController = {
  getCart: (req, res, next) => {
    return User.findByPk(req.user.id, {
      include: [
        { model: Cart, include: { model: Item, include: [Category] } }
      ]
    })
      .then(user => {
        user = user.toJSON()
        const carts = user.Carts.map(cart => ({
          ...cart,
          totalPrice: cart.Item.price * cart.count
        }))
        let total = 0
        for (let i = 0; i < carts.length; i++) {
          total += carts[i].totalPrice
        }
        const fare = 80
        const finalTotalPrice = total + fare
        res.render('cart/index', {
          user,
          carts,
          total,
          fare,
          finalTotalPrice
        })
      })
      .catch(err => next(err))
  },
  addCart: (req, res, next) => {
    const { itemId } = req.params
    const { count } = req.body
    if (!itemId) throw new Error('無此商品!!!')
    return Cart.create({
      userId: req.user.id,
      itemId,
      count
    })
      .then(cart => {
        req.flash('success_messages', '成功加入購物車')
        return res.redirect('back')
      })
      .catch(err => next(err))
  }
}
module.exports = cartController
