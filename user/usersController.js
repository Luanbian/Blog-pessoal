const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require("bcryptjs");

router.get('/admin/users', (req, res) => {
    res.send("lista de usuarios");
});

router.get("/admin/users/create", (req,res) => {
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

module.exports = router;