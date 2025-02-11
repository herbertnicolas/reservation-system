const EquipSala = require('../../models/EquipSala');
const Equipamento = require('../../models/Equipamento');

const addEquipamentoToSala = async (req, res) => {
  const { salaId, equipamentoId, quantidade } = req.body;
  if (quantidade <= 0) {
    return res.status(400).json({ msg: 'Quantidade deve ser maior que zero' });
  }

  const equipSala = new EquipSala({ salaId, equipamentoId, quantidade });
  await equipSala.save();
  res.status(201).json({ msg: 'Equipamento adicionado à sala com sucesso', data: equipSala });
};

const removeEquipamentoFromSala = async (req, res) => {
  const { salaId, equipamentoId } = req.params;
  const { quantidade } = req.body;

  if (quantidade == undefined) {
    await EquipSala.findOneAndDelete({ salaId, equipamentoId });
    return res.status(200).json({ msg: 'Equipamento removido da sala com sucesso' });
  }

  const equipSala = await EquipSala.findOne({ salaId, equipamentoId });
  if (!EquipSala) {
    return res.status(404).json({ msg: 'Equipamento não encontrado na sala' });
  }

  if (quantidade >= equipSala.quantidade) {
    await EquipSala.findOneAndDelete({ salaId, equipamentoId });
    return res.status(200).json({ msg: 'Equipamento removido da sala com sucesso' });
  }

  equipSala.quantidade -= quantidade;
  await equipSala.save();
  res.status(200).json({ msg: 'Quantidade de equipamento atualizada com sucesso', data: equipSala });
};

const getEquipamentosInSala = async (req, res) => {
  const { salaId } = req.params;
  const equipamentos = await EquipSala.find({ salaId });
  res.status(200).json({ msg: 'Equipamentos listados com sucesso', data: equipamentos });
};

const updateEquipamentoInSala = async (req, res) => {
  const { salaId, equipamentoId } = req.params;
  const { quantidade } = req.body;

  if (quantidade < 0) {
    return res.status(400).json({ msg: 'Quantidade deve ser maior ou igual a zero' });
  }

  if (quantidade === 0) {
    await EquipSala.findOneAndDelete({ salaId, equipamentoId });
    return res.status(200).json({ msg: 'Equipamento removido da sala com sucesso' });
  }

  const equipSala = await EquipSala.findOneAndUpdate(
    { salaId, equipamentoId },
    { quantidade },
    { new: true }
  );

  res.status(200).json({ msg: 'Equipamento atualizado com sucesso', data: equipSala });
};

module.exports = {
  addEquipamentoToSala,
  removeEquipamentoFromSala,
  getEquipamentosInSala,
  updateEquipamentoInSala,
};