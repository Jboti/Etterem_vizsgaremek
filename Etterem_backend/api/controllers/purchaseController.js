const purchaseService = require('../services/purchaseService')
const orderConnectionService = require('../services/orderConnectionService')

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

exports.PlaceOrder = async (req,res,next) =>
{
    try
    {
        const currentDate = new Date()
        let {uid} = req.params
        let {totalPrice, message, dishInfo} = req.body
        uid = Number(uid)
        totalPrice = Number(totalPrice)
        dishInfo.dishIds = dishInfo.dishIds.map(id => Number(id))
        dishInfo.dishAmounts = dishInfo.dishAmounts.map(amount => Number(amount))
        if(!totalPrice || isNaN(totalPrice)){
            const error = new Error("Purchase totalPrice is not found or totalPrice is not a number!")
            error.status = 404
            throw error
        }
        if(!message){
            const error = new Error("Purchase message is not found!")
            error.status = 404
            throw error
        }
        if(!uid || isNaN(uid)){
            const error = new Error("Purchase userId is not found or userId is not a number!")
            error.status = 404
            throw error
        }
        const purchase = {
            id: null,
            date: currentDate.toISOString(),
            totalPrice: totalPrice,
            message: message,
            isActive: true
        }
        if(!dishInfo.dishIds || !dishInfo.dishAmounts || !dishInfo.dishCustomizations)
        {
            const error = new Error("Purchase missing input in dishInfo!")
            error.status = 404
            throw error
        }
        if(dishInfo.dishIds.some(id => isNaN(id))) {
            const error = new Error("Purchase dishId is not a number!")
            error.status = 404
            throw error
        }
        if(dishInfo.dishAmounts.some(amount => isNaN(amount))){
            const error = new Error("Purchase dishAmount is not a number!")
            error.status = 404
            throw error
        }

        const result = await orderConnectionService.createPurchaseConnection(uid,purchase,dishInfo)
        if(result)
        {
            res.status(201).json(result)
            console.log("Purchase created successfully!")
        }
        else
            res.status(400).send("Failed creating order.")
    }catch(error){
        next(error)
    }
}