// config
const mongoose = require('mongoose');
const eventSchema = mongoose.Schema;

// Criando collection
const Evento = new eventSchema({
    Evento: {
        type: String,
        required: true
    },
    Conteudo: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model('Evento', Evento)