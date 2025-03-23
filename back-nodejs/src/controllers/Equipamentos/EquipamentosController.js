const Equipamento = require('../../models/Equipamento');
const EquipSala = require('../../models/EquipSala');
const Reserva = require('../../models/Reserva');

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

const getEquipamentoByName = async (req, res) => {
  try {
    const equipamento = await Equipamento.findOne({ nome: req.params.equipamentoNome });

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
}

const criarEquipamento = async (req, res) => {
  try {
    const {nome} = req.body;

    const exists = await Equipamento.findOne({nome});
    if (exists){
      return res.status(400).json({
        msg:'Equipamento Já existe'
      })
    }

    const equipamento = new Equipamento({
      nome
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

const deleteEquipamento = async (req, res) => {
  try {
    const equipamento = await Equipamento.findById(req.params.equipamentoId);

    if (!equipamento) {
      return res.status(404).json({
        msg: 'Equipamento não encontrado',
      });
    }

    // Encontra todas as associacoes com as salas
    const equipSalas = await EquipSala.find({ 
      equipamentoId: equipamento._id 
    });

    if (equipSalas.length > 0) {
      // Verifica se tem alguma com reserva ativa
      const hasActiveReservations = await Reserva.findOne({
        equipSalaId: { $in: equipSalas.map(es => es._id) },
        status: { $ne: 'cancelada' },
        dataReserva: { $gte: new Date() }
      });

      if (hasActiveReservations) {
        return res.status(400).json({
          msg: 'Não é possível remover um equipamento com reservas ativas',
        });
      }

      return res.status(400).json({
        msg: 'Não é possível remover um equipamento que está atribuído a uma sala',
      });
    }

    // Se nao tem associacoes, pode deletar
    await Equipamento.findByIdAndDelete(req.params.equipamentoId);

    return res.status(200).json({
      msg: 'Equipamento removido com sucesso',
      data: equipamento,
    });
  } catch (err) {
    return res.status(500).json({
      msg: 'Erro ao remover equipamento',
      error: err.message,
    });
  }
};


module.exports = {
  getEquipamentos,
  getEquipamento,
  criarEquipamento,
  getEquipamentoByName,
  deleteEquipamento
};