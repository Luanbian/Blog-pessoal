const express = require("express");
const app = express();

//rotas
app.get("/", (req, res) => {
    res.send("Bem vindo ao meu site");
});

app.listen(5500, () => {
    console.log("O servidor está rodando");
})