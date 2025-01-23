const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const userAuth = require("../middlewares/userAuth")

router.get("/", [ userAuth.verifyToken ], userController.getAllUser)    


// 1 user lekérés id alapján, param: id
router.get("/get-user/:id", userController.getUser)
// összes user adatlekérdezése
router.get("/get-users", userController.getAllUser)
// user kreálása, (regisztráció), body: userName,fullName,email,password
router.post("/register", userController.createUser)
// user login, body: email, jelszo
router.post("/login")
// user törlés id alapján, param: id
router.delete("/delete-user/:id",userController.deleteUser)
// aktiválja a usert az email megerősítés után
router.patch("/verify-user",userController.verifyEmail)



module.exports = router