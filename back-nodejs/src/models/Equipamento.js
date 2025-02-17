const mongoose = require('mongoose');

// const disponibilidadeSchema = new mongoose.Schema({
//   data: { type: String, required: true },
//   status: { type: String, required: true },
// });

const equipamentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  datasReservas: { type: [String], required: false },
});

const Equipamento = mongoose.model('Equipamento', equipamentoSchema);

module.exports = Equipamento;