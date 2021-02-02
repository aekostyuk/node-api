const Sequelize = require('sequelize')
const sequelize = new Sequelize('node_api', 'root', 'secret', {
    host: 'localhost',
    port: "4308",
    dialect: 'mysql'
})

module.exports = sequelize