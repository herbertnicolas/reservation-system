const express = require('express');
const router = express.Router();
const EquipamentosController = require('./controllers/Equipamentos/EquipamentosController');
const historyController = require('./controllers/historyController');

// const equipmentsController = new EquipamentosController(router);
new EquipamentosController(router);
router.get('/', (req, res) => {
    res.send('Hello World!!!');
});

router.get('/history', historyController.getFullHistory);
router.get('/history/search', historyController.searchHistory);
router.get('/history/reset', historyController.resetFilters);

module.exports = router;