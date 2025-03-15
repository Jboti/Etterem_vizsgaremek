module.exports = (sequelize, DataTypes) => {
    const OrderConnection = sequelize.define(
      "orderConnection",
      {
        id: 
        {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: 
        {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate:{
            isInt:true
          }
            
        },
        order_id: 
        {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate:{
            isInt:true
          }
        },
      },
      {
        timestamps: false,
      }
    )
  
    return OrderConnection
}