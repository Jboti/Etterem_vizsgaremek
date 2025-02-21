const express = require('express')
const router = express.Router()

const dishController = require('../controllers/dishController')

router.get("/get-dishes",dishController.getAllDishes)
router.post("/create-new-dish",dishController.createDish)
router.put("/modify-dish",dishController.modifyDish)

module.exports = router