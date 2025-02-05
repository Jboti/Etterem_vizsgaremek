const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:", { logging: false });

try
{
    sequelize.authenticate();

    console.log("Mocked Database Connected Successfully!");
}
catch(err)
{
    console.error("Mocked Database connection failed!");
}

const db = {};

db.Sequelize = Sequelize;

db.sequelize = sequelize;

const { Allergenable, Allergy,Dish, OrderDishConnection, OrderConnection, Purchase, User } = require("../api/models")(db.sequelize, DataTypes);

db.allergenables = Allergenable;
db.allergy = Allergy;
db.dish = Dish;
db.orderDishConnection = OrderDishConnection;
db.orderConnection = OrderConnection;
db.purchase = Purchase;

module.exports = db;