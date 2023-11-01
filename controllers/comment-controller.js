const { Comment, User, Item } = require('../models')
const commentController = {
  postComment: (req, res, next) => {
    const { text, itemId } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment is required!')
    return Promise.all([
      User.findByPk(userId),
      Item.findByPk(itemId)
    ])
      .then(([user, item]) => {
        if (!user) throw new Error('User does not exist!')
        if (!item) throw new Error('Item does not exist!')
        return Comment.create({
          text,
          userId,
          itemId
        })
      })
      .then(() => {
        return res.redirect(`/items/${itemId}`)
      })
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error('Comment does not exist!')
        return comment.destroy()
      })
      .then(deletedComment => {
        return res.redirect(`/items/${deletedComment.itemId}`)
      })
      .catch(err => next(err))
  }
}
module.exports = commentController
