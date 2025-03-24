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

    if (!tipo || !dataReserva) {
      return res.status(400).json({
        msg: "Selecione uma data válida",
      });
    }

    if (tipo === "sala" && !salaId) {
      return res
        .status(400)
        .json({ msg: "salaId é obrigatório para reserva de sala" });
    }

    // if (tipo === "equipamento" && (!salaId || !equipamentoId)) {
    //   return res.status(400).json({ msg: "salaId e equipamentoId são obrigatórios para reserva de equipamento" });
    // }

    let recurso;
    let model;

    if (tipo === "sala") {
      recurso = await Salas.findById(salaId);
      model = Salas;
    }
    
    if (tipo === "equipamento") {
      // busca a relacao equipamento-sala
      recurso = await EquipSala.findOne({
        salaId: salaId,
        equipamentoId: equipamentoId,
      });

      model = EquipSala;
    }

    if (!recurso) {
      return res.status(404).json({
        msg:
          tipo === "sala"
            ? "Sala não encontrada"
            : "Equipamento não encontrado nesta sala",
      });
    }

    // formato de data esperado = DD/MM/YYYY
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dataReserva.match(dateRegex)) {
      return res
        .status(400)
        .json({ msg: "Formato de data inválido. Use DD/MM/YYYY" });
    }

    // verifica conflito de datas
    if (tipo === "equipamento") {
      if (recurso.datasReservas.includes(dataReserva)) {
        return res.status(400).json({
          msg: "Reserva indisponível para esta data",
        });
      }
    }

    const reserva = new Reserva({
      tipo,
      dataReserva,
      ...(tipo === "sala" && { salaId }),
      ...(tipo === "equipamento" && {
        equipSalaId: recurso._id,
        salaId,
        equipamentoId,
      }),
    });

    if (tipo === "equipamento") {
      recurso.datasReservas.push(dataReserva);
    }
    await Promise.all([reserva.save(), recurso.save()]);

    return res.status(201).json({
      msg: `Solicitação de reserva de ${tipo} criada com sucesso`,
      data: reserva,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Erro ao criar solicitação de reserva",
      error: err.message,
    });
  }
};

const atualizarReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;
    const { dataReserva } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva)
      return res.status(404).json({ msg: "Reserva não encontrada" });

    // determinando o recurso relacionado
    let recurso;
    if (reserva.tipo === "sala") {
      recurso = await Salas.findById(reserva.salaId);
    } else {
      recurso = await EquipSala.findById(reserva.equipSalaId);
    }

    if (!recurso)
      return res.status(404).json({ msg: "Recurso não encontrado" });

    // atualizando data
    if (dataReserva && dataReserva !== reserva.dataReserva) {
      recurso.datasReservas = recurso.datasReservas.filter(
        (date) => date !== reserva.dataReserva
      );

      // checando nova disponibilidade
      if (recurso.datasReservas.includes(dataReserva)) {
        return res.status(400).json({
          msg: `Data ${dataReserva} já está reservada para este ${reserva.tipo}`,
        });
      }

      recurso.datasReservas.push(dataReserva);
      reserva.dataReserva = dataReserva;
    }

    await Promise.all([reserva.save(), recurso.save()]);

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

const removerReserva = async (req, res) => {
  try {
    const { reservaId } = req.params;

    // encontrando a reserva
    const reserva = await Reserva.findById(reservaId);
    if (!reserva) {
      return res.status(404).json({
        msg: "Solicitação de reserva não encontrada",
      });
    }

    // encontrando o recurso relacionado
    let recurso;
    if (reserva.tipo === "sala") {
      recurso = await Salas.findById(reserva.salaId);
    } else {
      recurso = await EquipSala.findById(reserva.equipSalaId);
    }

    if (!recurso) {
      return res.status(404).json({
        msg: `${
          reserva.tipo.charAt(0).toUpperCase() + reserva.tipo.slice(1)
        } não encontrado`,
      });
    }

    // removendo a data das reservas do recurso
    recurso.datasReservas = recurso.datasReservas.filter(
      (date) => date !== reserva.dataReserva
    );

    await Promise.all([recurso.save(), Reserva.findByIdAndDelete(reservaId)]);

    return res.status(200).json({
      msg: "Solicitação de reserva removida com sucesso",
      data: null,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Erro ao remover reserva",
      error: err.message,
    });
  }
};

module.exports = {
  getReservas,
  getReserva,
  atualizarReserva,
  criarReserva,
  removerReserva,
};
