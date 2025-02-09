const mongoose = require('mongoose');

const GerEquipSalaSchema = new mongoose.Schema({
  salaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true },
  equipamentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipamento', required: true },
  quantidade: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('GerEquipSala', GerEquipSalaSchema);