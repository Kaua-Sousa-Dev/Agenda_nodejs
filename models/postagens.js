const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postagens = new Schema({
    titulo:{
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true,
    },
    conteudo:{
        type: String,
        require: true
    },
    categorias: {
        type: Schema.Types.ObjectId,
        ref: 'Evento',
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("postagens", postagens)