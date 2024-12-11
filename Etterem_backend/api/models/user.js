module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "user",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        timestamp: {
          type: DataTypes.DATEONLY,
          defaultValue: DataTypes.NOW,
        },
        created: {
          type: DataTypes.DATEONLY,
          defaultValue: DataTypes.NOW,
        },
        userName: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        fullName: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        points: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
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
  
    return User
}
  