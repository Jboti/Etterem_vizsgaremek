const userRepository  = require("../repositories/userRepository")

class UserService
{
    async createUser(user)
    {
        return await userRepository.createUser(user)
    }

    async getAllUser()
    {
        return await userRepository.getAllUser()
    }

    async getUser(id)
    {
        return await userRepository.getUser(id)
    }

    async deleteUser(id)
    {
        await userRepository.deleteUser(id)
    }
}

module.exports = new UserService()