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
        },
        allergenable_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        allergen_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      }
    )
  
    return Allergenable
}
  