const express = require('express')
const router = express.Router()

const dishController = require('../controllers/dishController')

router.get('/getAllDishes',dishController.getAllDishes)

module.exports = router