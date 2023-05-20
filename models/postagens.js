// Config
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Criando collection
const postagens = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true,
    },
    conteudo:{
        type: String,
        required: true
    },
    categorias: {
        type: Schema.Types.ObjectId,
        ref: 'Evento',
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", postagens)