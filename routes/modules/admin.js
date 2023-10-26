const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
router.get('/items', adminController.getItems)
router.use('/', (req, res) => res.redirect('/admin/items'))
module.exports = router