const express = require('express')
const router = express.Router()

const dishController = require('../controllers/dishController')

router.get("/dishes",dishController.getAllDishes)
router.post("/dish",dishController.createDish)
router.put("/dish",dishController.modifyDish)

module.exports = router