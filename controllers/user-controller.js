const bcrypt = require('bcryptjs')
const { User, Comment, Item, Favorite, Followship } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')
    return User.findOne({
      where: { email: req.body.email }
    })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          name: req.body.name,
          birthday: req.body.birthday,
          email: req.body.email,
          password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入')
    res.redirect('/items')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: { model: Comment, include: Item }
    })
      .then(someone => {
        someone = someone.toJSON()
        const items = someone.Comments
        // console.log(items)
        const ItemData = items.map(obj => obj.Item)
        // console.log(ItemData)
        const uniqueItems = ItemData.filter((obj, index) => {
          return index === ItemData.findIndex(o => obj.name === o.name)
        })
        if (!someone) throw new Error('User does not exist!')
        return res.render('users/profile', { someone, uniqueItems })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return res.render('users/edit')
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) throw new Error('User name is required!')
    const file = req.file
    return Promise.all([
      User.findByPk(req.user.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        return res.redirect(`/users/${req.user.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    return Promise.all([
      Item.findByPk(req.params.itemId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          itemId: req.params.itemId
        }
      })
    ])
      .then(([item, favorite]) => {
        if (!item) throw new Error('無此商品！')
        if (favorite) throw new Error('您已收藏此商品！')
        return Favorite.create({
          userId: req.user.id,
          itemId: req.params.itemId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        itemId: req.params.itemId
      }
    })
      .then(favorite => {
        if (!favorite) throw new Error('您原本就無收藏此商品！')
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          isFollowed: req.user.Followings.some(f => f.id === user.id)
        }))
          .sort((a, b) => b.followerCount - a.followerCount)
        res.render('top-users', { users })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error('沒有這個人＠０＠')
        if (followship) throw new Error('你已經追蹤過這個人囉！')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('你沒有追蹤此人唷！')
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController
