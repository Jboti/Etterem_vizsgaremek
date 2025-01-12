const express = require('express')
const router = express.Router()

const purchaseController = require('../controllers/purchaseController')

//getAllActiveOrder
router.get("/getAllActiveOrder", purchaseController.getAllActivePurchase)
//Rendelés leadás, param: (userid) uid, body: totalPrice, message, dishInfo -> {dishIds: [...], dishAmounts: [...], dishCustomizations: [...]}
router.post("/placeOrder/:uid", purchaseController.PlaceOrder)



module.exports = router