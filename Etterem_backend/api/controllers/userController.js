const userService = require('../services/userService')
const bcrypt = require("bcrypt")
const salt = 10
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')


exports.getUser = async (req,res,next) =>
{
    try
    {
        let {id} = req.params
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
        if(!email){
            const error = new Error("User email is not found!")
            error.status = 404
            throw error
        }
        if(!fullName){
            const error = new Error("User fullName is not found!")
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
            isActive: false //email verification után true
        }
        
        const result = await userService.createUser(user)

        const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: "30m" })
        const verificationLink = `http://localhost:5173/email-vertify?token=${token}&uid=${result.id}`

        async function sendMail() {
            const transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'donercegled@gmail.com',
                    pass:'pjctmapwxkspxybj'
                }
            })
            const mailOptions = {
                from:'donercegled@gmail.com',
                to:email,
                subject:'Teszt',
                html:`KLIKK <a href=${verificationLink}> ide </a> megerősíteni`
            }

            const emailRes = await transporter.sendMail(mailOptions)
            if(!emailRes)
                {
                    const error = new Error("Failed to send out vertification email!")
                    error.status = 404
                    throw error
                }
        } 
        sendMail()

        if(result)
        {
            console.log("User created successfully!")
            res.status(201).json(result)
        }
        else
            res.status(400).send("Failed creating new user.")
    } catch (error) {
       next(error)
    }
}

exports.vertifyEmail = async (req,res,next) =>
{
    try
    {
        let {token, uid} = req.body
        uid = Number(uid)
        if (!token) 
        {
            const error = new Error("Unauthorized!")
            error.status = 404
            throw error
        }
        if(!uid || isNaN(uid))
        {
            const error = new Error("Email vertifying user id not found or is not a number!")
            error.status = 404
            throw error
        }
        jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err){
                if(err.name == "TokenExpiredError"){
                    const error = new Error("Token expired!")
                    error.status = 403
                    throw error
                }
                const error = new Error("Invalid Token!")
                error.status = 403
                throw error
            }else{
                const result = await userService.vertifyEmail(uid)
                if(!result)
                {
                    const error = new Error("User vertification went wrong!")
                    error.status = 404
                    throw error
                }else{
                    console.log("User activated!")
                    res.status(200).send("User activated!")
                }
            }
        })
        
    } catch (error) {
        next(error)
    }
}

exports.loginUser = async (req,res,next) =>
{
    try
    {
        let { id, password } = req.body;
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
        let {id} = req.params
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