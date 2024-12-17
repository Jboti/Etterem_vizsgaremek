require('dotenv').config()
const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize
(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }

)

try
{
    sequelize.authenticate()
    console.log("Database Connected")
}
catch(err)
{
    console.error("Error connecting to the database")
}

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

const { User, Allergenable, Allergy, Dish, OrderConnection, OrderDishConnection, Purchase} = require("../models")(db.sequelize, DataTypes)
db.user = User;
db.order_connection = OrderConnection
db.purchase = Purchase
db.order_dish_connection = OrderDishConnection
db.dish = Dish
db.allergenables = Allergenable
db.allergy = Allergy


db.sequelize.sync({alter: true})

module.exports = db