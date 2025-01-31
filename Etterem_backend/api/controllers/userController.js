const userService = require('../services/userService')
const bcrypt = require("bcrypt")
const salt = 10
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')


exports.getUser = async (req,res,next) =>
{
    try
    {
        const id = Number(req.uid)
        
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

exports.createUser = async (req, res, next) => {
    try {
        const currentDate = new Date()
        const { userName, fullName, email, password } = req.body

        const emailExists = await userService.checkForExistingEmail(email)
        const userNameExists = await userService.checkForExistinguserName(userName)
        if(!emailExists){
            if(!userNameExists){
                
                if (!userName) {
                    const error = new Error("User userName is not found!")
                    error.status = 404
                    throw error
                }
                if (!email) {
                    const error = new Error("User email is not found!")
                    error.status = 404
                    throw error
                }
                if (!fullName) {
                    const error = new Error("User fullName is not found!")
                    error.status = 404
                    throw error
                }
                if (!password) {
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
                    password: await bcrypt.hash(password, salt),
                    points: 0,
                    isAdmin: false,
                    isActive: false //email verification után true
                }

                const result = await userService.createUser(user)
                if(result){
                    const token = jwt.sign({ id: result.id }, process.env.JWT_KEY, { expiresIn: "1d" })
                    const verificationLink = `http://localhost:5173/email-verify?token=${token}`

                    async function sendMail() {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL,
                                pass: process.env.EMAIL_PW,
                            },
                        })

                        
                        const mailOptions = {
                            from: 'donercegled@gmail.com',
                            to: email,
                            subject: 'Megerősítő email',
                            html: `
                                <div style="font-family: Arial, sans-serif; text-align: center; background-color: #B71C1C; padding: 20px; border: 3px solid black; border-radius: 8px; width: 90%; max-width: 500px; margin: auto;">
                                    <h1 style="color:#ffffff; text-shadow: 2px 2px 4px black">
                                        Kedves ${result.userName}!
                                    </h1>
                                    <h2 style="color: #ffffff; text-shadow: 1px 1px 2px black;">
                                    Köszönjük, hogy regisztráltál!
                                    </h2>
                                    <h4 style="color: #ffffff; text-shadow: 1px 1px 2px black;">
                                        Kérjük, erősítsd meg az email címed az alábbi gombra kattintva:
                                    </h4>
                                    <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color:rgb(255, 255, 255); color: black; text-decoration: none; border-radius: 4px; font-size: 16px; margin-top: 10px; border: 2px solid black;">
                                        Email cím megerősítése
                                    </a>
                                    <p style="color: #ffffff; margin-top: 20px; font-size: 12px; text-shadow: 1px 1px 2px black">
                                        Ha nem te regisztráltál, kérjük, hagyd figyelmen kívül ezt az üzenetet.
                                    </p>
                                    <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 10px; text-align: center; color: #ddd; font-size: 12px;">
                                        <p style="color: #ddd; text-shadow: 1px 1px 2px black">Döner Cegléd</p>
                                    </div>
                                    <p style="color: #ddd; text-shadow: 1px 1px 2px black">${result.created}</p>
                                </div>
                            `,
                        }

                        const emailRes = await transporter.sendMail(mailOptions);
                        if (!emailRes) {
                            const error = new Error("Failed to send out verification email!")
                            error.status = 404
                            throw error
                        }
                    }
                    sendMail()

                    
                    res.status(201).json(result)
                }else
                    res.status(400).send("Failed creating new user.")
            }else
                res.status(409).json({errmessage:"A felhasználónév már használva van!"})
        }else
            res.status(409).json({errmessage:"Az email cím már használva van!"})
    } catch (error) {
        next(error)
    }
}


exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body
        if (!token) {
            const error = new Error("No token provided!")
            error.status = 403
            throw error 
        }

        let id = null
        jwt.verify(token, process.env.JWT_KEY,(err,decoded) =>{
            if(err){
                res.status(500).json({ errmessage:"Érvénytelen vagy lejárt munkamenet!"})
            }
            id = decoded.id
        })
        id = Number(id)
        if (!id || isNaN(id)) {
            const error = new Error("Email verifying user ID not found or is not a number!")
            error.status = 404
            throw error
        }

        const result = await userService.verifyEmail(id);
        if (!result) {
            const error = new Error("User verification went wrong!")
            error.status = 404
            throw error
        }
        res.status(200).send("User activated!")

    } catch (error) {
        next(error)
    }
}

