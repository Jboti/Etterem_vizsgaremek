const jwt = require('jsonwebtoken')

exports.authenticateToken = (req, res, next) =>
{
    let token = null
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1]
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

