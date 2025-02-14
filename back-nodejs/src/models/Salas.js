const mongoose = require('mongoose')

const RoomSchema = mongoose.Schema(
    {
        identificador: {
            type: String,
            required: [true, "Por favor insira o identificador da sala"]
        },

        localizacao: {
            type: String,
            required: [true, "Por favor insira o predio da sala"]
        },

        capacidade: {
            type: Number,
            required: [true, "Por favor insira o numero da sala"]
        },
        datasReservas: {
            type: String,
            required: false
        }
    }

);

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;