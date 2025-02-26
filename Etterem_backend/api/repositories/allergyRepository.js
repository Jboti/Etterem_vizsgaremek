const db = require('../db/dbContext')

class allergyRepository
{
    constructor(db)
    {
        this.Allergy = db.allergy
    }

    async createAllergy(allergy)
    {
        return await this.Allergy.create(allergy)
    }
}

module.exports = new allergyRepository(db)