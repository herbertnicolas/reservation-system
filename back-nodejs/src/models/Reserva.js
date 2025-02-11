const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  equipSalaId: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipSala', required: true },
  salaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false },
  tipo: { type: String, required: true },
  dataReserva: { type: String, required: false },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
});

const Reserva = mongoose.model('Reserva', ReservaSchema);

module.exports = Reserva;