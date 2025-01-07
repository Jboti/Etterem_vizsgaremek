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

    async getUsers()
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

    async deleteUser(user)
    {
        await this.User.destroy(
            {
                where:
                {
                    id: user.id
                }
            })
    }
}

module.exports = new userRepository(db)