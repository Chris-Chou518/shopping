const { Item } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
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
    const file = req.file
    localFileHandler(file)
      .then(filePath => {
        return Item.create({
          name,
          description,
          price,
          image: filePath || null
        })
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
  },
  editItem: (req, res, next) => {
    Item.findByPk(req.params.id, {
      raw: true
    })
      .then(item => {
        if (!item) return new Error("Item didn't exist")
        res.render('admin/edit-item', { item })
      })
      .catch(err => next(err))
  },
  putItem: (req, res, next) => {
    const { name, price, description } = req.body
    if (!name) throw new Error('Item name is required!')
    const { file } = req
    Promise.all([
      Item.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([item, filePath]) => {
        if (!item) return new Error("Item didn't exist")
        return item.update({
          name,
          price,
          description,
          image: filePath || item.image
        })
      })
      .then(item => {
        req.flash('success_messages', 'Item was successfully updated')
        res.redirect('/admin/items')
      })
      .catch(err => next(err))
  },
  deleteItem: (req, res, next) => {
    return Item.findByPk(req.params.id)
      .then(item => {
        if (!item) return new Error("Item didn't exist")
        return item.destroy()
      })
      .then(() => {
        res.redirect('/admin/items')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
