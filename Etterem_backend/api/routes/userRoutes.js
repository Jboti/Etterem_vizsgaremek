const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const userAuth = require("../middlewares/userAuth")

router.get("/", [ userAuth.verifyToken ], userController.getAllUser)    


// 1 user lekérés id alapján, param: id
router.get("/getUser/:id", userController.getUser)
// összes user adatlekérdezése
router.get("/getAllUser", userController.getAllUser)
// user kreálása, (regisztráció), body: userName,fullName,email,password
router.post("/createUser", userController.createUser)
// user törlés id alapján, param: id
router.delete("/deleteUser/:id",userController.deleteUser)



module.exports = router