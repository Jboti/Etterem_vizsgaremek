const jwt = require('jsonwebtoken')

exports.authenticateToken = (req, res, next) =>
{
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        res.status(404).send("No token provided.")
    }
    
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ errmessage: 'Invalid or expired token.'})
        }
        if(!decoded.validLogin){
            return res.status(403).json({ errmessage: 'Invalid token.'})
        }
        
        req.uid = decoded.id
        next()
    })
}


