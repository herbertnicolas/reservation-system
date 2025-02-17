const express = require('express');
const router = express.Router();
const {
    getReservas,
    getReserva,
    atualizarReserva,
    criarReserva,
    removerReserva
} = require('../controllers/Reservas/ReservasController');

router.get('/', getReservas);

router.get('/:reservaId', getReserva);

router.put('/:reservaId', atualizarReserva);

router.post('/', criarReserva);

router.delete('/:reservaId', removerReserva);

module.exports = router;