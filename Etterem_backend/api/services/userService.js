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

    async checkForExistinguserName(userName)
    {
        return await userRepository.checkForExistinguserName(userName)
    }

    async checkForExistingEmail(email)
    {
        return await userRepository.getUserByEmail(email)
    }

    async getUserByEmail(email)
    {
        return await userRepository.getUserByEmail(email)
    }

    async changePassword(password,id)
    {
        return await userRepository.changePassword(password,id)
    }

    async changeUserName(userName,id)
    {
        return await userRepository.changeUserName(userName,id)
    }
    async getUserPwById(id)
    {
        return await userRepository.getUserPwById(id)
    }

    async updateAllregies(id,allergies)
    {
        await userRepository.updateAllregies(id,allergies)
    }
}

module.exports = new UserService()