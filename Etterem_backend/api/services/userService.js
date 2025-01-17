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

    async vertifyEmail(id)
    {
        return await userRepository.vertifyEmail(id)
    }

    async checkForExistingUser(userName,email)
    {
        return await userRepository.checkForExistingUser(userName,email)
    }
}

module.exports = new UserService()