// Impostando as bibliotecas instaladas
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//importando o banco de dados
const connection = require('./database/database');

//importando as rotas 
const categoriesController = require("./categories/categoriesController");
const articlesController = require('./articles/articlesController');

//importando as tabelas
const Article = require('./articles/Article');
const Category = require('./categories/Category');

//configurando a view engine
app.set("view engine", 'ejs');

//arquivos estaticos
app.use(express.static("public"));

//Body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Conectando com o banco de dados
connection.authenticate().then(() => {
    console.log("conexão com o banco de dados feita com sucesso");
}).catch((error) => {
    console.log(error);
})

//rotas
app.use("/", categoriesController);
app.use("/", articlesController);


app.get("/", (req, res) => {
    Article.findAll({
        order:[['id', 'DESC']]
    }).then(articles => {
        res.render("index", {articles: articles})
    });
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug,
        }
    }).then(article => {
        if(article != undefined){
            res.render("article", {article: article});
        } else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

//servidor
app.listen(5500, () => {
    console.log("O servidor está rodando");
})