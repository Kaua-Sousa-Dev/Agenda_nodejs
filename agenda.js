// configuração express
const express = require('express');
const app = new express();

// configuração das rotas
const rotas = require('./routes/rotas')

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

// configurando sessoes e midlewars
const session = require('express-session')
const flash = require('connect-flash')

    // Session
    app.use(session({
        secret: "agendaM.A",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

    // Middlewar
    app.use((req,res,next) => {
        res.locals.sucess_msg = req.flash('sucess_msg')
        res.locals.error_msg = req.flash('error_msg')
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

// rotas
app.get('/', (req,res) =>{
    res.render('admin/index')
})


app.use('/', rotas)

// Outros
app.listen(8081, () => {
    console.log("Servidor Rodando")
})