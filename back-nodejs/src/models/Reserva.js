const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  dataReserva: { type: String, required: false },
  status: { type: String, required: false },
});

const Reserva = mongoose.model('Reserva', ReservaSchema);

module.exports = Reserva;