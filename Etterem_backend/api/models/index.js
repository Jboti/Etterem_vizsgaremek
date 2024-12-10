module.exports=(sequelize, DataTypes)=>{
    const Allergenable = require("../models/allergenables")(sequelize, DataTypes)
    const Allergy = require("../models/allergy")(sequelize, DataTypes)
    const Dish = require("../models/dish")(sequelize, DataTypes)
    const OrderDishConnection = require("../models/order_dish_connection")(sequelize, DataTypes)
    const OrderConnection = require("../models/order_connection")(sequelize, DataTypes)
    const Purchase = require("../models/purchase")(sequelize, DataTypes)
    const User = require("../models/user")(sequelize, DataTypes)

    User.hasMany(OrderConnection, {
        foreignKey: "user_id",
        as: "orders",
    })

    OrderConnection.belongsTo(User, {
        foreignKey: "user_id",
        as: "user",
    })

    OrderConnection.belongsTo(Purchase, {
        foreignKey: "order_id",
        as: "purchase",
    })

    Purchase.hasMany(OrderConnection, {
        foreignKey: "order_id",
        as: "order_connections",
    })

    Purchase.hasMany(OrderDishConnection, {
        foreignKey: "order_id",
        as: "order_dishes",
    })

    OrderDishConnection.belongsTo(Purchase, {
        foreignKey: "order_id",
        as: "purchase",
    })

    OrderDishConnection.belongsTo(Dish, {
        foreignKey: "dish_id",
        as: "dish",
    })

    Dish.hasMany(OrderDishConnection, {
        foreignKey: "dish_id",
        as: "order_dish_connections",
    })

    Dish.hasMany(Allergenable, {
        foreignKey: "allergenable_id",
        constraints: false,
        scope: {
            allergenable_type: "dish",
        },
        as: "allergens",
    })

    Allergenable.belongsTo(Allergy, {
        foreignKey: "allergen_id",
        as: "allergy",
    })

    User.hasMany(Allergenable, {
        foreignKey: "allergenable_id",
        constraints: false,
        scope: {
            allergenable_type: "user",
        },
        as: "user_allergens",
    })

    Allergenable.belongsTo(Dish, {
        foreignKey: "allergenable_id",
        constraints: false,
        as: "dish",
    })

    Allergenable.belongsTo(User, {
        foreignKey: "allergenable_id",
        constraints: false,
        as: "user",
    })

    return {User,Allergenable,Allergy,Dish,OrderConnection,OrderDishConnection,Purchase}
}

