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
          validate:{
            isDate:true
          }
        },
        totalPrice: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate:{
            isInt:true
          }
        },
        message: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            isIn: [[true, false]]
          }
        },
        takeAway: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          validate: {
            isIn: [[true, false]]
          }
        },
      },
      {
        timestamps: false,
      }
    )
  
    return Purchase
}
  