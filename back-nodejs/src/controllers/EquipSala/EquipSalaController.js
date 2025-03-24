const mongoose = require('mongoose');
const EquipSala = require('../../models/EquipSala');
const Equipamento = require('../../models/Equipamento');
const Reserva = require('../../models/Reserva');
const Room = require('../../models/Salas')


const addEquipamentoToSala = async (req, res) => {
  try {
    
    let { salaId, equipamentoId, equipNome, quantidade } = req.body;
    
    // salaId deve ser ObjectId válido
    if (!mongoose.isValidObjectId(salaId)) {
      return res.status(400).json({ msg: 'ID(s) fornecido(s) inválido(s)' });
    }

    // verificar input valido para quantidade
    const qtd_ = Number(quantidade);
    if (isNaN(qtd_) || !Number.isInteger(qtd_) || qtd_ <= 0) {
      return res.status(400).json({ msg: 'Quantidade deve ser um número inteiro maior que zero' });
    }

    // equipamentoId deve ser ObjectId válido ou deve-se fornecer um nome
    // criar equipamento caso não exista
    if(!mongoose.isValidObjectId(equipamentoId)){
      if(!equipNome){
        return res.status(404).json({msg: 'Informe um ID válido ou Nome para o equipamento'});
      }
      let equipamento = await Equipamento.findOne({nome: equipNome});

      if(!equipamento){
        equipamento = new Equipamento({nome: equipNome});
        await equipamento.save();
      }
      equipamentoId = equipamento._id;
    }

    let equipSala = await EquipSala.findOne({ salaId: salaId, equipamentoId: equipamentoId});
    if(equipSala){
      equipSala.quantidade += qtd_;
      await equipSala.save();
      return res.status(201).json({
        msg: 'Equipamento atualizado com sucesso',
        data: equipSala
      })
    }

    equipSala = new EquipSala({salaId, equipamentoId, quantidade: qtd_});    

    await equipSala.save();
    return res.status(201).json({ 
      msg: 'Equipamento adicionado à sala com sucesso', 
      data: equipSala 
    });

  } catch (error) {
    return res.status(500).json({ 
      msg: 'Erro interno no servidor', 
      error: error.message
    });
  }
};

const removeEquipamentoFromSala = async (req, res) => {
  try {
    const { salaId, equipamentoId } = req.params;
    // salaId e equipamentoId devem ser ObjectIds válidos
    if (!mongoose.isValidObjectId(salaId) || !mongoose.isValidObjectId(equipamentoId)) {
      return res.status(400).json({ msg: 'ID(s) fornecido(s) inválido(s)' });
    }
    
    // verifica se existe o equipamento na sala; indiretamente tambem verifica se o equipamento existe
    const equipSala = await EquipSala.findOne({ salaId, equipamentoId });
    if (!equipSala) {
      return res.status(404).json({ msg: 'Equipamento não encontrado para a sala informada' });
    }
    
    // verifica se há reservas ativas para esse equipamento nessa sala
    const hasActiveReservations = await equipHasActiveReservations(equipSala._id);

    if (hasActiveReservations) {
      return res.status(400).json({ msg: 'Não foi possível remover: Equipamento com reservas ativas' });
    }
    
    await EquipSala.findOneAndDelete(equipSala._id);
    
    return res.status(200).json({ 
      msg: 'Equipamento removido da sala com sucesso',
      data: equipSala
    });

  } catch (error) {
    return res.status(500).json({ 
      msg: 'Erro interno no servidor', 
      error: error.message
    });
  }
};

