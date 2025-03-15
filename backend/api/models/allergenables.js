module.exports = (sequelize, DataTypes) => {
    const Allergenable = sequelize.define(
      "allergenable",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        allergenable_type: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate:{
            isAlphanumeric:true
          }
        },
        allergenable_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate:{
            isInt:true
          }
        },
        allergen_id: {
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
  
    return Allergenable
}
  