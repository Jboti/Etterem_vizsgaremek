const userRepository = require('../repositories/userRepository')

exports.getUser = async (req,res,next) =>
{
    try {
        //const {index} = req.params
        const index = 1
        const user = await userRepository.getUser(index)
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
        //const {userName, fullName, email, password } = req.body
        const currentDate = new Date();
        // const user = {
        //     id: null,
        //     timestamp: currentDate.toISOString(),
        //     created: currentDate.toISOString(),
        //     userName: userName,
        //     fullName: fullName,
        //     email: email,
        //     password: password,
        // }
         let users = [{
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
        },
        {
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
        }]
       
        await userRepository.createUser(users[0])
        console.log("User created successfully")
        res.status(201).send("User created successfully")
    } catch (error) {
        console.error("Error creating user:", error)
    }
}

exports.deleteUser = async (req,res,next) =>
{
    try {
        const {id} = req.params 
        await userRepository.deleteUser(id)
    } catch (error) {
        console.error("error deleting user: ",error)
    }
}