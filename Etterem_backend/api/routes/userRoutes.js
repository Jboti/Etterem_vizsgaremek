const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.get("/", userController.getUser)

//működő user beszúrás
const userRepo = require('../repositories/userRepository')

async function createInitialUser() {
    try {
        const currentDate = new Date();
       
        await userRepo.createUser({
            id: null,
            timestamp: currentDate.toISOString(),
            created: currentDate.toISOString(),
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
//eddig

module.exports = router