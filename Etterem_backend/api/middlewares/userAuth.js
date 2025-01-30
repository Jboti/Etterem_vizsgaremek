const jwt = require('jsonwebtoken')

exports.authenticateToken = (req, res, next) =>
{
    const token = req.cookies.token || req.body.token
    if (!token) {
        return res.status(403).json({ errmessage: 'Access denied. No token provided.'});
    }

    
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ errmessage: 'Invalid or expired token.'})
        }

        
        req.uid = decoded.id
        next()
    })
}

