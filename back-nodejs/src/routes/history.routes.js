const express = require('express');
const router = express.Router();
const {
  getFullHistory,
  searchHistory,
  resetFilters,
} = require('../controllers/historyController');

// Obter todo o histórico
router.get('/', getFullHistory);

// Buscar histórico com filtros
router.get('/buscar', searchHistory);

// Redefinir filtros (retornar todo o histórico)
router.get('/redefinir', resetFilters);

module.exports = router;
