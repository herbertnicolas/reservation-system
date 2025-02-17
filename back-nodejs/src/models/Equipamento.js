const mongoose = require('mongoose');

const equipamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  datasReservas: { type: [String], required: false },
});

const Equipamento = mongoose.model('Equipamento', equipamentoSchema);

module.exports = Equipamento;