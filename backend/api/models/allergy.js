module.exports = (sequelize, DataTypes) => {
    const Allergy = sequelize.define(
      "allergy",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate:{
            isAlphanumeric:true
          }
        },
      },
      {
        timestamps: false,
      }
    )

    return Allergy
}
  