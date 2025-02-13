const Reserva = require("../../models/Reserva");
const Salas = require("../../models/Salas");
const EquipSala = require("../../models/EquipSala");

const getReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find();
    return res.status(200).json({
      msg: "Reservas listados com sucesso",
      data: reservas,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Erro ao listar reservas",
      error: err.message,
    });
  }
};

const getReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.reservaId);

    if (!reserva) {
      return res.status(404).json({
        msg: "Reserva não encontrado",
      });
    }

    return res.status(200).json({
      msg: "Reserva encontrado com sucesso",
      data: reserva,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Erro ao buscar reserva",
      error: err.message,
    });
  }
};

const criarReserva = async (req, res) => {
  const { tipo, equipSalaId, dataReserva, usuarioId } = req.body;
  
  if (tipo === "equipamento") {
    const { equipSalaId, dataReserva, usuarioId } = req.body;
    try {
      //buscanco equipamento de uma sala
      const equipSala = await EquipSala.findById(equipSalaId);
      // verifica se está disponível na data passada
      if (equipSala.datasReservas.includes(dataReserva)) {
        return res.status(400).json({
          msg: "Equipamento já reservado para esta data",
        });
      }
      // criando a reserva
      const reserva = new Reserva({
        equipSalaId,
        dataReserva,
        tipo,
        // usuarioId,
      });
      await reserva.save();
      // atualizando array de reservas no EquipSala com reserva nova
      equipSala.datasReservas.push(dataReserva);
      await equipSala.save();

      return res.status(201).json({
        msg: "Reserva de equipamento criada com sucesso",
        data: reserva,
      });
    } catch (err) {
      return res.status(500).json({
        msg: "Erro ao criar reserva",
        error: err.message,
      });
    }
  } else if (tipo === "sala") {

    try {
      const salaId = await EquipSala.findById(equipSalaId).salaId;
      const sala = await Sala.findById(salaId);

      if (sala.datasReservas.includes(dataReserva)) {
        return res.status(400).json({
          msg: "Sala já reservada para esta data",
        });
      }

      const reserva = new Reserva({
        salaId,
        dataReserva,
        usuarioId,
      });

      await reserva.save();

      // Atualizar datasReservas na Sala
      sala.datasReservas.push(dataReserva);
      await sala.save();

      return res.status(201).json({
        msg: "Reserva de sala criada com sucesso",
        data: reserva,
      });
    } catch (err) {
      return res.status(500).json({
        msg: "Erro ao criar reserva",
        error: err.message,
      });
    }
  }
};

const atualizarReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;
    const { dataReserva, usuarioId } = req.body;

    const reserva = await Reserva.findById(reservaId);

    if (!reserva) {
      return res.status(404).json({
        msg: "Reserva não encontrada",
      });
    }

    // Verifica se a data está sendo atualizada
    if (dataReserva && dataReserva !== reserva.dataReserva) {
      let modelToUpdate;
      let modelType;

      // Determina o tipo de reserva (sala ou equipamento)
      if (reserva.salaId) {
        modelType = 'sala';
        modelToUpdate = await Sala.findById(reserva.salaId);
      } else if (reserva.equipSalaId) {
        modelType = 'equipamento';
        modelToUpdate = await EquipSala.findById(reserva.equipSalaId);
      } else {
        return res.status(400).json({
          msg: "Reserva inválida: não vinculada a sala ou equipamento",
        });
      }

      // Remove a data antiga das reservas
      const index = modelToUpdate.datasReservas.indexOf(reserva.dataReserva);
      if (index > -1) {
        modelToUpdate.datasReservas.splice(index, 1);
      }

      // Verifica disponibilidade da nova data
      if (modelToUpdate.datasReservas.includes(dataReserva)) {
        return res.status(400).json({
          msg: `${modelType.charAt(0).toUpperCase() + modelType.slice(1)} já reservada para esta data`,
        });
      }

      // Atualiza com a nova data
      modelToUpdate.datasReservas.push(dataReserva);
      await modelToUpdate.save();

      // Atualiza a data na reserva
      reserva.dataReserva = dataReserva;
    }

    // Atualiza usuário se fornecido
    if (usuarioId !== undefined) {
      reserva.usuarioId = usuarioId;
    }

    await reserva.save();

    return res.status(200).json({
      msg: "Reserva atualizada com sucesso",
      data: reserva,
    });
    
  } catch (err) {
    return res.status(500).json({
      msg: "Erro ao atualizar reserva",
      error: err.message,
    });
  }
};
module.exports = {
  getReservas,
  getReserva,
  atualizarReserva,
  criarReserva,
};
