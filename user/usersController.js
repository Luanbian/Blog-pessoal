const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require("bcryptjs");
const adminAuth = require('../middleware/adminAuth');

router.get('/admin/users', adminAuth ,(req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/create", adminAuth,(req,res) => {
    res.render("admin/users/create");
});

router.post("/users/create", (req,res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({ //evitando e-mails duplicados
        where:{
            email: email
        }
    }).then(user => {
        if(user == undefined){ //se nao existir
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch((err) => {
                res.redirect("/");
            });
        } else{ //se ja existir o email
            res.redirect("/admin/users/create");
        }
    });
});

router.post("/users/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({
                where: {id: id}
            }).then(() => {
                res.redirect("/admin/user");
            })
        } else{ //se nao for um numero
            res.redirect('/admin/users')
        }
    } else{ //se for nulo
        res.redirect('/admin/users')
    }
})

router.get("/admin/users/edit/:id", adminAuth ,(req, res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/users");
    }
    User.findByPk(id).then(user => {
        if(user != undefined){
            res.render("admin/users/edit", {user: user});
        }else {
            res.redirect("/admin/users");
        }
    }).catch(erro => {
        res.redirect("/admin/users");
    })
});

router.post("/users/update" ,(req, res) => {
    var id = req.body.id;
    var email = req.body.email;
    User.update({email: email}, {
        where: {id: id}
    }).then(() =>{
        res.redirect("/admin/users");
    })
});

router.post('/users/save', (req,res) => {
    var email = req.body.email;
    if(email != undefined){
        User.create({
            email: email
        }).then(()=> {
            res.redirect("/admin/users");
        })
    } else{
        res.redirect('admin/users/create')
    }
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    User.findOne({
        where: {email: email}
    }).then(user => {
        if(user != undefined){ //se  o e-mail existe
            //validar senha
            var correct = bcrypt.compareSync(password, user.password); //comparando a senha no formulario com o banco de dados
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            } else{ 
                res.redirect("/login");
            }
        } else{
            res.redirect("/login");
        }
    })
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router;