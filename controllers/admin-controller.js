const { Item } = require('../models')
const adminController = {
  getItems: (req, res, next) => {
    Item.findAll({
      raw: true
    })
      .then(items => res.render('admin/items', { items }))
      .catch(err => next(err))
  }
}
module.exports = adminController
