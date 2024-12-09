module.exports = (sequelize, DataTypes) => {
    const OrderConnection = sequelize.define(
      "orderConnection",
      {
        user_id: 
        {
          type: DataTypes.INTEGER,
          allowNull: false,
            
        },
        order_id: 
        {
          type: DataTypes.INTEGER,
          allowNull: false,
         
        },
        
      },
      {
        timestamps: false,
      }
    );
  
    return OrderConnection;
};
  