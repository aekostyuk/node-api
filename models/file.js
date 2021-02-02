const Sequelize = require('sequelize')
const sequelize = require('../utils/database')

const file = sequelize.define('File', {
    file_id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    extension: {
        type: Sequelize.STRING
    },
    mime_type: {
        type: Sequelize.STRING
    },
    size: {
        type: Sequelize.STRING
    },
    path: {
        type: Sequelize.STRING
    }
})

module.exports = file