const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const userAuth = require('../middlewares/userAuth')


router.get("/users", userController.getAllUser)
router.get("/user", userAuth.authenticateToken ,userController.getUser)
router.post("/admin-login",userController.getAdminUser)

//auth
router.post("/authenticate-token",userAuth.authenticateToken,userController.authenticateToken)
router.post("/register", userController.createUser)
router.patch("/verify-user",userController.verifyEmail)
router.post("/login", userController.loginUser)
router.post("/logout", userController.logoutUser)
router.patch("/password-reset-email",userController.sendEmail)

//modify
router.patch("/username",userAuth.authenticateToken, userController.changeUserName)
router.post("/password-reset",userAuth.authenticateTokenforEmail ,userController.changePassword)
router.patch("/allergies",userAuth.authenticateToken,userController.updateAllregies)
router.post("/user-password-validate",userAuth.authenticateToken,userController.deleteUserPasswordCheck)
router.delete("/user",userAuth.authenticateToken,userController.deleteUser)
router.put("/user",userController.adminUserModify)

module.exports = router