const { isAlphanumeric } = require("validator")

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
      "user",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        created: {
          type: DataTypes.DATEONLY,
          defaultValue: DataTypes.NOW,
          validate:{
            isDate:true
          }
        },
        userName: {
          type: DataTypes.STRING(225),
          allowNull: false,
          validate:{
            is:/^[A-Za-záÁéÉöÖőŐóÓüÜűŰúÚíÍ][A-Za-z0-9_áÁéÉöÖőŐóÓüÜűŰúÚíÍ\s]{5,18}$/
          }
        },
        fullName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate:{
             is: /^[\p{L}\s]+$/u
          }
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate:{
            isEmail:true
          }
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
          // validate:{
          //   is: /^[2a-b]\$10\$.{22}\$.+/
          // }
        },
        points: {
          type: DataTypes.INTEGER,
          allowNull: false,
          default: 0,
          validate:{
            isInt:true
          }
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          default: false,
          validate:{
            isIn:[[true,false]]
          }
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          default: true,
          validate:{
            isIn:[[true,false]]
          }
        },
      },
      {
        timestamps: false,
      }
    )
  
    return User
}
  