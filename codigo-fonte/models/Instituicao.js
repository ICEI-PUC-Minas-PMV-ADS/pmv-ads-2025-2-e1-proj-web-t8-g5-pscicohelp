const mongoose = require('mongoose')

const InstituicaoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    estado: {type: String, required: true},
    municipio: {type: String, required: true},
    faixaetaria: {type: String, required: true},
    abordagem: {type: String, required: true},
    prontoatendimento: {type: String, required: true},
    telefone: {type: String, default: ""},
    endereco:{type: String, default: ""}
}, {timestamps: true});

module.exports = mongoose.model("Instituicao", InstituicaoSchema)