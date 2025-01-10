const purchaseRepository = require('../repositories/purchaseRepository')

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

exports.createPurchase = async (req,res,next) =>
{
    try
    {
        const currentDate = new Date()
        // const {totalPrice, message} = req.body
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
        // const purchase = {
        //     id: null,
        //     date: currentDate.toISOString(),
        //     totalPrice: totalPrice,
        //     message: message,
        // }
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
        }]
        await purchaseRepository.createPurchase(purchases[0])
        console.log("Purchase created successfully!")
        res.status(201).send("Purchase created successfully!")
    }catch(error)
    {
        next(error)
    }
}