const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const token = sequelize.define('Token', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    token_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = token