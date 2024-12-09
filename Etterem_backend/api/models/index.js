const Allergenable = require("../models/allergenables")(sequelize, DataTypes);
const Allergy = require("../models/allergy")(sequelize, DataTypes);
const Dish = require("../models/dish")(sequelize, DataTypes);
const OrderDishConnection = require("../models/order_dish_connection")(sequelize, DataTypes);
const OrderConnection = require("../models/order_connection")(sequelize, DataTypes);
const Purchase = require("../models/purchase")(sequelize, DataTypes);
const User = require("../models/user")(sequelize, DataTypes);

module.exports=(sequelize, DataTypes)=>{

    // User has many OrderConnections
    User.hasMany(OrderConnection, {
        foreignKey: "user_id",
        as: "orders",
    });

    // OrderConnection belongs to User
    OrderConnection.belongsTo(User, {
        foreignKey: "user_id",
        as: "user",
    });

    // OrderConnection belongs to Purchase
    OrderConnection.belongsTo(Purchase, {
        foreignKey: "order_id",
        as: "purchase",
    });

    // Purchase has many OrderConnections
    Purchase.hasMany(OrderConnection, {
        foreignKey: "order_id",
        as: "order_connections",
    });

    // Purchase has many OrderDishConnections
    Purchase.hasMany(OrderDishConnection, {
        foreignKey: "order_id",
        as: "order_dishes",
    });

    // OrderDishConnection belongs to Purchase
    OrderDishConnection.belongsTo(Purchase, {
        foreignKey: "order_id",
        as: "purchase",
    });

    // OrderDishConnection belongs to Dish
    OrderDishConnection.belongsTo(Dish, {
        foreignKey: "dish_id",
        as: "dish",
    });

    // Dish has many OrderDishConnections
    Dish.hasMany(OrderDishConnection, {
        foreignKey: "dish_id",
        as: "order_dish_connections",
    });

    // Dish has many Allergenables
    Dish.hasMany(Allergenable, {
        foreignKey: "allergenable_id",
        constraints: false,
        scope: {
            allergenable_type: "dish",
        },
        as: "allergens",
    });

    // Allergenable belongs to Allergy
    Allergenable.belongsTo(Allergy, {
        foreignKey: "allergen_id",
        as: "allergy",
    });

    // User has many Allergenables
    User.hasMany(Allergenable, {
        foreignKey: "allergenable_id",
        constraints: false,
        scope: {
            allergenable_type: "user",
        },
        as: "user_allergens",
    });

    // Allergenable belongs to Dish or User (Polymorphic Relationship)
    Allergenable.belongsTo(Dish, {
        foreignKey: "allergenable_id",
        constraints: false,
        as: "dish",
    });
    Allergenable.belongsTo(User, {
        foreignKey: "allergenable_id",
        constraints: false,
        as: "user",
    });
    return {User,Allergenable,Allergy,Dish,OrderConnection,OrderDishConnection,Purchase}
}


console.log("dfas")
