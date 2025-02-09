const express = require('express');
const router = express.Router();
const {
  getEquipamentos,
  getEquipamento,
  reservarEquipamento,
  criarEquipamento,
} = require('../controllers/Equipamentos/EquipamentosController');

router.get('/', getEquipamentos);

router.get('/:equipamentoId', getEquipamento);

router.put('/:equipamentoId', reservarEquipamento);

router.post('/', criarEquipamento);

module.exports = router;