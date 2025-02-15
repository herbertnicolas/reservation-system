const Room = require("../../models/Salas");

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
      const room = await Room.findOne({ identificador: id }); // Busca pelo identificador
      if (!room) {
        return res.status(404).json({
          status: "Not Found",
          mensagem: `Sala com identificador ${id} não encontrada!`,
        });
      }
  
      res.status(200).json({
        mensagem: "Sala encontrada!",
        sala: {
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

const createRoom = async (req, res) => {
    const { identificador, localizacao, capacidade } = req.body;
    if (typeof identificador !== 'string') {
      return res.status(400).json({
        erro: "Identificador deve ser uma string!",
      });
    }
  
    if (typeof capacidade !== 'number') {
      return res.status(400).json({
        erro: "Capacidade deve ser um número!",
      });
    }

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
};

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