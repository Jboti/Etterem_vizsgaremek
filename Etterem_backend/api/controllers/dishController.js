const dish = require('../models/dish')
const dishRepository = require('../repositories/dishRepository')

exports.createDish = async (req,res,next) =>
{
    try
    {
        const currentDate = new Date()
        const {name, price, customizationOptions, description, type} = req.body
        price = Number(price)
        if(!name)
        {
            const error = new Error("Dish name is not found!")
            error.status = 404
            throw error
        }
        if(!price || isNaN(price))
        {
            const error = new Error("Dish price is not found or price is not a number!")
            error.status = 404
            throw error
        }
        if(!customizationOptions)
        {
            const error = new Error("Dish customizationOptions is not found!")
            error.status = 404
            throw error
        }
        if(!description)
        {
            const error = new Error("Dish description is not found!")
            error.status = 404
            throw error
        }
        if(!type)
        {
            const error = new Error("Dish type is not found!")
            error.status = 404
            throw error
        }
        const dish = {
            id: null,
            name: name,
            created: currentDate.toISOString(),
            price: price,
            available: true,
            customizationOptions: customizationOptions,
            description: description,
            type: type,
        }
        await dishRepository.createDish(dish)
        console.log("Dish created successfully!")
        res.status(201).send("Dish created successfully!")

    }catch(error)
    {
        next(error)
    }
}

exports.getAllDishes = async (req,res,next) =>
{
    try {
        const dishes = await dishRepository.getAllDishes()
        res.status(200).json(dishes)
    } catch (error) {
        next(error)
    }
        
}