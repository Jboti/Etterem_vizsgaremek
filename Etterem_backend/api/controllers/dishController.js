const dishService = require('../services/dishService')

exports.createDish = async (req,res,next) =>
{
    try
    {
        const currentDate = new Date()
        let {name, price, sauceOptions ,customizationOptions, description, type, image} = req.body
        price = Number(price)
        if(!name || !price ||isNaN(price) || !sauceOptions || !customizationOptions || !description || !type || !image)
        {
            const error = new Error("Missing or wrong tpye of data!")
            error.status = 404
            throw error
        }
        const dish = {
            id: null,
            name: name,
            created: currentDate.toISOString(),
            price: price,
            available: true,
            sauceOptions: sauceOptions,
            customizationOptions: customizationOptions,
            description: description,
            type: type,
            img: image,
        }

        const result = await dishService.createDish(dish)
        if(!result)
        {
            const error = new Error("Failed creating new dish!")
            error.status = 500
            throw error
        }
        res.status(201).send("Successfully created new dish!")
        
    }catch(error){
        next(error)
    }
}

exports.getAllDishes = async (req,res,next) =>
{
    try
    {
        const dishes = await dishService.getAllDishes()
        res.status(200).json(dishes)
    } catch (error) {
        next(error)
    }
        
}

exports.modifyDish = async (req,res,next) =>
{
    try
    {
        let {id, name, price, available, sauceOptions, customizationOptions, description, type, image} = req.body
        id = Number(id)
        price = Number(price)
        if(!id || isNaN(id) || !name || !price || isNaN(price) || !String(available) || !sauceOptions || !customizationOptions || !description || !type || !image)
        {
            const error = new Error("Missing or wrong type of data!")
            error.status = 404
            throw error
        }
        const modifiedDish = {
            id: id,
            name: name,
            price: price,
            available: available,
            sauceOptions: sauceOptions,
            customizationOptions:customizationOptions,
            description: description,
            type: type,
            img: image,
        }
        const result = await dishService.modifyDish(modifiedDish)
        if(!result)
        {
            const error = new Error("Failed modifying dish!")
            error.status = 500
            throw error
        }
        res.status(200).send("Successfully modified!")
    }catch(err){
        next(err)
    }
}