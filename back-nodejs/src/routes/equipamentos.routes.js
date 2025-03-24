const express = require('express');
const router = express.Router();
const {
  getEquipamentos,
  getEquipamento,
  criarEquipamento,
  deleteEquipamento
} = require('../controllers/Equipamentos/EquipamentosController');

router.get('/', getEquipamentos);

router.get('/:equipamentoId', getEquipamento);

router.post('/', criarEquipamento);

router.delete('/:equipamentoId', deleteEquipamento);

module.exports = router; 