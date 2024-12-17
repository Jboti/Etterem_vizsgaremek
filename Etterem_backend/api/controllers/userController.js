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

exports.addUser = async (req,res,next) =>
{
    console.log('ads')
    try {
        const currentDate = new Date();
    
        await userRepository.createUser({
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
        res.status(201).send("User created successfully")
    } catch (error) {
        console.error("Error creating user:", error)
    }
}