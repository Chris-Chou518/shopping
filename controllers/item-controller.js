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
  }
}
module.exports = itemController
