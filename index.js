const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');

//configurando a view engine
app.set("view engine", 'ejs');

//arquivos estaticos
app.use(express.static("public"));

//Body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Conectando com o banco de dados
connection
    .authenticate()
    .then(() => {
        console.log("conexão com o banco de dados feita com sucesso");
    }).catch((error) => {
        console.log(error);
    })

//rotas
app.get("/", (req, res) => {
    res.render('index');
});

//servidor
app.listen(5500, () => {
    console.log("O servidor está rodando");
})