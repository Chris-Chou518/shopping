const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')
router.get('/items', authenticatedAdmin, adminController.getItems)
router.use('/', (req, res) => res.redirect('/admin/items'))
module.exports = router
