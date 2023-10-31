const { Item, Category } = require('../models')
const itemController = {
  getItems: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Item.findAll({
        raw: true,
        nest: true,
        include: [Category],
        where: {
          ...categoryId ? { categoryId: categoryId } : {}
        }
      }),
      Category.findAll({ raw: true })
    ])
      .then(([items, categories]) => {
        const data = items.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('items', {
          items: data,
          categories,
          categoryId
        })
      })
      .catch(err => next(err))
  },
  getItem: (req, res, next) => {
    return Item.findByPk(req.params.id, {
      nest: true,
      include: [Category]
    })
      .then(item => {
        if (!item) throw new Error('Item does not exist!')
        return item.increment('viewCounts', { by: 1 })
      })
      .then(item => {
        return res.render('item', {
          item: item.toJSON()
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Item.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(item => {
        res.render('dashboard', { item })
      })
      .catch(err => next(err))
  }
}
module.exports = itemController
