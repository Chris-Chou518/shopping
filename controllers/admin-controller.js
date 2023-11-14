const { Item, User, Category, Coupon } = require('../models')
const { s3FileHandler } = require('../helpers/file-helpers')
const adminController = {
  getItems: (req, res, next) => {
    Item.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(items => res.render('admin/items', { items }))
      .catch(err => next(err))
  },
  createItem: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-item', { categories }))
      .catch(err => next(err))
  },
  postItem: (req, res, next) => {
    const { name, description, price, categoryId } = req.body
    if (!name) throw new Error('Item name is required')
    const file = req.file
    s3FileHandler(file)
      .then(filePath => {
        return Item.create({
          name,
          description,
          price,
          image: filePath || null,
          categoryId
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
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(item => {
        if (!item) throw new Error("Item didn't exist")
        res.render('admin/item', { item })
      })
      .catch(err => next(err))
  },
  editItem: (req, res, next) => {
    return Promise.all([
      Item.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([item, categories]) => {
        if (!item) return new Error("Item didn't exist")
        res.render('admin/edit-item', { item, categories })
      })
      .catch(err => next(err))
  },
  putItem: (req, res, next) => {
    const { name, price, description, categoryId } = req.body
    if (!name) throw new Error('Item name is required!')
    const { file } = req
    Promise.all([
      Item.findByPk(req.params.id),
      s3FileHandler(file)
    ])
      .then(([item, filePath]) => {
        if (!item) return new Error("Item didn't exist")
        return item.update({
          name,
          price,
          description,
          image: filePath || item.image,
          categoryId
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
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => {
        return res.render('admin/user-auth', { users })
      })
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('This user does not exist!')
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更管理員權限')
          return res.redirect('back')
        }
        return user.update({
          isAdmin: !user.isAdmin
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  },
  getCoupons: (req, res, next) => {
    return Coupon.findAll({ raw: true })
      .then(coupons => {
        res.render('admin/coupons', { coupons })
      })
      .catch(err => next(err))
  },
  createCoupon: (req, res) => {
    res.render('admin/create-coupon')
  },
  editCoupon: (req, res, next) => {
    return Coupon.findByPk(req.params.id, { raw: true })
      .then(coupon => {
        return res.render('admin/edit-coupon', { coupon })
      })
      .catch(err => next(err))
  },
  postCoupon: (req, res, next) => {
    const { code, text, discount } = req.body
    return Coupon.findOne({
      where: { code }
    })
      .then(coupon => {
        if (coupon) throw new Error('已經新增過此折扣碼!')
        return Coupon.create({
          code,
          text,
          discount
        })
      })
      .then(coupon => {
        req.flash('success_messages', '新增折扣碼成功')
        return res.redirect('/admin/coupons')
      })
      .catch(err => next(err))
  },
  putCoupon: (req, res, next) => {
    const { code, text, discount } = req.body
    return Coupon.findByPk(req.params.id)
      .then(coupon => {
        if (coupon.code === 'please enter discount!!') throw new Error('這是預設折扣碼，不能編輯!!!')
        if (!coupon) throw new Error('沒有此折扣碼!!!')
        return coupon.update({
          code,
          text,
          discount
        })
      })
      .then(updatedCoupon => {
        req.flash('success_messages', '編輯折扣碼成功')
        return res.redirect('/admin/coupons')
      })
      .catch(err => next(err))
  },
  deleteCoupon: (req, res, next) => {
    return Coupon.findByPk(req.params.id)
      .then(coupon => {
        if (coupon.code === 'please enter discount!!') throw new Error('這是預設折扣碼，不能刪除!!!')
        if (!coupon) throw new Error('沒有此折扣碼!!!')
        return coupon.destroy()
      })
      .then(deletedCoupon => {
        req.flash('success_messages', '成功刪除折扣碼')
        return res.redirect('/admin/coupons')
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
