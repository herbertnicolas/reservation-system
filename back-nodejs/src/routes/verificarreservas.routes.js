const express = require('express');
const router = express.Router();
const {
    filtrarReservas,
    listarReservas,
    modificarStatusReserva
} = require('../controllers/VerificarReservas/verificarreservasController');

router.get('/', listarReservas);
router.get('/status', filtrarReservas);
router.put('/:id', modificarStatusReserva);

module.exports = router;