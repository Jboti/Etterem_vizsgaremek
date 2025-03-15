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
          validate:{
            isAlphanumeric:true
          }
        },
        created: {
          type: DataTypes.DATEONLY,
          defaultValue: DataTypes.NOW,
          validate:{
            isDate:true
          }
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate:{
            isInt:true
          }
        },
        available: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate:{
            isIn: [[true, false]]
          }
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
          validate:{
            isAlphanumeric:true
          }
        },
        type: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate:{
            isAlphanumeric:true
          }
        },
        img: {
          type: DataTypes.TEXT('long'), 
          allowNull: true,
          validate:{
            isAlphanumeric:true
          }
        }
      },
      {
        timestamps: false,
      }
    )
  
    return Dish
}
  