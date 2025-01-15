const userService = require('../services/userService')
const bcrypt = require("bcrypt")
const salt = 10
const jwt = require("jsonwebtoken")


exports.getUser = async (req,res,next) =>
{
    try
    {
        const {id} = req.params
        id = Number(id)
        if(!id || isNaN(id)){
            const error = new Error("User id not found or id is not a number!")
            error.status = 404
            throw error
        }

        const user = await userService.getUser(id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

exports.getAllUser = async (req,res,next) =>
{
    try {
        const users = await userService.getAllUser()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

exports.createUser = async (req,res,next) =>
{
    try
    {
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
            password: await bcrypt.hash(password,salt),
            points: 0,
            isAdmin: false,
            isActive: true
        }

        const result = await userService.createUser(user)
        if(result)
        {
            console.log("User created successfully!")
            const token = jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: "30m" })
            const data = {data:{token:token}}
            res.status(201).json(data)
        }
        else
            res.status(400).send("Failed creating new user.")
    } catch (error) {
       next(error)
    }
}

exports.loginUser = async (req,res,next) =>
{
    try
    {
        const { id, password } = req.body;
        id = Number(id)
        if(!id || isNaN(id))
        {
            const error = new Error("Login user id not found or id not a number!")
            error.status = 404
            throw error
        }
        if(!password)
        {
            const error = new Error("Login password not found!")
            error.status = 404
            throw error
        }

        const user = await userService.getUser(id)
        if(await bcrypt.compare(password, user.password))
        {
            const token = jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: "30m" })
            res.status(200).json(token)
        }
        else
            res.status(400).send("Wrong password")
    }catch(error){
        next(error)
    }
}

exports.deleteUser = async (req,res,next) =>
{
    try
    {
        const {id} = req.params
        id = Number(id)
        if(!id || isNaN(id)){
            const error = new Error("User id not found or id is not a number!")
            error.status = 404
            throw error
        }
        
        await userService.deleteUser(id)
        res.status(200).send("User deleted successfully!")
        console.log("User deleted successfully!")
    } catch (error) {
        next(error)
    }
}