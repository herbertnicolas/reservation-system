const express = require('express');
const router = express.Router();
const {
    filtrarReservas,
    listarReservas,
    modificarStatusReserva,
    buscarReservaId
} = require('../controllers/VerificarReservas/verificarreservasController');

router.get('/', listarReservas);
router.get('/status', filtrarReservas);
router.put('/:id', modificarStatusReserva);
router.get('/:id', buscarReservaId);

module.exports = router;