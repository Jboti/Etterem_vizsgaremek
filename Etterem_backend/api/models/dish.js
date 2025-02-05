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
        sauceOptions: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        customizationOptions: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        img: {
          type: DataTypes.BLOB("long"), 
          allowNull: true,
        }
      },
      {
        timestamps: false,
      }
    )
  
    return Dish
}
  