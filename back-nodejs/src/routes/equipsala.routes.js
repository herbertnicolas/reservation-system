const express = require('express');
const router = express.Router();
const {
  addEquipamentoToSala,
  removeEquipamentoFromSala,
  getEquipamentosInSala,
  updateEquipamentoInSala,
} = require('../controllers/EquipSala/EquipSalaController');

router.post('/', addEquipamentoToSala);
router.delete('/:salaId/:equipamentoId', removeEquipamentoFromSala);
router.get('/:salaId', getEquipamentosInSala);
router.put('/:salaId/:equipamentoId', updateEquipamentoInSala);

module.exports = router;