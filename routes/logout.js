const {Router} = require('express')
const Token = require('../models/token')
const jwt = require('jsonwebtoken')
const {secret} = require("../config.json")
const router = Router()

// Выход
router.get('/', async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.replace('Bearer ', '')
    const payload = jwt.verify(token, secret)
    
    const oldToken = await Token.findAll({
        where: {
            user_id: payload.userId
        }
    })
    if (oldToken[0]) {
        await oldToken[0].destroy()
    }

    res.status(200).json({
        message: `Logout`
    })
})

module.exports = router