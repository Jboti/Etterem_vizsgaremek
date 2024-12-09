const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const userRoutes = require('./api/routes/userRoutes')

//ROUTES

app.get("/", userRoutes)

module.exports = app