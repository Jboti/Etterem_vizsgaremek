const express = require('express')
const router = express.Router()

const purchaseController = require('../controllers/purchaseController')

//Visszaadja az összes aktív rendelést
router.get("/get-all-active-order", purchaseController.getAllActivePurchase)
//Rendelés leadás, param: (userid) uid, body: totalPrice, message, dishInfo -> {dishIds: [...], dishAmounts: [...], dishCustomizations: [...]}
router.post("/place-order/:uid", purchaseController.PlaceOrder)
//Átrakja a rendelést inaktívvá id alapján
router.patch("/in-activate-order/:id",purchaseController.deActivatePurchase)


module.exports = router