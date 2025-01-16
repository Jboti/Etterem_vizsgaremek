const db = require('../db/dbContext')
const { Op } = require('sequelize')
class userRepository
{
    constructor(db)
    {
        this.User = db.user
    }


    async getUser(id)
    {
        return await this.User.findOne(
            {
                where:
                {
                    id: id,
                }
            })
    }

    async getAllUser()
    {
        return await this.User.findAll({})
    }

    async updateUserName(user)
    {
        await this.User.update(
            {
                userName: user.userName,
            },
            {
                where:
                {
                    id : user.id
                }
            })
    }

    async createUser(user)
    {
        const newUser = await this.User.create(user)
        await newUser.save()
        return newUser
    }

    async deleteUser(id)
    {
        return await this.User.destroy(
            {
                where:
                {
                    id: id
                }
            })
    }

    async vertifyEmail(id)
    {
        return await this.User.update(
            {
                isActive: true,
            },
            {
                where:{
                    id:id
                }
            }
        )
    }
    
    async checkForExistingUser(userName,email)
    {
        return await User.findOne({
            [Op.or]: [{ userName: userName }, { email: email }]
        })
    }

}

module.exports = new userRepository(db)