const Sequelize = require("sequelize");

const connection = new Sequelize("heroku_30f61c64c6d0ff9", "b673b73d725bdb", "2f73623d", {
    host: 'us-cdbr-east-04.cleardb.com',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;