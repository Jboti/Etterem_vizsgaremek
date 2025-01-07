const userRepository = require('../repositories/userRepository')

exports.getUser = async (req,res,next) =>
{
    try {
        const user = await userRepository.getUser(1)
        res.status(200).json(user)
    } catch (error) {
        console.error("Error getting user:", error)
    }
}

exports.getUsers = async (req,res,next) =>
{
    try {
        const users = await userRepository.getUsers()
        res.status(200).json(users)
    } catch (error) {
        console.error("Error getting users:", error)
    }
}

exports.createUser = async (req,res,next) =>
{
    try {
        const currentDate = new Date();
        //  let user = {
        //     id: null,
        //     timestamp: currentDate.toISOString(),
        //     created: currentDate.toISOString(),
        //     userName: 'béla',
        //     fullName: 'Big Béla',
        //     email: 'bigbela@gmail.com',
        //     password: 'asd',
        //     points: 200,
        //     isAdmin: true,
        //     isActive: true
        // }
         let user = {
            id: null,
            timestamp: currentDate.toISOString(),
            created: currentDate.toISOString(),
            userName: 'sanyi',
            fullName: 'Big Sanyi',
            email: 'bigsanya@gmail.com',
            password: 'abcdefg',
            points: 20000,
            isAdmin: false,
            isActive: true
        }
        await userRepository.createUser(user)
        console.log("User created successfully")
        res.status(201).send("User created successfully")
    } catch (error) {
        console.error("Error creating user:", error)
    }
}