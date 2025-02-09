const GerEquipSala = require('../../models/GerEquipSala');
const Equipamento = require('../../models/Equipamento');

const addEquipamentoToSala = async (req, res) => {
  const { salaId, equipamentoId, quantidade } = req.body;
  if (quantidade <= 0) {
    return res.status(400).json({ msg: 'Quantidade deve ser maior que zero' });
  }

  const gerEquipSala = new GerEquipSala({ salaId, equipamentoId, quantidade });
  await gerEquipSala.save();
  res.status(201).json({ msg: 'Equipamento adicionado à sala com sucesso', data: gerEquipSala });
};

const removeEquipamentoFromSala = async (req, res) => {
  const { salaId, equipamentoId } = req.params;
  const { quantidade } = req.body;

  if (quantidade === undefined) {
    await GerEquipSala.findOneAndDelete({ salaId, equipamentoId });
    return res.status(200).json({ msg: 'Equipamento removido da sala com sucesso' });
  }

  const gerEquipSala = await GerEquipSala.findOne({ salaId, equipamentoId });
  if (!gerEquipSala) {
    return res.status(404).json({ msg: 'Equipamento não encontrado na sala' });
  }

  if (quantidade >= gerEquipSala.quantidade) {
    await GerEquipSala.findOneAndDelete({ salaId, equipamentoId });
    return res.status(200).json({ msg: 'Equipamento removido da sala com sucesso' });
  }

  gerEquipSala.quantidade -= quantidade;
  await gerEquipSala.save();
  res.status(200).json({ msg: 'Quantidade de equipamento atualizada com sucesso', data: gerEquipSala });
};

const getEquipamentosInSala = async (req, res) => {
  const { salaId } = req.params;
  const equipamentos = await GerEquipSala.find({ salaId });
  res.status(200).json({ msg: 'Equipamentos listados com sucesso', data: equipamentos });
};

const updateEquipamentoInSala = async (req, res) => {
  const { salaId, equipamentoId } = req.params;
  const { quantidade } = req.body;

  if (quantidade < 0) {
    return res.status(400).json({ msg: 'Quantidade deve ser maior ou igual a zero' });
  }

  if (quantidade === 0) {
    await GerEquipSala.findOneAndDelete({ salaId, equipamentoId });
    return res.status(200).json({ msg: 'Equipamento removido da sala com sucesso' });
  }

  const gerEquipSala = await GerEquipSala.findOneAndUpdate(
    { salaId, equipamentoId },
    { quantidade },
    { new: true }
  );

  res.status(200).json({ msg: 'Equipamento atualizado com sucesso', data: gerEquipSala });
};

module.exports = {
  addEquipamentoToSala,
  removeEquipamentoFromSala,
  getEquipamentosInSala,
  updateEquipamentoInSala,
};