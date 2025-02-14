const express = require('express')
const router = express.Router()

const purchaseController = require('../controllers/purchaseController')
const userAuth = require('../middlewares/userAuth')

//Visszaadja az összes rendelést információkkal a felhasználó számára
router.get("/get-all-order-user-only", purchaseController.getAllPurchaseUserInfo)
//Visszaadja az összes aktív rendelést
router.get("/get-all-active-order", purchaseController.getAllActivePurchase)
//Átrakja a rendelést inaktívvá id alapján
router.patch("/in-activate-order/:id",purchaseController.deActivatePurchase)
// rendelés leadása
router.post("/place-order", userAuth.authenticateToken, purchaseController.placeOrder)


module.exports = router