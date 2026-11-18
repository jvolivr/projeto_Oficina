import { sequelize } from '../../core/sequelize.js';
import { Cliente, Veiculo, Ticket } from '../../models/index.js';
import detalharTicket from '../../models/detalharTicket.js';
import statusTicket from '../../models/statusTicket.js';

export async function listar(req, res) {
  const tickets = await Ticket.findAll({
    attributes: ['id', 'defeito', 'status', 'criado_em'],
    order: [['id', 'ASC']],
  });
  res.json(tickets);
}

export async function buscar(req, res) {
  const ticket = await detalharTicket(req.params.id);
  if (!ticket) return res.status(404).json({ erro: 'Não encontrado' });
  res.json(ticket);
}

export async function criar(req, res) {
  const { cliente, veiculo, defeito } = req.body;
  if (!cliente?.nome || !cliente?.telefone || !veiculo?.modelo || !veiculo?.tipo || !defeito) {
    return res.status(400).json({ erro: 'Cliente, veículo e defeito obrigatórios' });
  }

  const novo = await sequelize.transaction(async transaction => {
    const dono = await Cliente.create({
      nome: cliente.nome, telefone: cliente.telefone, email: cliente.email || null,
    }, { transaction });
    const carro = await Veiculo.create({
      cliente_id: dono.id, modelo: veiculo.modelo, tipo: veiculo.tipo,
      placa: veiculo.placa || null, marca: veiculo.marca || null, ano: veiculo.ano || null,
    }, { transaction });
    const ticket = await Ticket.create({ cliente_id: dono.id, veiculo_id: carro.id, defeito }, { transaction });
    return detalharTicket(ticket.id, transaction);
  });
  res.status(201).json(novo);
}

function camposInformados(dados, campos) {
  return Object.fromEntries(campos.filter(campo => dados?.[campo] != null)
    .map(campo => [campo, dados[campo]]));
}

export async function atualizar(req, res) {
  const dados = req.body;
  const resultado = await sequelize.transaction(async transaction => {
    const ticket = await Ticket.findByPk(req.params.id, { transaction });
    if (!ticket) return { codigo: 404, corpo: { erro: 'Não encontrado' } };
    if (dados.status != null && !statusTicket.includes(dados.status)) {
      return { codigo: 400, corpo: { erro: 'Status inválido' } };
    }
    await ticket.update(camposInformados(dados, ['defeito', 'status']), { transaction });
    if (dados.cliente) {
      await Cliente.update(camposInformados(dados.cliente, ['nome', 'telefone', 'email']), {
        where: { id: ticket.cliente_id }, transaction,
      });
    }
    if (dados.veiculo) {
      await Veiculo.update(camposInformados(dados.veiculo, ['modelo', 'tipo', 'placa', 'marca', 'ano']), {
        where: { id: ticket.veiculo_id }, transaction,
      });
    }
    return { codigo: 200, corpo: await detalharTicket(ticket.id, transaction) };
  });
  res.status(resultado.codigo).json(resultado.corpo);
}

export async function excluir(req, res) {
  const excluido = await sequelize.transaction(async transaction => {
    const ticket = await Ticket.findByPk(req.params.id, { transaction });
    if (!ticket) return false;
    await ticket.destroy({ transaction });
    await Veiculo.destroy({ where: { id: ticket.veiculo_id }, transaction });
    await Cliente.destroy({ where: { id: ticket.cliente_id }, transaction });
    return true;
  });
  res.status(excluido ? 204 : 404).end();
}
