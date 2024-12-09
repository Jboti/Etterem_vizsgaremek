require('dotenv').config()
const { Sequelize, DataTypes } = require("sequelize")

console.log("asdsadasdassadasasdasdasd")

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

db.user = require("../models/user")(db.sequelize, DataTypes)
db.order_connection = require("../models/order_connection")(db.sequelize, DataTypes)
db.purchase = require("../models/purchase")(db.sequelize, DataTypes)
db.order_dish_connection = require("../models/order_dish_connection")(db.sequelize, DataTypes)
db.dish = require("../models/dish")(db.sequelize, DataTypes)
db.allergenables = require("../models/allergenables")(db.sequelize, DataTypes)
db.allergy = require("../models/allergy")(db.sequelize, DataTypes)


db.sequelize.sync({force: true})

module.exports = db