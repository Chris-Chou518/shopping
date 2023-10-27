const { Item } = require('../models')
const adminController = {
  getItems: (req, res, next) => {
    Item.findAll({
      raw: true
    })
      .then(items => res.render('admin/items', { items }))
      .catch(err => next(err))
  },
  createItem: (req, res) => {
    return res.render('admin/create-item')
  },
  postItem: (req, res, next) => {
    const { name, description, price } = req.body
    if (!name) throw new Error('Item name is required')
    Item.create({
      name,
      description,
      price
    })
      .then(() => {
        req.flash('success_messages', 'Item was successfully created!')
        res.redirect('/admin/items')
      })
      .catch(err => next(err))
  },
  getItem: (req, res, next) => {
    Item.findByPk(req.params.id, {
      raw: true
    })
      .then(item => {
        if (!item) throw new Error("Item didn't exist")
        res.render('admin/item', { item })
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
