const express = require('express')
const router = express.Router()

// model de forma externa
const mongoose = require('mongoose')
require('../models/mongo')
const Categorias = mongoose.model('Evento')

router.get('/', (req,res) =>{
    res.render('admin/index')
})

router.get('/agendamentos', (req,res) =>{
    Categorias.find().lean().sort({data: "desc"}).then((categorias) => {
        res.render('admin/agendamentos', {categorias: categorias})
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao listar eventos")
        res.redirect("/agendamentos")
    })
})

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

module.exports = router