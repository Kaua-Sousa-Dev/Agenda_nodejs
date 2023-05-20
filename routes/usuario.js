// configurações
const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
require("../models/usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require('bcryptjs')
const passport = require('passport')


router.get("/registro", (req,res) =>{
    res.render("usuarios/registro")
})
router.post("/registro", (req,res) =>{
    let erros = []

    if(!req.body.nome || req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome Inválido!"})
    }
    if(!req.body.email || req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email Inválido"})
    }
    if(!req.body.senha || req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha Inválida!"})
    }
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta!"})
    }
    if(req.body.senha2 != req.body.senha){
        erros.push({texto: "Senhas diferentes, Digite valores iguais"})
    }


    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})

    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) =>{
            if(usuario){
                req.flash("error_msg", "Este email já existe em nosso sistema!")
                res.redirect("/usuarios/registro")
            }else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) =>{
                        if(erro){
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario!")
                            res.redirect("/")
                        }


                        novoUsuario.senha = hash

                        novoUsuario.save().then(() =>{
                            req.flash("sucess_msg", "Usuario criado com sucesso!")
                            res.redirect("/")
                        }).catch((erro) => {
                            req.flash("error_msg", "Erro ao criar usuario")
                            res.redirect("/")
                        })
                    })
                })

            }
        }).catch((erro) =>{
            req.flash("error_msg", "Houve um erro Interno" + erro)
            res.redirect("/")
        })
    }
})

router.get("/login", (req,res) =>{
    res.render("usuarios/login")
})
router.post("/login", (req,res,next) =>{

    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true

    })(req,res,next)

})

router.get("/logout", (req,res) =>{
    req.logOut((erro) =>{
        req.flash("sucess_msg", "Deslogado com sucesso!")
        res.redirect("/") 
    })
})

module.exports = router