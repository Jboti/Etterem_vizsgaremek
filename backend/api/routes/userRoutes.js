const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')
const userAuth = require('../middlewares/userAuth')



/**
 * @swagger
 * /users:
 *   get:
 *     summary: Vissza adja a felhasználókat
 *     tags: [Felhasználók]
 *     responses:
 *       500:
 *         description: Alap beállított hibakód az errorhandler middleware-ben, valószínű, hogy ismeretlen hibába futott.
 *       200:
 *         description: Egy lista a felhasználókról
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: A felhasználó id-ja
 *                     example: 1
 *                   created:
 *                     type: date
 *                     description: Létrehozás dátuma
 *                     example: 2025-03-20
 *                   userName:
 *                     type: string
 *                     description: A felhasználó neve
 *                     example: Doe
 *                   fullName:
 *                     type: string
 *                     description: A felhasználó teljes neve
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     description: A felhasználó email címe
 *                     example: JohnDoe@exaple.com
 *                   points:
 *                     type: integer
 *                     description: A felhasználó pontjai
 *                     example: 100
 *                   isAdmin:
 *                     type: boolean
 *                     description: A felhasználó admin-e
 *                     example: false
 *                   isActive:
 *                     type: boolean
 *                     description: A felhasználó fiókja aktiv-e
 *                     example: true
 */
router.get("/users", userController.getAllUser)

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Vissza adja egy adott felhasználó adatait
 *     tags: [Felhasználók]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: A felhasználó token-je
 *         schema:
 *           type: string
 *           example: Bearer "token"
 *     responses:
 *       500:
 *         description: Alap beállított hibakód az errorhandler middleware-ben, valószínű, hogy ismeretlen hibába futott.
 *       400:
 *         description: Az authentikációs middleware nem kapott token-t vagy nem tudta kiszedni belőle a user id-t.
 *       403:
 *         description: Invalid token.
 *       404:
 *         description: A felhasználó nem található
 *       200:
 *         description: Vissza adja egy adott felhasználó adatait.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: A felhasználó id-ja
 *                   example: 1
 *                 created:
 *                   type: string
 *                   format: date
 *                   description: Létrehozás dátuma
 *                   example: 2025-03-20
 *                 userName:
 *                   type: string
 *                   description: A felhasználó neve
 *                   example: Doe
 *                 fullName:
 *                   type: string
 *                   description: A felhasználó teljes neve
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   description: A felhasználó email címe
 *                   example: JohnDoe@exaple.com
 *                 points:
 *                   type: integer
 *                   description: A felhasználó pontjai
 *                   example: 100
 *                 allergenables:
 *                   type: array
 *                   description: A felhasználó allergiái
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: 
 *                         type: integer
 *                         description: A kapcsolat id-ja
 *                         example: 1
 *                       allergenable_type:
 *                         type: string
 *                         description: A kapcsolat tipusa (ebben az esetben user)
 *                         example: user
 *                       allergenable_id:
 *                         type: integer
 *                         description: Az allergia id-ja
 *                         example: 1
 *                       allergy:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Az allergia id-ja
 *                             example: 1
 *                           name:
 *                             type: string
 *                             description: Az allergia neve
 *                             example: gluten
 *       
 */
router.get("/user", userAuth.authenticateToken ,userController.getUser)

/**
 * @swagger
 * /admin-login:
 *   post:
 *     summary: Asztali alkalmazásban haszánált bejelentkezéshez
 *     tags: [Felhasználók]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: A felhasználó email címe
 *                 example: JohnDoe@exaple.com
 *               password:
 *                 type: string
 *                 description: A felhasználó jelszava
 *                 example: jelszo123
 *     responses:
 *       500:
 *         description: Alap beállított hibakód az errorhandler middleware-ben, valószínű, hogy ismeretlen hibába futott.
 *       200:
 *         description: Amennyiben a felhasználó admin, vissza adja az azonosításhoz fontos adatait és beengedi az admin felületre.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: A felhasználó email címe
 *                   example: 1
 *                 userName:
 *                   type: string
 *                   description: A felhasználó felhasználóneve
 *                   example: Doe
 */
router.post("/admin-login",userController.getAdminUser)

//auth
router.post("/authenticate-token",userAuth.authenticateToken,userController.authenticateToken)
router.post("/register", userController.createUser)
router.patch("/verify-user",userController.verifyEmail)
router.post("/login", userController.loginUser)
router.post("/logout", userController.logoutUser)
router.patch("/password-reset-email",userController.sendEmail)

//modify
router.patch("/username",userAuth.authenticateToken, userController.changeUserName)
router.post("/password-reset",userAuth.authenticateTokenforEmail ,userController.changePassword)
router.patch("/allergies",userAuth.authenticateToken,userController.updateAllregies)
router.post("/user-password-validate",userAuth.authenticateToken,userController.deleteUserPasswordCheck)
router.delete("/user",userAuth.authenticateToken,userController.deleteUser)
router.put("/user",userController.adminUserModify)

module.exports = router