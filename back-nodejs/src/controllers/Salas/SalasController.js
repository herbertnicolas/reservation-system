const Room = require("../../models/Salas");

const getRooms = async (req, resp) => {
    try {
        const rooms = await Room.find({});
        resp.status(200).json(rooms);
    } catch (error) {
        resp.status(500).json({message: error.message});
    }
}

const getRoom = async (req, resp) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id);
        resp.status(200).json(room);
    } catch (error) {
        resp.status(500).json({message: error.message});
    }
}

const createRoom = async (req, res) => {
    const { identificador, localizacao, capacidade } = req.body;
    const existingRoom = await Room.findOne({ identificador });
    if (existingRoom) {
        return res.status(400).json({ erro: "Sala com identificador já existe!" });
    }
    if (typeof identificador !== 'string' || typeof capacidade !== 'number') {
        return res.status(400).json({ erro: "Dados inválidos!" });
    }
    try {
        const newRoom = await Room.create({ identificador, localizacao, capacidade });
        res.status(201).json({
        mensagem: "Sala criada com sucesso!",
        sala: {
            identificador: newRoom.identificador,
            localizacao: newRoom.localizacao,
            capacidade: newRoom.capacidade,
        },
        });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao criar sala" });
    }
}

const updateRoom = async (req, resp) => {
    try {
        const { id } = req.params;
        const room = await Room.findByIdAndUpdate(id, req.body);
        /*retorna o objeto antes de ser atualizado. Se eu quisesse que
        retornasse o já atualizado, deveria usar { new: true }*/
        if (!room){
            return resp.status(404).json({message: `Sala com identificador ${id} não encontrada`});
        }

        const Updatedroom = await Room.findById(id);
        resp.status(200).json(Updatedroom);

    } catch (error) {
        resp.status(500).json({message: error.message});
    }
}

const deleteRoom = async (req, resp) => {
    try {
        const { id } = req.params;
        const room = await Room.findByIdAndDelete(id);
        if (!room){
            return resp.status(404).json({message: `Sala com identificador ${id} não encontrada`});
        }
        resp.status(200).json({message: "Sala deletada com sucesso!"});
    
    } catch (error) {
        resp.status(500).json({message: error.message});
    }
}

module.exports = {
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom
};