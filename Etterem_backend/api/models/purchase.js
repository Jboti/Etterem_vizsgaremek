module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define(
      "purchase",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        date: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        totalPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        message: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        timestamps: false,
      }
    );
  
    Purchase.associate = (models) => {
      Purchase.hasMany(models.OrderConnection, {
        foreignKey: 'orderId',
      });
      Purchase.hasMany(models.OrderDishConnection, {
        foreignKey: 'orderId',
      });
    };
  
    return Purchase;
};
  