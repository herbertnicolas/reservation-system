const Room = require("../../models/Salas");
const validateRoomData = require('../middlewares/roomValidation');

const getRooms = async (req, resp) => {
    try {
        const rooms = await Room.find({});
        resp.status(200).json(rooms);
    } catch (error) {
        resp.status(500).json({message: error.message});
    }
}

const getRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        status: "Not Found",
        mensagem: `Sala com _id ${id} não encontrada!`,
      });
    }

    res.status(200).json({
      mensagem: "Sala encontrada!",
      sala: {
        _id: room._id, // Incluímos o _id na resposta
        identificador: room.identificador,
        localizacao: room.localizacao,
        capacidade: room.capacidade,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Internal Server Error",
      mensagem: "Erro ao buscar sala",
    });
  }
};

const createRoom = [validateRoomData, async (req, res) => {
  const { identificador, localizacao, capacidade } = req.body;
  const existingRoom = await Room.findOne({ identificador, localizacao, capacidade });
  if (existingRoom) {
    return res.status(400).json({
      erro: `Sala com identificador ${identificador}, localização ${localizacao} e capacidade ${capacidade} já existe!`,
    });
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
    res.status(500).json({
      erro: "Erro ao criar sala",
    });
  }
}];

const updateRoom = [validateRoomData, async (req, res) => {
  const { id } = req.params;
  const { identificador, localizacao, capacidade } = req.body;
  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        erro: `Sala com identificador ${id} não existe!`,
      });
    }

    room.identificador = identificador;
    room.localizacao = localizacao;
    room.capacidade = capacidade;

    await room.save();

    res.status(200).json({
      mensagem: "Sala editada com sucesso!",
      sala: {
        identificador: room.identificador,
        localizacao: room.localizacao,
        capacidade: room.capacidade,
      },
    });
  } catch (error) {
    res.status(500).json({
      erro: "Erro ao editar sala",
    });
  }
}];
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