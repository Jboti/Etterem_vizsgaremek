const db = require('../db/dbContext')

class userRepository
{
    constructor(db)
    {
        this.User = db.user
    }

    async createUser(user)
    {
        await this.User.create(user)
    }
}

module.exports = new userRepository(db)