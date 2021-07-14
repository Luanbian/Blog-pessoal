// Impostando as bibliotecas instaladas
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

//importando o banco de dados
const connection = require('./database/database');

//importando as rotas 
const categoriesController = require("./categories/categoriesController");
const articlesController = require('./articles/articlesController');
const usersController = require('./user/usersController');

//importando as tabelas
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const USer = require('./user/User');

//configurando a view engine
app.set("view engine", 'ejs');

// configurando as sessões
app.use(session({
    secret: "kbinfirg7654aviaobvaei4567h", 
    cookie: {maxAge: 360000000}
}))

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
app.use("/", usersController);

//exemplo de session, ela pode ser excluida, mas vou deixar como exemplo
//qualquer informação é guardada globalmente
app.get("/session", (req,res) => {
    req.session.treinamento = "formação node.js"
    res.send("sessão gerada!");
});
//aqui eu acesso uma dessas informações
app.get("/leitura", (req,res) => {
    res.json({
        treinamento: req.session.treinamento
    })
});

app.get("/", (req, res) => { //paginação
    Article.findAll({
        order:[['id', 'DESC']],
        limit: 10 //numero de artigos por página
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories})
        });
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
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories})
            });
        } else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.get("/category/:slug", (req,res) => {
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(Category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{articles: category.articles, categories: categories});
            })
        }else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

//servidor
app.listen(5500, () => {
    console.log("O servidor está rodando");
})