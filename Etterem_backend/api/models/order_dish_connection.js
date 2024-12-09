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
    );
  
    OrderDishConnection.associate = (models) => {
      OrderDishConnection.belongsTo(models.Purchase, {
        foreignKey: 'orderId',
        onDelete: 'CASCADE',
      });
      OrderDishConnection.belongsTo(models.Dish, {
        foreignKey: 'dishId',
        onDelete: 'CASCADE',
      });
    };
  
    return OrderDishConnection;
};
  