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
        const FavoritedItemsId = req.user.FavoritedItems.map(fi => fi.id)
        const data = items.rows.map(r => ({
          ...r,
          description: r.description.substring(0, 50),
          isFavorited: FavoritedItemsId.includes(r.id)
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
        { model: Comment, include: User },
        { model: User, as: 'FavoritedUsers' }
      ]
    })
      .then(item => {
        if (!item) throw new Error('Item does not exist!')
        return item.increment('viewCounts', { by: 1 })
      })
      .then(item => {
        const isFavorited = item.FavoritedUsers.some(fu => fu.id === req.user.id)
        return res.render('item', {
          item: item.toJSON(),
          isFavorited
        })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Item.findByPk(req.params.id, {
      // raw: true,
      // nest: true,
      include: [
        Category,
        { model: Comment }
      ]
    })
      .then(item => {
        res.render('dashboard', { item: item.toJSON() })
      })
      .catch(err => next(err))
  },
  getFeeds: (req, res, next) => {
    return Promise.all([
      Item.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [Category],
        raw: true,
        nest: true
      }),
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Item],
        raw: true,
        nest: true
      })
    ])
      .then(([items, comments]) => {
        const data = items.map(item => ({
          ...item,
          description: item.description.substring(0, 50)
        }))
        res.render('feeds', {
          items: data,
          comments
        })
      })
  }
}
module.exports = itemController
