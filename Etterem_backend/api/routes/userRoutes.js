const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const userAuth = require('../middlewares/userAuth')




// 1 user lekérés id alapján
router.get("/get-user", userAuth.authenticateToken ,userController.getUser)
// összes user adatlekérdezése
router.get("/get-users", userController.getAllUser)
// user kreálása, (regisztráció), body: userName,fullName,email,password
router.post("/register", userController.createUser)
// user login, body: email, jelszo
router.post("/login", userController.loginUser)
// user logout
router.post("/logout", userController.logoutUser)
// user törlés id alapján, param: id
router.delete("/delete-user/:id",userController.deleteUser)
// aktiválja a usert az email megerősítés után
router.patch("/verify-user",userController.verifyEmail)
// emailt küld, hogy jelszót lehessen változtatni
router.patch("/password-reset-email",userController.sendEmail)
// user jelszó változtatása
router.post("/password-reset",userAuth.authenticateToken ,userController.sendEmail)
// user felhnév változtatása
router.patch("/user-name-change",userAuth.authenticateToken, userController.changeUserName)


module.exports = router