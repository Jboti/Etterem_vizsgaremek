const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.get("/getUser", userController.getUser)
router.get("/getUsers", userController.getUsers)
router.post("/createUser", userController.createUser)

//router.get("/createUser", userController.createUser) így jól műkszik



module.exports = router