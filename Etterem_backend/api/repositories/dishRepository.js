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

    async modifyDish(dish)
    {
        return await this.Dish.update(
            {
                name: dish.name,
                price: dish.price,
                available: dish.available,
                sauceOptions: dish.sauceOptions,
                customizationOptions: dish.customizationOptions,
                description: dish.description,
                type: dish.type,
                img: dish.img
            },
            {where:{id:dish.id}}
        )
    }
}

module.exports = new dishRepository(db)