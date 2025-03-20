const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '1000mb'}))
app.use(bodyParser.urlencoded({limit: '1000mb', extended: true}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const cors = require('cors')
app.use(cors())

app.use(
    cors({
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], 
        allowedHeaders: ['Content-Type', 'Authorization','Cookie'], 
        credentials: true,
    })
)

const errorHandler = require('./api/middlewares/errorHandler')

const userRoutes = require('./api/routes/userRoutes')
const purchaseRoutes = require('./api/routes/purchaseRoutes')
const dishRoutes = require('./api/routes/dishRoutes')

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//ROUTES

app.use("/api/v1", userRoutes)
app.use("/api/v1", purchaseRoutes)
app.use("/api/v1",dishRoutes)


//errorHandlerek
app.use(errorHandler.notFoundError)
app.use(errorHandler.showError)

module.exports = app