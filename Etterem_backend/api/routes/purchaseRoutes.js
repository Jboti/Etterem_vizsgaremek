const express = require('express')
const router = express.Router()

const purchaseController = require('../controllers/purchaseController')
const userAuth = require('../middlewares/userAuth')

// usernek részére
router.get("/user-orders", userAuth.authenticateToken, purchaseController.getAllPurchaseUserInfo)
router.post("/order", userAuth.authenticateToken, purchaseController.placeOrder)

// alkalmazás részére
router.get("/active-orders", purchaseController.getAllActivePurchase)
router.patch("/in-activate-order/:id",purchaseController.deActivatePurchase)


module.exports = router