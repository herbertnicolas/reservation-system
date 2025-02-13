const express = require('express');
const router = express.Router();
const {
    getReservas,
    getReserva,
    atualizarReserva,
    criarReserva,
} = require('../controllers/Reservas/ReservasController');

router.get('/', getReservas);

router.get('/:reservaId', getReserva);

router.put('/:reservaId', atualizarReserva);

router.post('/', criarReserva);

module.exports = router;