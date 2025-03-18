const express = require('express');
const router = express.Router();
const {
  addEquipamentoToSala,
  removeEquipamentoFromSala,
  updateEquipamentoInSala,
  getEquipamentosInSala,
  getAllEquipSala
} = require('../controllers/EquipSala/EquipSalaController');

router.post('/', addEquipamentoToSala);
router.delete('/:salaId/:equipamentoId', removeEquipamentoFromSala);
router.put('/:salaId/:equipamentoId', updateEquipamentoInSala);
router.get('/:salaId', getEquipamentosInSala);
router.get('/', getAllEquipSala);

module.exports = router;