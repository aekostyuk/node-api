const express = require('express')
const bodyParser = require('body-parser')
const sequelize = require('./utils/database')
const verify = require('./middleware/verify')
const upload = require('./middleware/upload')
const {port} = require("./config.json")
const cors = require('cors')

const filesRoutes = require('./routes/files')
const signinRoutes = require('./routes/signin')
const signupRoutes = require('./routes/signup')
const infoRoutes = require('./routes/info')
const logoutRoutes = require('./routes/logout')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cors())
app.use(express.static(__dirname))

app.use('/signup', signupRoutes)
app.use('/signin', signinRoutes)
app.use('/file', verify, upload, filesRoutes)
app.use('/info', verify, infoRoutes)
app.use('/logout', verify, logoutRoutes)

async function start() {
    try {
        await sequelize.sync()
        app.listen(port || 3000, () => console.log(`Server started on port ${port || 3000}`))
    } catch(e) {
        console.error(e)
    }
}

start()