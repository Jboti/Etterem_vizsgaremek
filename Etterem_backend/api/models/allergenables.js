module.exports = (sequelize, DataTypes) => {
    const Allergenable = sequelize.define(
      "allergenable",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        allergenableType: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        allergenableId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        allergenId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      }
    );
  
    Allergenable.associate = (models) => {
      Allergenable.belongsTo(models.Allergy, {
        foreignKey: 'allergenId',
        onDelete: 'CASCADE',
      });
    };
  
    return Allergenable;
};
  