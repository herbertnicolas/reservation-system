const express = require('express');
const router = express.Router();
const EquipamentosController = require('./controllers/Equipamentos/EquipamentosController');

// const equipmentsController = new EquipamentosController(router);
new EquipamentosController(router);
router.get('/', (req, res) => {
    res.send('Hello World!!!');
});

module.exports = router;