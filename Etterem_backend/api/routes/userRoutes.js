const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.get("/", userController.getUser)

const userRepo = require('../repositories/userRepository')

async function createInitialUser() {
    try {
        await userRepo.createUser({
            id: null,
            timestamp: null,
            created: null,
            userName: 'béla',
            fullName: 'Big Béla',
            email: 'bigbela@gmail.com',
            password: 'asd',
            points: 200,
            isAdmin: true,
            isActive: true
        })
        console.log("User created successfully")
    } catch (error) {
        console.error("Error creating user:", error)
    }
}

createInitialUser()

module.exports = router