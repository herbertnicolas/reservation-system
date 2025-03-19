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

        if (!statusReserva) {
            return res.status(400).json({
                msg: "ERRO: Status da reserva não fornecido."
            });
        }

        const statusCerto = statusReserva.toLowerCase();

        const statusValidos = ["pendente", "confirmada", "cancelada"];
        if (!statusValidos.includes(statusCerto)) {
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

        reserva.statusReserva = statusCerto;
        await reserva.save();

        return res.status(200).json({
            msg: `Status da reserva atualizado para '${statusCerto.toUpperCase()}'.`,
            data: reserva
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            msg: "ERRO: Não foi possível alterar o status da reserva.",
            error: err.message
        });
    }
};


const filtrarReservas = async (req, res) => {
    const { status } = req.query;
    try {
        if (!status) {
            return res.status(400).json({
                msg: 'ERRO: É necessário escolher um status.',
            });
        }
        const statusFiltro = status.toLowerCase();
        const reservas = await Reserva.find({ statusReserva: statusFiltro });

        if (reservas.length === 0) {
            return res.status(200).json({
                msg: `Nenhuma reserva encontrada com o status ${statusFiltro.toUpperCase()}`,
                data: []
            });
        }

        return res.status(200).json({
            msg: `Lista de reservas com status ${statusFiltro.toUpperCase()}`,
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
