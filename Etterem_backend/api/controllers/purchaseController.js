const purchaseService = require('../services/purchaseService')
const orderConnectionService = require('../services/orderConnectionService')
const userService = require('../services/userService')

exports.getAllPurchaseUserInfo = async (req,res,next) =>
{
    try
    {
        const id = Number(req.uid)
        const purchases = await purchaseService.getAllPurchaseUserInfo(id)

        res.status(200).json(purchases)
    }catch(error){
        next(error)
    }
}

exports.getAllActivePurchase = async (req,res,next) =>
{
    try
    {
        const purchases = await purchaseService.getAllActivePurchase()

        res.status(200).json(purchases)
    }catch(error){
        next(error)
    }
}

exports.deActivatePurchase = async (req,res,next) =>
{
    try
    {
        let {id} = req.params
        id = Number(id)
        if(!id || isNaN(id)){
            const error = new Error("Purchase id is not found or id is not a number!")
            error.status = 404
            throw error
        }
        console.log(id);
        const result = await purchaseService.deActivatePurchase(id)
        res.status(200).json(result)
        console.log("Purchase deactivated!")
    }catch(error){
        next(error)
    }
}

exports.placeOrder = async (req,res,next) =>
{
    try
    {
        const currentDate = new Date()

        const id = Number(req.uid)
        let {totalPrice, message, takeAway, dishIds, dishAmounts, dishCustomizations, pointsUsed} = req.body
        
        totalPrice = Number(totalPrice)
        dishIds = dishIds.map(id => Number(id))
        dishAmounts = dishAmounts.map(amount => Number(amount))
        pointsUsed = Number(pointsUsed)

        if(!id || !totalPrice || !message || !String(takeAway) || !dishIds || !dishAmounts || !dishCustomizations || !pointsUsed){
            const error = new Error("Missing data in placeOrder")
            error.status = 404
            throw error
        }
        if(isNaN(id) || isNaN(totalPrice) || dishIds.some(id => isNaN(id)) || dishAmounts.some(amount => isNaN(amount)) || isNaN(pointsUsed))
        {
            const error = new Error("Wrong type of data in placeOrder!")
            error.status = 404
            throw error
        }

        const purchase = {
            id: null,
            date: currentDate.toISOString(),
            totalPrice: totalPrice,
            message: message,
            isActive: true,
            takeAway: takeAway
        }
        const dishInfo = {
            dishIds: dishIds,
            dishAmounts: dishAmounts,
            dishCustomizations: dishCustomizations
        }


        const result = await orderConnectionService.createPurchaseConnection(id,purchase,dishInfo,pointsUsed)
        if(result)
        {
            await userService.usePoints(id,pointsUsed)
            res.status(201).json({data:result})
            console.log("Purchase created successfully!")
        }
        else
            res.status(400).send("Failed creating order.")
    }catch(error){
        next(error)
    }
}