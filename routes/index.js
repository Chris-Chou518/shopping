const express = require('express')
const router = express.Router()
const itemController = require('../controllers/item-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/items', itemController.getItems)
router.use('/', (req, res) => res.redirect('/items'))

module.exports = router
