const {Router} = require('express')
const jwt = require('jsonwebtoken')
const {secret} = require("../config.json")
const router = Router()

// Авторизация
router.get('/', async (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader.replace('Bearer ', '')
    const payload = jwt.verify(token, secret)
    res.status(200).json({
        message: `User id: ${payload.userId}`
    })
})

module.exports = router