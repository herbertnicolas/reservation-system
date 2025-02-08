const express = require('express');
const Equipamento = require('../../models/Equipamento');

class EquipamentosController {
  constructor(router) {
    this.prefix = '/equipamentos';
    this.router = router;
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(this.prefix, (req, res) => {console.log("CHEGOU NO /EQUIPAMENTOS"); this.getEquipamentos(req, res)});
    this.router.get(`${this.prefix}/:equipamentoId`, (req, res) => this.getEquipamento(req, res));
    this.router.put(`${this.prefix}/:equipamentoId`, (req, res) => this.reservarEquipamento(req, res));
    this.router.post(this.prefix, (req, res) => {console.log("criando EQUIPAMENTO"); this.criarEquipamento(req, res)});
  }

  async getEquipamentos(req, res) {
    try {
      const equipamentos = await Equipamento.find();
      return res.status(200).json({
        msg: 'Equipamentos listados com sucesso',
        data: equipamentos,
      });
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro ao listar equipamentos',
        error: err.message,
      });
    }
  }

  async getEquipamento(req, res) {
    try {
      const equipamento = await Equipamento.findById(req.params.equipamentoId);

      if (!equipamento) {
        return res.status(404).json({
          msg: 'Equipamento não encontrado',
        });
      }

      return res.status(200).json({
        msg: 'Equipamento encontrado com sucesso',
        data: equipamento,
      });
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro ao buscar equipamento',
        error: err.message,
      });
    }
  }

  async reservarEquipamento(req, res) {
    try {
      const equipamento = await Equipamento.findById(req.params.equipamentoId);

      if (!equipamento) {
        return res.status(404).json({
          msg: 'Equipamento não encontrado',
        });
      }

      const { datasReservas } = req.body;
      if (!datasReservas) {
        return res.status(400).json({
          msg: 'Data para reserva não fornecida',
        });
      }

      if (equipamento.datasReservas.includes(datasReservas)) {
        return res.status(400).json({
          msg: 'Equipamento indisponível para esta data',
        });
      }

      equipamento.datasReservas.push(datasReservas);
      await equipamento.save();

      return res.status(200).json({
        msg: 'Equipamento reservado com sucesso',
        data: equipamento,
      });
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro ao reservar equipamento',
        error: err.message,
      });
    }
  }

  async criarEquipamento(req, res) {
    try {
      const { nome, disponibilidade } = req.body;

      const equipamento = new Equipamento({
        nome,
        disponibilidade,
      });

      await equipamento.save();

      return res.status(201).json({
        msg: 'Equipamento criado com sucesso',
        data: equipamento,
      });
    } catch (err) {
      return res.status(500).json({
        msg: 'Erro ao criar equipamento',
        error: err.message,
      });
    }
  }
}

module.exports = EquipamentosController;