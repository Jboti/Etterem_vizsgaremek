const express = require('express')
const router = express.Router()

const purchaseController = require('../controllers/purchaseController')

router.get("/getPurchases", purchaseController.getAllPurchase)




module.exports = router