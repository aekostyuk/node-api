const Token = require('../models/token')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const {secret, refreshSecret, tokenLife, refreshTokenLife} = require("../config.json")

const generateAccessToken = (userId) => {
    const payload = {
        userId,
        type: 'access'
    }
    const options = {expiresIn: tokenLife}
    return jwt.sign(payload, secret, options)
}

const generateRefreshToken = () => {
    const payload = {
        id: uuidv4(),
        type: 'refresh'
    }
    const options = {expiresIn: refreshTokenLife}
    return {
        id: payload.id,
        token: jwt.sign(payload, refreshSecret, options)
    }
}

const replaceDbRefreshToken = async (tokenId, userId) => {
    const oldToken = await Token.findAll({
        where: {
            user_id: userId
        }
    })
    if (oldToken[0]) {
        await oldToken[0].destroy()
    }
    await Token.create({
        token_id: tokenId,
        user_id: userId
    })
}

// Генерация пары ключей при авторизации или регистрации
const updateTokens = (userId) => {
    const accessToken = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)

    replaceDbRefreshToken(refreshToken.id, userId)

    return {
        accessToken,
        refrechToken: refreshToken.token
    }
}

// Обновление ключей по рефреш токену
const refreshTokens = async (req, res) => {
    const refreshToken = req.headers['refreshtoken'].replace('Refresh ', '')
    
    let payload
    try {
        payload = jwt.verify(refreshToken, refreshSecret)
        console.log(payload)
        if(payload.type !== 'refresh') {
            res.status(400).json({
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
        } else if(e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({
                message: 'Invalid token!'
            })
            return
        }
    }
    const oldToken = await Token.findAll({
        where: {
            token_id: payload.id
        }
    })
    if(!oldToken[0]) {
        res.status(400).json({
            message: 'Invalid token!'
        })
        return
    }
    console.log(oldToken)
    const token = updateTokens(oldToken[0].user_id)
    res.json({
        token: `Bearer ${token.accessToken}`,
        refreshToken: `Refresh ${token.refrechToken}`
    })
}

module.exports = {
    updateTokens,
    refreshTokens
}