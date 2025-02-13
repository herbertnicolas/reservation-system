const mongoose = require('mongoose');

const EquipSalaSchema = new mongoose.Schema({
  salaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  equipamentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipamento', required: true },
  quantidade: { type: Number, required: false, min: 0 },
  datasReservas: { type: [String], default: [] }, 
});

module.exports = mongoose.model('EquipSala', EquipSalaSchema);