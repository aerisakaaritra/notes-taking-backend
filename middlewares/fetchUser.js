const jwt = require('jsonwebtoken')
const JWT_key = 'astakfirullah'

const fetchUser = (req, res, next) =>{
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({ error: 'please authenticate with a valid token' })
    }
    try {
        const TokenString = jwt.verify(token, JWT_key)
        req.user = TokenString.user
        next()
    } catch (error) {
        res.status(401).send({ error: 'please authenticate with a valid token' })
    }
}

module.exports = fetchUser