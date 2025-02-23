const allergyRepository = require('../repositories/allergyRepository')

class AlleryService
{
    async createAllergy(allergy)
    {
        return await allergyRepository.createAllergy(allergy)
    }
}

module.exports = new AlleryService()