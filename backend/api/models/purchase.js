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
        city: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        street: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        houseNumber: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        panel: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        floor: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        door: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        doorBell: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        timestamps: false,
      }
    )
  
    return Purchase
}
  