const { addEquipamentoToSala, removeEquipamentoFromSala, getEquipamentosInSala, updateEquipamentoInSala } = require('../controllers/EquipSala/EquipSalaController');
const EquipSala = require('../models/EquipSala');
const Equipamento = require('../models/Equipamento');
const Sala = require('../models/Salas');

describe('EquipSalaController', () => {
  let salaId;
  let equipamentoId;

  beforeAll(async () => {
    await connectDB(process.env.MONGODB_URI);
    const sala = new Sala({ identificador: 'Sala1', predio: 'Prédio A', capacidade: 30 });
    await sala.save();
    salaId = sala._id;

    const equipamento = new Equipamento({ nome: 'Projetor' });
    await equipamento.save();
    equipamentoId = equipamento._id;
  });

  afterAll(async () => {
    await Sala.deleteMany({});
    await Equipamento.deleteMany({});
    await EquipSala.deleteMany({});
    await disconnectDB();
  });

  test('deve adicionar um equipamento à sala', async () => {
    const req = { body: { salaId, equipamentoId } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await addEquipamentoToSala(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Equipamento adicionado à sala com sucesso' }));
  });

  test('deve remover um equipamento da sala', async () => {
    const req = { params: { salaId, equipamentoId } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await removeEquipamentoFromSala(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Equipamento removido da sala com sucesso' }));
  });

  test('deve listar os equipamentos da sala', async () => {
    const req = { params: { salaId } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getEquipamentosInSala(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Equipamentos listados com sucesso' }));
  });

  test('deve atualizar um equipamento na sala', async () => {
    const req = { params: { salaId, equipamentoId }, body: { nome: 'Novo Nome', disponibilidade: true } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await updateEquipamentoInSala(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Equipamento atualizado com sucesso' }));
  });
});