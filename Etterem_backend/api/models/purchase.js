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
  