const History = require('../models/History');

exports.getFullHistory = async (req, res) => {
  try {
    const history = await History.find();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar histórico' });
  }
};

exports.searchHistory = async (req, res) => {
  try {
    const filters = req.query;
    const history = await History.find(filters);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar com filtros' });
  }
};

exports.resetFilters = async (req, res) => {
  try {
    const history = await History.find();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao redefinir filtros' });
  }
};