exports.loginUser = async (req,res,next) =>
{
    try
    {
        let { email, password } = req.body 
        if(!email)
        {
            const error = new Error("Login email not found!")
            error.status = 404
            throw error
        }
        if(!password)
        {
            const error = new Error("Login password not found!")
            error.status = 404
            throw error
        }

        const user = await userService.getUserByEmail(email)
        if(!user){
            res.status(404).json({errmessage:"Az email címmel nincs regisztálva felhasználó!"})
        }
        else if(user.isActive == false){
            res.status(404).json({errmessage:"A felhasználó nincs aktiválva, ha még nem aktiválta email címét tegye meg az azon kapott üzeneten keresztül! Más hiba esetén vegye fel velünk a kapcsolatot a: donercegled@gmail.com címen!"})
        }
        else if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign({ id:user.id }, process.env.JWT_KEY, { expiresIn: "1h" })
            res.status(200).json({token:token})
        }
        else
            res.status(400).json({errmessage:"Helytelen email cím vagy jelszó!"})
    }catch(error){
        next(error)
    }
}

exports.logoutUser = async (req,res,next) =>
{
    try
    {
        res.status(200).send("User logged out successfully!")
    } catch (error) {
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

exports.changePassword = async (req, res, next) => {
    try {
        let { password,token } = req.body
        if (!token) {
            const error = new Error("No token provided!")
            error.status = 403
            throw error 
        }
        let id = null
        
        jwt.verify(token, process.env.JWT_KEY,(err,decoded) =>{
            if(err){
                res.status(500).json({ errmessage:"Érvénytelen vagy lejárt munkamenet!"})
            }
            id = decoded.id
        })
        id = Number(id)
        if (!id || isNaN(id)) {
            const error = new Error("User id not found or id is not a number!")
            error.status = 404
            throw error
        }
        if (!password) {
            const error = new Error("Password not found!")
            error.status = 404
            throw error
        }

        const result = await userService.changePassword(password, id)
        if (!result) {
            const error = new Error("Password change went wrong!")
            error.status = 404
            throw error
        }
        res.status(200).send("Jelszó megváltoztatva!")
    } catch (error) {
        next(error)
        }
}

exports.sendEmail = async(req,res,next) =>{
    try
    {
        const { email } = req.body

        const result = await userService.checkForExistingEmail(email)
    
        if(result){
            const token = jwt.sign({ id: result.id }, process.env.JWT_KEY, { expiresIn: "30m" })
            const verificationLink = `http://localhost:5173/password-reset?token=${token}`

            async function sendMail() {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.EMAIL_PW,
                    },
                })

                
                const mailOptions = {
                    from: 'donercegled@gmail.com',
                    to: email,
                    subject: 'Megerősítő email',
                    html: `
                        <div style="font-family: Arial, sans-serif; text-align: center; background-color: #B71C1C; padding: 20px; border: 3px solid black; border-radius: 8px; width: 90%; max-width: 500px; margin: auto;">
                            <h1 style="color:#ffffff; text-shadow: 2px 2px 4px black">
                                Kedves ${result.userName}!
                            </h1>
                            <h2 style="color: #ffffff; text-shadow: 1px 1px 2px black;">
                            A fiókod jelszavának megváltoztatása.
                            </h2>
                            <h4 style="color: #ffffff; text-shadow: 1px 1px 2px black;">
                                Az alábbi gombra kattintva megtudod változtatni a jelszavad:
                            </h4>
                            <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color:rgb(255, 255, 255); color: black; text-decoration: none; border-radius: 4px; font-size: 16px; margin-top: 10px; border: 2px solid black;">
                                Jelszó megváltoztatása
                            </a>
                            <p style="color: #ffffff; margin-top: 20px; font-size: 12px; text-shadow: 1px 1px 2px black">
                                Ha nem te igényeltél jelszó változtatást, kérjük, hagyd figyelmen kívül ezt az üzenetet.
                            </p>
                            <div style="border-top: 1px solid #ddd; margin-top: 20px; padding-top: 10px; text-align: center; color: #ddd; font-size: 12px;">
                                <p style="color: #ddd; text-shadow: 1px 1px 2px black">Döner Cegléd</p>
                            </div>
                        </div>
                    `,
                }

                const emailRes = await transporter.sendMail(mailOptions);
                if (!emailRes) {
                    const error = new Error("Failed to send out verification email!")
                    error.status = 404
                    throw error
                }
            }
            sendMail()

            
            res.status(201).json(result)
        }else
            res.status(400).send("Failed to send out verification email!")
    }catch(error){
        next(error)
    }
    
}