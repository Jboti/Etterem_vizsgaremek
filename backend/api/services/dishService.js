const dishRepository = require('../repositories/dishRepository')

class DishService
{
    async createDish(dish,allergies)
    {
        return await dishRepository.createDish(dish,allergies)
    }

    async getAllDishes()
    {
        return await dishRepository.getAllDishes()
    }

    async modifyDish(dish, allergies)
    {
        return await dishRepository.modifyDish(dish, allergies)
    }
}

module.exports = new DishService()