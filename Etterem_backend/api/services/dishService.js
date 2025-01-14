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
}

module.exports = new DishService()