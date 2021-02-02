
const jwt = require('jsonwebtoken')
const {secret} = require("../config.json")

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization']

    if(!authHeader) {
        res.sendStatus(401).json({
            message: 'Token not provided!'
        })
        return
    }
    
    const token = authHeader.replace('Bearer ', '')
    try {
        const payload = jwt.verify(token, secret)
        if(payload.type !== 'access') {
            res.sendStatus(401).json({
                message: 'Invalid token!'
            })
            return
        }
    } catch(e) {
        if(e instanceof jwt.TokenExpiredError) {
            res.status(400).json({
                message: 'Token expired!'
            })
            return
        }
        if(e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({
                message: 'Invalid token!'
            })
            return
        }
    }
    next()
}