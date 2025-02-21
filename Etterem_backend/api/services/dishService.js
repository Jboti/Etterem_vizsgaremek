const dishRepository = require('../repositories/dishRepository')

class DishService
{
    async createDish(dish)
    {
        return await dishRepository.createDish(dish)
    }

    async getAllDishes()
    {
        return await dishRepository.getAllDishes()
    }

    async modifyDish(dish)
    {
        return await dishRepository.modifyDish()
    }
}

module.exports = new DishService()