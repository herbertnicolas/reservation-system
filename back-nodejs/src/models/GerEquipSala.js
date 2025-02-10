const mongoose = require('mongoose');

const GerEquipSalaSchema = new mongoose.Schema({
  salaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  equipamentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipamento', required: true },
  quantidade: { type: Number, required: false, min: 0 }
});

module.exports = mongoose.model('GerEquipSala', GerEquipSalaSchema);