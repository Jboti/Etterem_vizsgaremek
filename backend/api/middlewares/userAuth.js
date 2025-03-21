const jwt = require('jsonwebtoken')

exports.authenticateToken = (req, res, next) =>
{
    if (!req.headers.authorization) {
        return res.status(400).json({ errmessage: 'Authorization header is missing!' })
    }

    if (!req.headers.authorization.startsWith('Bearer ')) {
        return res.status(400).json({ errmessage: 'Invalid Authorization header format!' })
    }

    const token = req.headers.authorization.split(' ')[1];

    
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ errmessage: 'Invalid token!'})
        }
        if(!decoded.validLogin){
            return res.status(403).json({ errmessage: 'Invalid token use.'})
        }
        
        req.uid = decoded.id
        next()
    })
}

exports.authenticateTokenforEmail = (req, res, next) =>
{
    if (!req.headers.authorization) {
        return res.status(400).json({ errmessage: 'Authorization header is missing!' })
    }

    if (!req.headers.authorization.startsWith('Bearer ')) {
        return res.status(400).json({ errmessage: 'Invalid Authorization header format!' })
    }

    const token = req.headers.authorization.split(' ')[1];

    
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ errmessage: 'Invalid token!'})
        }
        if(decoded.validLogin){
            return res.status(403).json({ errmessage: 'Invalid token use.'})
        }
        req.uid = decoded.id
        next()
    })
}


