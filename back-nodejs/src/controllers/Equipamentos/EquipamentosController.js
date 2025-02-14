const Equipamento = require('../../models/Equipamento');

const getEquipamentos = async (req, res) => {
  try {
    const equipamentos = await Equipamento.find();
    return res.status(200).json({
      msg: 'Equipamentos listados com sucesso',
      data: equipamentos,
    });
  } catch (err) {
    return res.status(500).json({
      msg: 'Erro ao listar equipamentos',
      error: err.message,
    });
  }
};

const getEquipamento = async (req, res) => {
  try {
    const equipamento = await Equipamento.findById(req.params.equipamentoId);

    if (!equipamento) {
      return res.status(404).json({
        msg: 'Equipamento não encontrado',
      });
    }

    return res.status(200).json({
      msg: 'Equipamento encontrado com sucesso',
      data: equipamento,
    });
  } catch (err) {
    return res.status(500).json({
      msg: 'Erro ao buscar equipamento',
      error: err.message,
    });
  }
};

const criarEquipamento = async (req, res) => {
  try {
    const { _id, nome, disponibilidade } = req.body;

    const equipamento = new Equipamento({
      nome,
      disponibilidade,
    });

    await equipamento.save();

    return res.status(201).json({
      msg: 'Equipamento criado com sucesso',
      data: equipamento,
    });
  } catch (err) {
    return res.status(500).json({
      msg: 'Erro ao criar equipamento',
      error: err.message,
    });
  }
};

module.exports = {
  getEquipamentos,
  getEquipamento,
  criarEquipamento,
};