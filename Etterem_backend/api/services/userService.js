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

    async verifyEmail(id)
    {
        return await userRepository.verifyEmail(id)
    }

    async checkForExistingUser(userName,email)
    {
        return await userRepository.checkForExistingUser(userName,email)
    }

    async getUserByEmail(email)
    {
        return await userRepository.getUserByEmail(email)
    }
}

module.exports = new UserService()