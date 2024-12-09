const users = [
    {
        id:1,
        name:"sanyi"
    }
]

const userRepository = require('../repositories/userRepository')

exports.getUser = (req,res,next) =>
{
    res.status(200).json(users)
}