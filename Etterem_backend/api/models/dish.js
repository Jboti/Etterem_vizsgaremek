const { type } = require("os")

module.exports = (sequelize, DataTypes) => {
    const Dish = sequelize.define(
      "dish",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        created: {
          type: DataTypes.DATEONLY,
          defaultValue: DataTypes.NOW,
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        available: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        customizationOptions: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING(255),
          allowNull: false,
        }
      },
      {
        timestamps: false,
      }
    )
  
    return Dish
}
  