const updateEquipamentoInSala = async (req, res) => {
  try {
    const { salaId, equipamentoId } = req.params;
    let { quantidade } = req.body;

    // validacao dos IDs
    if (!mongoose.isValidObjectId(salaId) || !mongoose.isValidObjectId(equipamentoId)) {
      return res.status(400).json({ msg: 'ID(s) fornecido(s) inválido(s)' });
    }

    // validacao da quantidade
    const qtd_ = Number(quantidade); 
    if (isNaN(qtd_) || !Number.isInteger(qtd_) || qtd_ < 0) {
      return res.status(400).json({ msg: 'Quantidade deve ser um inteiro maior ou igual a zero' });
    }

    // verifica se o equipamento está cadastrado na sala
    const equipSala = await EquipSala.findOne({ salaId, equipamentoId });
    if (!equipSala) {
      return res.status(404).json({ msg: 'Nenhum Equipamento encontrado para esta sala' });
    }

    // se a quantidade for 0, remover o equipamento da sala
    if (qtd_ === 0) {
      // verifica se há reservas ativas antes de excluir
      const hasActiveReservations = await equipHasActiveReservations(equipSala._id);

      if (hasActiveReservations) {
        return res.status(400).json({ msg: 'Não foi possível remover: Equipamento com reservas ativas' });
      }

      await EquipSala.deleteOne(equipSala._id);
      return res.status(200).json({ msg: 'Equipamento removido da sala com sucesso' });
    }

    // Atualiza a quantidade do equipamento na sala
    equipSala.quantidade = qtd_;
    await equipSala.save();

    return res.status(200).json({ 
      msg: 'Equipamento atualizado com sucesso', 
      data: equipSala 
    });

  } catch (error) {
    return res.status(500).json({ 
      msg: 'Erro interno no servidor', 
      error: error.message
    });
  }
};

const getEquipamentosInSala = async (req, res) => {
  try {
    const { salaId } = req.params;

    // salaId deve ser ObjectId válido
    if (!mongoose.isValidObjectId(salaId)) {
      return res.status(400).json({ msg: 'ID(s) fornecido(s) inválido(s)' });
    }
    
    const equipamentos = await EquipSala.find({ salaId: salaId });
    // sala não existe ou não tem equipamentos
   
    if (equipamentos.length == 0) {
      return res.status(404).json({ msg: 'Nenhum equipamento encontrado para a sala informada' });
    }
    
    let bodyData = [], equipdata;
    
    for(i = 0; i < equipamentos.length; i++){
      equipdata = await Equipamento.findById(equipamentos[i].equipamentoId);
      
      bodyData.push({
        equipamento: {
          _id: equipdata._id,
          nome: equipdata.nome,
          datasReservas: equipdata.datasReservas
        },
        quantidade: equipamentos[i].quantidade
      });
      
    }
    
    return res.status(200).json({ 
      msg: 'Equipamentos listados com sucesso', 
      data: bodyData
    });

  } catch (error) {
    return res.status(500).json({ 
      msg: 'Erro interno no servidor', 
      error: error.message
    });
  }
};

const getAllEquipSala = async (req, res) => {
  try {
    const equipamentos = await EquipSala.find()
      .populate('salaId')
      .populate('equipamentoId');

    if (equipamentos.length === 0) {
      return res.status(404).json({ 
        msg: 'Nenhum equipamento encontrado em nenhuma sala' 
      });
    }

    const bodyData = [];
    for (let equipSala of equipamentos) {
      bodyData.push({
        equipamento: {
          _id: equipSala.equipamentoId._id,
          nome: equipSala.equipamentoId.nome
        },
        sala: {
          _id: equipSala.salaId._id,
          identificador: equipSala.salaId.identificador
        },
        quantidade: equipSala.quantidade,
        dataReservas: equipSala.datasReservas
      });
    }

    return res.status(200).json({
      msg: 'Equipamentos listados com sucesso',
      data: bodyData
    });

  } catch (error) {
    return res.status(500).json({
      msg: 'Erro interno no servidor',
      error: error.message
    });
  }
};

const equipHasActiveReservations = async (equipSalaId) => {
  const hasActiveReservations = await Reserva.findOne({
    equipSalaId: equipSalaId,
    status: { $ne: 'cancelada' },
    dataReserva: { $gte: new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  });
  return hasActiveReservations;
}

// Metodos auxiliares
const getSalaIdByName = async (sala) => {
  const salaObj = await Room.findOne({ identificador: sala });
  return salaObj? salaObj._id.toString() : null
}

const getEquipIdByName = async (equipamento) => {
  const equipObj = await Equipamento.findOne({ nome: equipamento });
  return equipObj? equipObj._id.toString() : null
}


module.exports = {
  addEquipamentoToSala,
  removeEquipamentoFromSala,
  updateEquipamentoInSala,
  getEquipamentosInSala,
  getAllEquipSala,
  getSalaIdByName,
  getEquipIdByName,
  equipHasActiveReservations
};