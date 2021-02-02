const {Router} = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const {updateTokens} = require('../utils/auth')
const router = Router()

// Регистрация нового пользователя
router.post('/', async (req, res) => {
    try {
        const loginData = JSON.parse(JSON.stringify(req.body))
        const oldUser = await User.findAll({
            where: {
                id: loginData.id
            }
        })
        if (oldUser[0]) {
            res.status(500).json({
                message: 'Login is already in use'
            })
        } else {
            const user = await User.create({
                id: loginData.id,
                password: bcrypt.hashSync(loginData.password, bcrypt.genSaltSync(8), null)
            })
            const token = updateTokens(user.user_id)
            res.json({
                token: `Bearer ${token.accessToken}`,
                refreshToken: `Refresh ${token.refrechToken}`
            })
        }
    } catch(e) {
        console.error(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

module.exports = router