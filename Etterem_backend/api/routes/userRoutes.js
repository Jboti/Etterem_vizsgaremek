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
router.post("/create-user", userController.createUser)
// user törlés id alapján, param: id
router.delete("/delete-user/:id",userController.deleteUser)
// aktiválja a usert az email megerősítés után
router.patch("/vertify-user",userController.vertifyEmail)



module.exports = router