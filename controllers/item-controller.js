const { Item, Category, User, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const itemController = {
  getItems: (req, res, next) => {
    const DEFAULT_LIMIT = 8
    const categoryId = Number(req.query.categoryId) || ''
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    return Promise.all([
      Item.findAndCountAll({
        raw: true,
        nest: true,
        include: [Category],
        where: {
          ...categoryId ? { categoryId: categoryId } : {}
        },
        offset,
        limit
      }),
      Category.findAll({ raw: true })
    ])
      .then(([items, categories]) => {
        const data = items.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('items', {
          items: data,
          categories,
          categoryId,
          pagination: getPagination(limit, page, items.count)
        })
      })
      .catch(err => next(err))
  },
  getItem: (req, res, next) => {
    return Item.findByPk(req.params.id, {
      nest: true,
      include: [
        Category,
        { model: Comment, include: User }
      ]
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
