const purchaseRepository = require('../repositories/purchaseRepository')
const order_connectionRepository = require('../repositories/order_connectionRepository')

exports.getAllPurchase = async (req,res,next) =>
{
    try
    {
        const purchases = await purchaseRepository.getAllPurchase()
        res.status(200).json(purchases)
    }catch(error)
    {
        next(error)
    }
}

exports.deActivatePurchase = async (req,res,next) =>
{
    try
    {
        const {id} = req.params
        id = Number(id)
        if(!id || isNaN(id)){
            const error = new Error("Id is not found or id is not a number!")
            error.status = 404
            throw error
        }
        await purchaseRepository.deActivatePurchase(id)
        console.log("Purchase deactivated!")
        res.status(200).send("Purchase deactivated!")
    }catch(error)
    {
        next(error)
    }
}

exports.createPurchase = async (req,res,next) =>
{
    try
    {
        const currentDate = new Date()
        // const {totalPrice, message} = req.body
        // const {uid} = req.params
        // uid = Number(uid)
        // totalPrice = Number(totalPrice)
        // if(!totalPrice || isNaN(totalPrice)){
        //     const error = new Error("TotalPrice is not found or totalPrice is not a number!")
        //     error.status = 404
        //     throw error
        // }
        // if(!message){
        //     const error = new Error("Message is not found!")
        //     error.status = 404
        //     throw error
        // }
        // if(!uid || isNaN(uid)){
        //     const error = new Error("UserId is not found or userId is not a number!")
        //     error.status = 404
        //     throw error
        // }
        // const purchase = {
        //     id: null,
        //     date: currentDate.toISOString(),
        //     totalPrice: totalPrice,
        //     message: message,
        // }
        const uids = [1,2]
        const purchases = [{
            id: null,
            date: currentDate.toISOString(),
            totalPrice: 10000,
            message: "",
        },
        {
            id: null,
            date: currentDate.toISOString(),
            totalPrice: 8700,
            message: "Kutya ugat",
        },
        {
            id: null,
            date: currentDate.toISOString(),
            totalPrice: 2700,
            message: "Nagyon szeretem!",
        }]
        await order_connectionRepository.createPurchaseConnection(uids[0],purchases[0])
        console.log("Purchase created successfully!")
        res.status(201).send("Purchase created successfully!")
    }catch(error)
    {
        next(error)
    }
}