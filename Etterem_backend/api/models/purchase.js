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
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        totalPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        message: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      }
    )
  
    return Purchase
}
  