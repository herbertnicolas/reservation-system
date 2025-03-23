const mongoose = require('mongoose');
const Reserva = require('../../models/Reserva');

const formatarStatus = (status) => {
    const statusFormatado = {
        "pendente": "Pendente",
        "confirmada": "Confirmada",
        "cancelada": "Cancelada"
    };
    return statusFormatado[status] || status;
};

const listarReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find();

        if (reservas.length === 0) {
            return res.status(200).json({
                msg: "Nenhuma reserva cadastrada.",
                data: []
            });
        }

        const reservasFormatadas = reservas.map(reserva => ({
            ...reserva.toObject(),
            statusReserva: formatarStatus(reserva.statusReserva)
        }));

        return res.status(200).json({
            msg: "Lista de todas as reservas",
            data: reservasFormatadas
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
        const statusStatusReserva = statusReserva.toLowerCase();

        if (!statusValidos.includes(statusStatusReserva)) {
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

        reserva.statusReserva = statusStatusReserva;
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
        const { status } = req.query;

        if (!status) {
            return res.status(400).json({
                msg: 'ERRO: É necessário escolher um status.',
            });
        }

        const statusFormatado = status.toLowerCase();

        const statusValidos = ["pendente", "confirmada", "cancelada"];
        if (!statusValidos.includes(statusFormatado)) {
            return res.status(400).json({
                msg: `ERRO: Status inválido. Status válidos são: ${statusValidos.join(", ")}`,
            });
        }

        const reservas = await Reserva.find({ statusReserva: statusFormatado });

        if (reservas.length === 0) {
            return res.status(200).json({
                msg: `Nenhuma reserva encontrada com o status ${statusFormatado.toUpperCase()}`,
                data: []
            });
        }

        return res.status(200).json({
            msg: `Lista de reservas com status ${statusFormatado.toUpperCase()}`,
            data: reservas
        });
    } catch (err) {
        return res.status(500).json({
            msg: 'ERRO: Não foi possível filtrar as reservas.',
            error: err.message
        });
    }
};

const buscarReservaId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: "ERRO: ID de reserva inválido."
            });
        }
        
        const reserva = await Reserva.findById(id);

        if (!reserva) {
            return res.status(404).json({
                msg: "ERRO: Reserva não encontrada."
            });
        }

        return res.status(200).json({
            msg: "Reserva encontrada.",
            data: reserva
        });
    } catch (err) {
        return res.status(500).json({
            msg: "ERRO: Não foi possível buscar a reserva.",
            error: err.message
        });
    }
};

module.exports = {
    listarReservas,
    modificarStatusReserva,
    filtrarReservas,
    buscarReservaId
};
