const allergyService = require('../services/allergyService')

exports.createAllergy = async (req,res,next) =>
{
    try
    {
        let {name} = req.body
        if(!name)
        {
            const error = new Error("Missing or wrong tpye of data!")
            error.status = 404
            throw error
        }
        const allergy = {
            id: null,
            name: name,
        }

        const result = await allergyService.createAllergy(allergy);
        if(!result)
        {
            const error = new Error("Failed creating new allergy!")
            error.status = 500
            throw error
        }
        res.status(201).send("Successfully created new allergy!")
        
    }catch(error){
        next(error)
    }
}