const { Item, Category } = require('../models')
const itemController = {
  getItems: (req, res, next) => {
    return Item.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(items => {
        const data = items.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('items', { items: data })
      })
      .catch(err => next(err))
  },
  getItem: (req, res, next) => {
    return Item.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(item => {
        if (!item) throw new Error('Item does not exist!')
        return res.render('item', { item })
      })
      .catch(err => next(err))
  }
}
module.exports = itemController
