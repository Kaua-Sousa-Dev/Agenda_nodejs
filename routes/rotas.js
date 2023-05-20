// Config
const express = require('express')
const router = express.Router()

// model de forma externa
const mongoose = require('mongoose')
require('../models/mongo')
const Categorias = mongoose.model('Evento')
require('../models/postagens')
const postagens = mongoose.model("postagens")

// Rotas de agendamentos
router.get('/agendamentos', (req,res) =>{
    Categorias.find().lean().sort({data: "desc"}).then((categorias) => {
        res.render('admin/agendamentos', {categorias: categorias})
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao listar eventos")
        res.redirect("/agendamentos")
    })
})

    // criação de agendamentos
router.get('/agendamentos/add', (req,res) => {
    res.render('admin/addagendamentos')
})

router.post('/agendamentos/add/nova', (req,res) => {
    
    let erros = []

    if(!req.body.evento || typeof req.body.evento == undefined || req.body.evento == null){
        erros.push({texto: "Erro ao criar evento!, Tente novamente com valores válidos"})
    }
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Erro ao descrever o conteúdo!, Tente novamente com valores válidos"})
    }
    if(req.body.evento.length < 3){
        erros.push({texto: "Nome do evento é muito curto, Digite um valor maior!"})
    }

    if(erros.length > 0){
        res.render("admin/addagendamentos", {erros: erros})
    }else{
         const addEvent = {
        Evento: req.body.evento,
        Conteudo: req.body.conteudo
    }
    new Categorias(addEvent).save().then(() => {
        req.flash("sucess_msg", "Evento criado com sucesso!")
        res.redirect("/agendamentos")
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao criar evento!, tente novamente")
        res.redirect("/agendamentos")
    })
    }
})

    // Edição de agendamentos
router.get("/agendamentos/edit/:id", (req,res) =>{
    Categorias.findOne({_id: req.params.id}).lean().then((categorias) =>{
        res.render("admin/editagendamento", {categorias: categorias})
    }).catch((erro =>{
        req.flash("error_msg", "Evento inexistente!")
        res.redirect("/agendamentos")
    }))
    
})

router.post("/agendamentos/edit", (req,res) => {
    Categorias.findOne({_id: req.body.id}).then((categorias) => {
    let erros = []
    
    if(!req.body.evento || typeof req.body.evento == undefined || req.body.evento == null){
        erros.push({texto: "Erro ao criar evento!, Tente novamente com valores válidos"})
    }
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Erro ao descrever o conteúdo!, Tente novamente com valores válidos"})
    }
    if(req.body.evento.length < 3){
        erros.push({texto: "Nome do evento é muito curto, Digite um valor maior!"})
    }
    if(req.body.evento == categorias.Evento && req.body.conteudo == categorias.Conteudo){
        erros.push({texto: "Valores iguais ao anterior, Digite um novo valor"})
    }

    if(erros.length > 0){
        Categorias.findOne({_id: req.body.id}).lean().then((categorias) => {
            res.render("admin/editagendamento", {categorias: categorias, erros: erros})
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao pegar dados")
            res.redirect("/agendamentos")
        })
    }else{
        
        categorias.Evento = req.body.evento,
        categorias.Conteudo = req.body.conteudo

        categorias.save().then(() =>{
            req.flash("sucess_msg", "Evento editado com sucesso")
            res.redirect("/agendamentos")
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao editar evento")
            res.redirect("/agendamentos")
        })

    }
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao editar evento")
        res.redirect("/agendamentos")
    })
})

    // Exclusão de agendamentos
router.post('/agendamentos/deletar', (req, res) =>{
    Categorias.deleteOne({_id: req.body.id}).then(() =>{
        req.flash("sucess_msg", "Evento deletado com sucesso")
        res.redirect("/agendamentos")
    }).catch((erro) =>{
        req.flash("error_msg", "Erro ao deletar evento")
        res.redirect("/agendamentos")
    })
})


