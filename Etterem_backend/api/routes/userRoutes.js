const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const userAuth = require('../middlewares/userAuth')


// user data
router.get("/get-user", userAuth.authenticateToken ,userController.getUser)
router.get("/get-users", userController.getAllUser)
router.post("/get-admin-user",userController.getAdminUser)

//auth
router.post("/authenticateToken",userAuth.authenticateToken,userController.authenticateToken)
router.post("/register", userController.createUser)
router.patch("/verify-user",userController.verifyEmail)
router.post("/login", userController.loginUser)
router.post("/logout", userController.logoutUser)
router.patch("/password-reset-email",userController.sendEmail)

//modify
router.patch("/user-name-change",userAuth.authenticateToken, userController.changeUserName)
router.post("/password-reset",userAuth.authenticateTokenforEmail ,userController.changePassword)
router.patch("/update-allergies",userAuth.authenticateToken,userController.updateAllregies)
router.post("/delete-user-password-check",userAuth.authenticateToken,userController.deleteUserPasswordCheck)
router.delete("/delete-user",userAuth.authenticateToken,userController.deleteUser)
router.put("/admin-user-modify",userController.adminUserModify)

module.exports = router