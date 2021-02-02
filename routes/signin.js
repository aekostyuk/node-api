const {Router} = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const {updateTokens, refreshTokens} = require('../utils/auth')
const router = Router()

// Авторизация
router.post('/', async (req, res) => {
    try {
        const loginData = JSON.parse(JSON.stringify(req.body))
        const user = await User.findAll({
            where: {
                id: loginData.id
            }
        })
        if(!user[0]) {
            res.status(401).json({
                message: 'User not found'
            })
        } else {
            const userData = JSON.parse(JSON.stringify(user[0]))
            const passwordCompare = bcrypt.compareSync(loginData.password, userData.password)
            if(!passwordCompare) {
                res.status(401).json({
                    message: 'Password error'
                })
            } else {
                const token = updateTokens(userData.user_id)
                res.json({
                    token: `Bearer ${token.accessToken}`,
                    refreshToken: `Refresh ${token.refrechToken}`
                })
            }
        }
    } catch(e) {
        console.error(e)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

router.post('/new_token', refreshTokens)

module.exports = router