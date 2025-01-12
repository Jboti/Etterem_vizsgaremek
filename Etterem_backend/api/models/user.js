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
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        points: {
          type: DataTypes.INTEGER,
          allowNull: false,
          default: 0
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          default: false
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          default:true
        },
      },
      {
        timestamps: false,
      }
    )
  
    return User
}
  