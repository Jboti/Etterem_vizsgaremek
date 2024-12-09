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
        },
      },
      {
        timestamps: false,
      }
    );
  
    Allergy.associate = (models) => {
      Allergy.hasMany(models.Allergenable, {
        foreignKey: 'allergenId',
      });
    };
  
    return Allergy;
};
  