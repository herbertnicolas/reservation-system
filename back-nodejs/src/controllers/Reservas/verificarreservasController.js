const Reserva = require('../../models/Reserva');

const listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find();

        if (reservas.length === 0) {
            return res.status(200).json({
                msg: "Nenhuma reserva cadastrada.",
                data: []
            });
        }

        return res.status(200).json({
            msg: "Lista de todas as reservas",
            data: reservas
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'ERRO: Não foi possível listar as reservas',
            error: err.message
        });
    }
};

const modificarStatusReserva = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusReserva } = req.body;

        const statusValidos = ["pendente", "confirmada", "cancelada"];
        if (!statusValidos.includes(statusReserva)) {
            return res.status(400).json({
                msg: "ERRO: Status inválido."
            });
        }

        const reserva = await Reserva.findById(id);
        if (!reserva) {
            return res.status(404).json({
                msg: "ERRO: Reserva não encontrada."
            });
        }

        reserva.statusReserva = statusReserva;
        await reserva.save();

        return res.status(200).json({
            msg: `Status da reserva atualizado para '${statusReserva.toUpperCase()}'.`,
            data: reserva
        });
    } catch (err) {
        return res.status(500).json({
            msg: "ERRO: Não foi possível alterar o status da reserva.",
            error: err.message
        });
    }
};

const filtrarReservas = async (req, res) => {
    try {
        const { status } = req.params;
        const reservas = await Reserva.find({ statusReserva: status });

        if (reservas.length === 0) {
            return res.status(200).json({
                msg: `Nenhuma reserva encontrada com o status ${status.toUpperCase()}`,
                data: []
            });
        }

        return res.status(200).json({
            msg: `Lista de reservas com status ${status.toUpperCase()}`,
            data: reservas
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'ERRO: Não foi possível filtrar as reservas.',
            error: err.message
        });
    }
};

module.exports = {
    listarReservas,
    modificarStatusReserva,
    filtrarReservas
};
