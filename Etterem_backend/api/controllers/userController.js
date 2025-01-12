const userRepository = require('../repositories/userRepository')

exports.getUser = async (req,res,next) =>
{
    try {
        const {id} = req.params
        id = Number(id)
        if(!id || isNaN(id)){
            const error = new Error("User id not found or id is not a number!")
            error.status = 404
            throw error
        }
        const user = await userRepository.getUser(id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

exports.getAllUser = async (req,res,next) =>
{
    try {
        const users = await userRepository.getAllUser()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

exports.createUser = async (req,res,next) =>
{
    try {
        const currentDate = new Date()
        const {userName, fullName, email, password } = req.body
        if(!userName){
            const error = new Error("User userName is not found!")
            error.status = 404
            throw error
        }
        if(!fullName){
            const error = new Error("User fullName is not found!")
            error.status = 404
            throw error
        }
        if(!email){
            const error = new Error("User email is not found!")
            error.status = 404
            throw error
        }
        if(!password){
            const error = new Error("User password is not found!")
            error.status = 404
            throw error
        }
        const user = {
            id: null,
            timestamp: currentDate.toISOString(),
            created: currentDate.toISOString(),
            userName: userName,
            fullName: fullName,
            email: email,
            password: password,
        }
        await userRepository.createUser(user)
        console.log("User created successfully!")
        res.status(201).send("User created successfully!")
    } catch (error) {
       next(error)
    }
}

exports.deleteUser = async (req,res,next) =>
{
    try {
        const {id} = req.params
        id = Number(id)
        if(!id || isNaN(id)){
            const error = new Error("User id not found or id is not a number!")
            error.status = 404
            throw error
        }
        await userRepository.deleteUser(id)
        console.log("User deleted successfully!")
        res.status(200).send("User deleted successfully!")
    } catch (error) {
        next(error)
    }
}