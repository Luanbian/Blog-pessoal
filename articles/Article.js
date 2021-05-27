const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/Category");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

/* Relação entre tabelas:
 hasMany = relacionamento de 1 para muitos 
 belongsTo = relacionamento de 1 para 1
*/
//Relação entre as tabelas
Category.hasMany(Article); // hasMany() = "tem muitos"
Article.belongsTo(Category); //belongsTo() = "pertece a"

module.exports = Article;