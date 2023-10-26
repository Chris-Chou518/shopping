const bcrypt = require('bcryptjs')
const { User }= require('../models')
const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp:(req, res, next) => {
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
        res.redirect('signin')
      }) 
      .catch(err => next(err))
  }
}
module.exports = userController
