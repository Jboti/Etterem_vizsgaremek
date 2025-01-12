module.exports = (sequelize, DataTypes) => {
    const OrderDishConnection = sequelize.define(
      "orderDishConnection",
      {
        id: 
        {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        order_id: 
        {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        dish_id: 
        {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        customizations: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        timestamps: false,
      }
    )
  
    return OrderDishConnection
}
  