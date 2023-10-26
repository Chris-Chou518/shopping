const express = require('express')
const router = express.Router()
const itemController = require('../controllers/item-controller')
const admin = require('./modules/admin')
router.use('/admin', admin)
router.get('/items', itemController.getItems)
router.use('/', (req, res) => res.redirect('/items'))

module.exports = router
