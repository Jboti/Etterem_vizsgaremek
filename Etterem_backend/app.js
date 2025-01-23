const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const cors = require('cors')
app.use(cors());

app.use(
    cors({
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'], 
        allowedHeaders: ['Content-Type', 'Authorization'], 
    })
)

const errorHandler = require('./api/middlewares/errorHandler')
const userRoutes = require('./api/routes/userRoutes')
const purchaseRoutes = require('./api/routes/purchaseRoutes')
const dishRoutes = require('./api/routes/dishRoutes')
const testRouter = require('./api/routes/testRouter')


//ROUTES

app.use("/api/v1", userRoutes)
app.use("/api/v1", purchaseRoutes)
app.use("/api/v1",dishRoutes)

//táblákat feltölti pár alap adattal teszthez
app.use("/test-data-create",testRouter)

app.use(errorHandler.notFoundError)
app.use(errorHandler.showError)

module.exports = app