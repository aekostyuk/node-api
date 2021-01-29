const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const {port, secret, refreshSecret, tokenLife, refreshTokenLife} = require("./config.json");

const app = express()
app.use(cors())

app.get('/', (req, res) => {
    res.json({
        message: 'Привет, это API'
    })
})

app.get('/signup', (req, res) => {
    res.json({
        message: 'Привет, это API'
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, secret, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: 'Посты',
                authData
            })
        }
    })
})

app.get('/signin', (req, res) => {
    const user = {
        id: 1,
        username: '123',
        email: 'a.e.kostyuk@gmail.com'
    }
    jwt.sign({user}, secret, {expiresIn: '30s'}, (err, token) => {
        res.json({
            token
        })
    })
    
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']

    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.sendStatus(403)
    }
}

app.listen(port || 3000, () => console.log(`Server started on port ${port || 3000}`))