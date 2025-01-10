const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.get("/getUser", userController.getUser)
router.get("/getUsers", userController.getAllUser)
router.post("/createUser", userController.createUser)



module.exports = router