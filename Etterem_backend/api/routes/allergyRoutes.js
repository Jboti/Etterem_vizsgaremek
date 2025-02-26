const express = require('express')
const router = express.Router()

const allergyController = require('../controllers/allergyController')

router.post("/create-new-allergy",allergyController.createAllergy)

module.exports = router