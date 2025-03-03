const express = require('express')
const router = express.Router()

const purchaseController = require('../controllers/purchaseController')
const userAuth = require('../middlewares/userAuth')

// usernek részére
router.get("/get-all-order-user-only", userAuth.authenticateToken, purchaseController.getAllPurchaseUserInfo)
router.post("/place-order", userAuth.authenticateToken, purchaseController.placeOrder)

// alkalmazás részére
router.get("/get-all-active-order", purchaseController.getAllActivePurchase)
router.patch("/in-activate-order/:id",purchaseController.deActivatePurchase)


module.exports = router