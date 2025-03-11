module.exports = (sequelize, DataTypes) => {
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
        onDelete: 'CASCADE',  // Ha törlöm a felhasználót, törlődjenek az ő rendelései is
    })

    OrderConnection.belongsTo(User, {
        foreignKey: "user_id",
        as: "user",
    })

    OrderConnection.belongsTo(Purchase, {
        foreignKey: "order_id",
        as: "purchase",
        onDelete: 'CASCADE',  // Ha törlöm a rendelést, törlődjenek a kapcsolódó order connections is
    })

    Purchase.hasMany(OrderConnection, {
        foreignKey: "order_id",
        as: "order_connections",
    })

    Purchase.hasMany(OrderDishConnection, {
        foreignKey: "order_id",
        as: "order_dishes",
        onDelete: 'CASCADE',  // Ha törlöm a rendelést, törlődjenek az order dish kapcsolatok is
    })

    OrderDishConnection.belongsTo(Purchase, {
        foreignKey: "order_id",
        as: "purchase",
    })

    OrderDishConnection.belongsTo(Dish, {
        foreignKey: "dish_id",
        as: "dish",
        onDelete: 'CASCADE',  // Ha törlöm a dish-t, törlődjenek a kapcsolódó order dish connection rekordok
    })

    Dish.hasMany(OrderDishConnection, {
        foreignKey: "dish_id",
        as: "order_dish_connections",
        onDelete: 'CASCADE',  // Ha törlöm a dish-t, törlődjenek az order dish connection rekordok
    })

    Allergenable.belongsTo(Allergy, {
        foreignKey: "allergen_id",
        as: "allergy",
    })

    //a polimorf tábla (allergenables)

    Dish.hasMany(Allergenable, {
        foreignKey: 'allergenable_id',
        constraints: false,
        as: 'allergenables',
        onDelete: 'CASCADE',
        scope: {
          allergenable_type: 'dish'
        }
      })
      
      User.hasMany(Allergenable, {
        foreignKey: 'allergenable_id',
        constraints: false,
        as: 'allergenables',
        onDelete: 'CASCADE',
        scope: {
          allergenable_type: 'user'
        }
      })
      

    Allergenable.belongsTo(Dish, {
        foreignKey: 'allergenable_id',
        constraints: false,
        as: 'dish',
        scope: {
          allergenable_type: 'dish'
        }
      })
      
      Allergenable.belongsTo(User, {
        foreignKey: 'allergenable_id',
        constraints: false,
        as: 'user',
        scope: {
          allergenable_type: 'user'
        }
      })
      

    return { User, Allergenable, Allergy, Dish, OrderConnection, OrderDishConnection, Purchase }
}
