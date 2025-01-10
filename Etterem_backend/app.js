const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const errorHandler = require('./api/middlewares/errorHandler')
const userRoutes = require('./api/routes/userRoutes')
const purchaseRoutes = require('./api/routes/purchaseRoutes')

//ROUTES

app.use("/user", userRoutes)
app.use("/purchase", purchaseRoutes)


app.use(errorHandler.notFoundError)
app.use(errorHandler.showError)

module.exports = app