// Rotas de postagens
router.get('/postagens', (req,res) =>{
    postagens.find().lean().populate({path: "categorias", strictPopulate: false}).sort({data: "desc"}).then((postagens) =>{
        res.render("admin/postagens", {postagens: postagens})
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao listar Postagem")
        res.redirect("/postagens")
    })
    
})

    // criação de postagens
router.get('/postagens/add', (req, res) => {
    Categorias.find().lean().then((categorias) => {
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((erro) =>{
        req.flash("error_msg", "Houve um erro ao criar postagem")
        res.redirect("/")
    })
})

router.post("/postagens/nova", (req,res) =>{
 
    let erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto: "Erro ao criar titulo!, Tente novamente com valores válidos"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Erro ao criar slug!, Tente novamente com valores válidos"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto: "Erro ao criar descrição!, Tente novamente com valores válidos"})
    }
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto: "Erro ao descrever o conteúdo!, Tente novamente com valores válidos"})
    }

    if(req.body.titulo.length < 3){
        erros.push({texto: "Nome do titulo é muito curto, Digite um valor maior!"})
    }
    if(req.body.slug.length < 3){
        erros.push({texto: "Nome do slug é muito curto, Digite um valor maior!"})
    }
    if(req.body.descricao.length < 3){
        erros.push({texto: "Nome da descrição é muito curto, Digite um valor maior!"})
    }
    if(req.body.conteudo.length < 3){
        erros.push({texto: "Nome do conteúdo é muito curto, Digite um valor maior!"})
    }

    if(req.body.categorias == "0"){
        erros.push({texto: "Agenda inválida, registre uma agenda"})
    }

    if(erros.length > 0){
        Categorias.find().lean().then((categorias) =>{
            res.render("admin/addpostagens", {categorias: categorias, erros: erros})
        }).catch((erro) =>{
            req.flash("error_msg", "Erro ao listar agenda")
            res.redirect("/postagens")
        })
        
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categorias: req.body.categorias
        }

        new postagens(novaPostagem).save().then(() =>{
            req.flash("sucess_msg", "Postagem criada com sucesso")
            res.redirect("/postagens")
        }).catch((erro) =>{
            req.flash("error_msg", "Erro ao criar postagem")
            res.redirect("/postagens")
        })
    }
})

    // Edição de postagens
router.get('/postagens/edit/:id', (req,res) => {
    postagens.findOne({_id: req.params.id}).lean().then((postagens) =>{
        
    Categorias.find().lean().then((categorias) => {
        res.render("admin/editpostagens", {categorias: categorias, postagens: postagens})
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao listar dados")
        res.redirect("/postagens")
    })

    }).catch((erro) => {
        req.flash("error_msg", "Erro ao pegar dados")
        res.redirect("/postagens")
    })
})

router.post('/postagens/edit', (req,res) => {
    postagens.findOne({_id: req.body.id}).then((postagens) => {

        postagens.titulo = req.body.titulo,
        postagens.slug = req.body.slug,
        postagens.descricao = req.body.descricao,
        postagens.conteudo = req.body.conteudo,
        postagens.categorias = req.body.categorias

        postagens.save().then(() =>{
            req.flash("sucess_msg", "Postagem editada com sucesso")
            res.redirect("/postagens")
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao editar postagem")
            res.redirect("/postagens")
        })
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao editar postagem" + erro)
            res.redirect("/postagens")
        })
})

    // Exclusão de postagens
router.get('/postagens/delete/:id', (req,res) =>{
    postagens.deleteOne({_id: req.params.id}).then(() =>{
        req.flash("sucess_msg", "Postagem deletada com sucesso!")
        res.redirect("/postagens")
    }).catch((erro) =>{
        req.flash("error_msg", "Erro ao deletar postagem")
        res.redirect("/postagens")
    })
})

module.exports = router