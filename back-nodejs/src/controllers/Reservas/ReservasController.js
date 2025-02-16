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
  try {
    const { tipo, dataReserva, salaId, equipamentoId } = req.body;

    // Validação básica
    if (!tipo || !dataReserva) {
      return res.status(400).json({ 
        msg: "Campos obrigatórios faltando: tipo, dataReserva" 
      });
    }

    // Validação de IDs
    if (tipo === "sala" && !salaId) {
      return res.status(400).json({ msg: "salaId é obrigatório para reserva de sala" });
    }

    // if (tipo === "equipamento" && (!salaId || !equipamentoId)) {
    //   return res.status(400).json({ msg: "salaId e equipamentoId são obrigatórios para reserva de equipamento" });
    // }

    let recurso;
    let model;

    // Lógica para reserva de SALA
    if (tipo === "sala") {
      // if (!mongoose.isValidObjectId(salaId)) {
      //   return res.status(400).json({ msg: "ID da sala inválido" });
      // }
      
      recurso = await Salas.findById(salaId);
      model = Salas;
    }

    // Lógica para reserva de EQUIPAMENTO
    if (tipo === "equipamento") {
      // if (!mongoose.isValidObjectId(equipamentoId)) {
      //   return res.status(400).json({ msg: "ID do equipamento inválido" });
      // }

      // Busca a relação equipamento-sala
      recurso = await EquipSala.findOne({ 
        salaId: salaId,
        equipamentoId: equipamentoId
      });

      model = EquipSala;
    }


    if (!recurso) {
      return res.status(404).json({ 
        msg: tipo === "sala" ? "Salas não encontrada" : "Equipamento não encontrado nesta sala"
      });
    }

    // Validação de formato de data (DD/MM/YYYY)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dataReserva.match(dateRegex)) {
      return res.status(400).json({ msg: "Formato de data inválido. Use DD/MM/YYYY" });
    }

    // Verificar conflito de datas
    if (recurso.datasReservas.includes(dataReserva)) {
      return res.status(400).json({ 
        msg: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} já reservado para esta data` 
      });
    }

    // Criar reserva
    const reserva = new Reserva({
      tipo,
      dataReserva,
      ...(tipo === "sala" && { salaId }),
      ...(tipo === "equipamento" && { 
        equipSalaId: recurso._id,
        salaId,
        equipamentoId 
      })
    });

    // Atualizar datas reservadas
    recurso.datasReservas.push(dataReserva);
    await Promise.all([reserva.save(), recurso.save()]);

    return res.status(201).json({
      msg: `Reserva de ${tipo} criada com sucesso`,
      data: reserva
    });

  } catch (err) {
    return res.status(500).json({
      msg: "Erro ao criar reserva",
      error: err.message
    });
  }
};

const atualizarReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;
    const { dataReserva } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva) return res.status(404).json({ msg: "Reserva não encontrada" });

    // Determinar o recurso relacionado
    let recurso;
    if (reserva.tipo === "sala") {
      recurso = await Salas.findById(reserva.salaId);
    } else {
      recurso = await EquipSala.findById(reserva.equipSalaId);
    }

    if (!recurso) return res.status(404).json({ msg: "Recurso não encontrado" });

    // Atualização de data
    if (dataReserva && dataReserva !== reserva.dataReserva) {
      // Remover data antiga
      recurso.datasReservas = recurso.datasReservas.filter(
        date => date !== reserva.dataReserva
      );
      
      // Verificar nova disponibilidade
      if (recurso.datasReservas.includes(dataReserva)) {
        return res.status(400).json({ 
          msg: `Data ${dataReserva} já está reservada para este ${reserva.tipo}`
        });
      }

      recurso.datasReservas.push(dataReserva);
      reserva.dataReserva = dataReserva;
    }

    await Promise.all([reserva.save(), recurso.save()]);

    return res.status(200).json({
      msg: "Reserva atualizada com sucesso",
      data: reserva
    });

  } catch (err) {
    return res.status(500).json({
      msg: "Erro ao atualizar reserva",
      error: err.message
    });
  }
};

const removerReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;

    // 1. Encontrar a reserva
    const reserva = await Reserva.findById(reservaId);
    if (!reserva) {
      return res.status(404).json({ 
        msg: "Reserva não encontrada" 
      });
    }

    // 2. Encontrar o recurso relacionado
    let recurso;
    if (reserva.tipo === "sala") {
      recurso = await Salas.findById(reserva.salaId);
    } else {
      recurso = await EquipSala.findById(reserva.equipSalaId);
    }

    if (!recurso) {
      return res.status(404).json({ 
        msg: `${reserva.tipo.charAt(0).toUpperCase() + reserva.tipo.slice(1)} não encontrado` 
      });
    }

    // 3. Remover a data das reservas do recurso
    recurso.datasReservas = recurso.datasReservas.filter(
      date => date !== reserva.dataReserva
    );
    
    // 4. Atualizar o recurso e excluir a reserva
    await Promise.all([
      recurso.save(),
      Reserva.findByIdAndDelete(reservaId)
    ]);

    return res.status(200).json({
      msg: "Reserva removida com sucesso",
      data: null
    });

  } catch (err) {
    return res.status(500).json({
      msg: "Erro ao remover reserva",
      error: err.message
    });
  }
};

module.exports = {
  getReservas,
  getReserva,
  atualizarReserva,
  criarReserva,
  removerReserva
};
