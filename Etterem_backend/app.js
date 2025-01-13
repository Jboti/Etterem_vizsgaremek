const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const cors = require('cors')
app.use(cors());

app.use(
    cors({
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
        allowedHeaders: ['Content-Type', 'Authorization'], 
    })
)


const errorHandler = require('./api/middlewares/errorHandler')
const userRoutes = require('./api/routes/userRoutes')
const purchaseRoutes = require('./api/routes/purchaseRoutes')
const dishRoutes = require('./api/routes/dishRoutes')
const testRouter = require('./api/routes/testRouter')


//ROUTES

app.use("/user", userRoutes)
app.use("/purchase", purchaseRoutes)
app.use("/dish",dishRoutes)

//táblákat feltölti pár alap adattal teszthez
app.use("/testDataCreate",testRouter)

app.use(errorHandler.notFoundError)
app.use(errorHandler.showError)

module.exports = app