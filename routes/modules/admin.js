const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
router.get('/items/create', adminController.createItem)
router.get('/items/:id', adminController.getItem)
router.post('/items', adminController.postItem)
router.get('/items', adminController.getItems)
router.use('/', (req, res) => res.redirect('/admin/items'))
module.exports = router
