const db = require('../db/dbContext')

class dishRepository
{
    constructor(db)
    {
        this.Dish = db.dish
    }


    async getDish(id)
    {
        return await this.Dish.findOne(
            {
                where:
                {
                    id: id,
                }
            })
    }

    async getAllDishes()
    {
        return await this.Dish.findAll({})
    }

    

    async createDish(dish)
    {
        return await this.Dish.create(dish)
    }

    async deleteDish(dish)
    {
        await this.Dish.destroy(
            {
                where:
                {
                    id: dish.id
                }
            })
    }
}

module.exports = new dishRepository(db)