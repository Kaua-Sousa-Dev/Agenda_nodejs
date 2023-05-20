// config
const mongoose = require('mongoose');
const userSchema = mongoose.Schema;

// collection
const Usuario = new userSchema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eAdmin:{
        type: Number,
        default: 0
    },
    senha: {
        type: String,
        required: true
    }
})

mongoose.model("usuarios", Usuario)