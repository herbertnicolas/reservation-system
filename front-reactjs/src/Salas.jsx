import React, { useState, useEffect } from 'react';

function Salas(){
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ identificador: '', localizacao: '', capacidade: 0 });
    const [updateRoomData, setUpdateRoomData] = useState({ id: '', capacidade: 0 });

    // Função para buscar todas as salas
    const fetchRooms = async () => {
    try {
        const response = await fetch('http://localhost:3001/salas');
        const data = await response.json();
        setRooms(data);
    } catch (error) {
        console.error('Erro ao buscar salas:', error);
    }
    };

    // Função para buscar uma sala específica
    const fetchRoom = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/salas/${id}`);
        const data = await response.json();
        console.log('Sala encontrada:', data);
    } catch (error) {
        console.error('Erro ao buscar sala:', error);
    }
    };

    // Função para criar uma nova sala
    const createRoom = async () => {
    try {
        const response = await fetch('http://localhost:3001/salas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoom),
        });
        const data = await response.json();
        console.log('Sala criada:', data);
        fetchRooms(); // Atualiza a lista de salas após a criação
    } catch (error) {
        console.error('Erro ao criar sala:', error);
    }
    };

    // Função para atualizar a capacidade de uma sala
    const updateRoom = async () => {
    try {
        const response = await fetch(`http://localhost:3001/salas/${updateRoomData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ capacidade: updateRoomData.capacidade }),
        });
        const data = await response.json();
        console.log('Sala atualizada:', data);
        fetchRooms(); // Atualiza a lista de salas após a atualização
    } catch (error) {
        console.error('Erro ao atualizar sala:', error);
    }
    };

    // Função para deletar uma sala
    const deleteRoom = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/salas/${id}`, {
        method: 'DELETE',
        });
        const data = await response.json();
        console.log('Sala deletada:', data);
        fetchRooms(); // Atualiza a lista de salas após a deleção
    } catch (error) {
        console.error('Erro ao deletar sala:', error);
    }
    };

    // Efeito para carregar as salas ao montar o componente
    useEffect(() => {
    fetchRooms();
    }, []);

    return (
    <div>
        <h1>Gerenciamento de Salas</h1>

        <h2>Lista de Salas</h2>
        <ul>
        {rooms.map((room) => (
            <li key={room._id}>
            {room.identificador} - {room.localizacao} (Capacidade: {room.capacidade})
            <button onClick={() => deleteRoom(room._id)}>Deletar</button>
            </li>
        ))}
        </ul>

        <h2>Criar Nova Sala</h2>
        <input
        type="text"
        placeholder="Identificador"
        value={newRoom.identificador}
        onChange={(e) => setNewRoom({ ...newRoom, identificador: e.target.value })}
        />
        <input
        type="text"
        placeholder="Localização"
        value={newRoom.localizacao}
        onChange={(e) => setNewRoom({ ...newRoom, localizacao: e.target.value })}
        />
        <input
        type="number"
        placeholder="Capacidade"
        value={newRoom.capacidade}
        onChange={(e) => setNewRoom({ ...newRoom, capacidade: parseInt(e.target.value) })}
        />
        <button onClick={createRoom}>Criar Sala</button>

        <h2>Atualizar Capacidade da Sala</h2>
        <input
        type="text"
        placeholder="ID da Sala"
        value={updateRoomData.id}
        onChange={(e) => setUpdateRoomData({ ...updateRoomData, id: e.target.value })}
        />
        <input
        type="number"
        placeholder="Nova Capacidade"
        value={updateRoomData.capacidade}
        onChange={(e) => setUpdateRoomData({ ...updateRoomData, capacidade: parseInt(e.target.value) })}
        />
        <button onClick={updateRoom}>Atualizar Sala</button>
    </div>
    );
}

export default Salas;
