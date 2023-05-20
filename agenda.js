// configuração express
const express = require('express');
const app = new express();

// configuração das rotas
const rotas = require('./routes/rotas')
const usuarios = require('./routes/usuario')

// configuração bodyparser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// configuração handlebars
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', './views')


// configuração arquivos estaticos
const path = require('path')
app.use(express.static(path.join(__dirname, "public")))

// config passport
const passport = require('passport')
require('./config/auth')(passport)


// configurando sessoes e midlewars
const session = require('express-session')
const flash = require('connect-flash')

    // Session
    app.use(session({
        secret: "agendaM.A",
        resave: true,
        saveUninitialized: true
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(flash())

    // Middlewar
    app.use((req,res,next) => {
        res.locals.sucess_msg = req.flash('sucess_msg')
        res.locals.error_msg = req.flash('error_msg')
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        next()
    })

// configuração do mongodb
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://0.0.0.0:27017/agendamentos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongo conectado")
}).catch((erro) => {
    console.log("erro" + erro)
})
    // config home page
        // postagens
        require('./models/postagens')
        const Postagens = mongoose.model('postagens')
        // agendas
        require('./models/mongo')
        const Categorias = mongoose.model('Evento')


// rotas
app.get('/', (req,res) =>{
    Postagens.find().lean().populate("categorias").sort({data: "desc"}).then((postagens) =>{
        res.render('admin/index', {postagens: postagens})
    }).catch((erro) =>{
        req.flash("error_msg", "Erro ao listar postagens")
        res.redirect("/404")
    })
    
})

app.get('/postagem/:slug', (req,res) =>{
    Postagens.findOne({slug: req.params.slug}).lean().then((postagens) =>{
        if(postagens){
            res.render("postagem/index", {postagens: postagens})
        }else{
            req.flash("error_msg", "Postagem Inexistente")
            res.redirect("/")
        }
    }).catch((erro) =>{
        req.flash("error_msg", "Erro interno")
        res.redirect("/")
    })
})

app.get("/agendas", (req,res) =>{
    Categorias.find().lean().then((categorias) =>{
        res.render("agendas/index", {categorias: categorias})
    }).catch((erro) =>{
        req.flash("error_msg", "Erro ao listar agendas!")
        res.redirect("/")
    })
})
app.get('/404', (req,res) =>{
    res.send("Error 404!")
})

app.use('/', rotas)
app.use('/usuarios', usuarios)

// Outros
app.listen(8081, () => {
    console.log("Servidor Rodando")
})