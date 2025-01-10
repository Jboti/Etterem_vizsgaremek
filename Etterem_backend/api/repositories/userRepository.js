const db = require('../db/dbContext')

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
        await this.User.create(user)
    }

    async deleteUser(id)
    {
        await this.User.destroy(
            {
                where:
                {
                    id: id
                }
            })
    }
}

module.exports = new userRepository(db)