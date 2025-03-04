import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, Link } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/criar-sala" element={<CreateRoom />} />
        <Route path="/editar-sala/:id" element={<EditRoom />} />
      </Routes>
    </Router>
  );
};

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await fetch('http://localhost:3001/salas');
    const data = await response.json();
    setRooms(data);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/salas/${id}`, { method: 'DELETE' });
    fetchRooms();
  };

  return (
    <div>
      <h1>Gerenciamento de Salas</h1>
      <Link to="/criar-sala">
        <button>Criar Sala</button>
      </Link>
      <table>
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Localização</th>
            <th>Capacidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id}>
              <td>{room.identificador}</td>
              <td>{room.localizacao}</td>
              <td>{room.capacidade}</td>
              <td>
                <button onClick={() => navigate(`/editar-sala/${room._id}`)}>Editar Sala</button>
                <button onClick={() => handleDelete(room._id)}>Remover Sala</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CreateRoom = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    console.log('Dados enviados:', data); // Verifique os dados
    try {
      const response = await fetch('http://localhost:3001/salas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro no backend:', errorData);
        return;
      }

      navigate('/');
    } catch (error) {
      console.error('Erro ao criar sala:', error);
    }
  };

  return <RoomForm onSubmit={handleSubmit} />;
};

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/salas/${id}`)
      .then((response) => response.json())
      .then((data) => setRoom(data.sala));
  }, [id]);

  const handleSubmit = async (data) => {
    await fetch(`http://localhost:3001/salas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    navigate('/');
  };

  if (!room) return <div>Carregando...</div>;

  return <RoomForm onSubmit={handleSubmit} initialData={room} />;
};

const RoomForm = ({ onSubmit, initialData = {} }) => {
  const [identificador, setIdentificador] = useState(initialData.identificador || '');
  const [localizacao, setLocalizacao] = useState(initialData.localizacao || '');
  const [capacidade, setCapacidade] = useState(initialData.capacidade || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ identificador, localizacao, capacidade: Number(capacidade) }); // Converta capacidade para número
  };

  return (
    <div>
      <h2>{initialData._id ? 'Editar Sala' : 'Criar Sala'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Identificador:</label>
          <input
            type="text"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Localização:</label>
          <input
            type="text"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Capacidade:</label>
          <input
            type="number"
            value={capacidade}
            onChange={(e) => setCapacidade(e.target.value)}
            required
          />
        </div>
        <button type="submit">Confirmar</button>
      </form>
    </div>
  );
};

export default App;