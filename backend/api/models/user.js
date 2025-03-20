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
            isAlphanumeric:true
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
          /*validate:{
            is: /^(?=.*[a-záéöőóüűú])(?=.*[A-ZÁÉÖŐÓÜŰÚ])(?=.*\d)[a-zA-ZáÁéÉöÖőŐóÓüÜűŰúÚ\d]{8,}$/  //a jelszó heshelve van így a a megfelelő formátumot a frontenden,- regisztrációkor nézzük
          }*/
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
  