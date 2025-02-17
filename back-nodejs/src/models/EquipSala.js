const mongoose = require('mongoose');

const EquipSalaSchema = new mongoose.Schema({
  salaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  equipamentoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipamento', required: true },
  quantidade: { type: Number, required: true, min: 1 },
  datasReservas: { type: [String], default: [] }, 
});

const EquipSala = mongoose.model('EquipSala', EquipSalaSchema);

module.exports = EquipSala;