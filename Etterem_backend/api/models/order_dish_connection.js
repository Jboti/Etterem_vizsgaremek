module.exports = (sequelize, DataTypes) => {
    const OrderDishConnection = sequelize.define(
      "orderDishConnection",
      {
        amount: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        customizations: {
          type: DataTypes.JSON,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      }
    )
  
    return OrderDishConnection
}
  