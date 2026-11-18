import { Ticket } from './index.js';

export default async function detalharTicket(id, transaction) {
  const ticket = await Ticket.findByPk(id, {
    transaction,
    include: ['cliente', 'veiculo', 'atualizacoes', 'orcamento'],
  });
  if (!ticket) return null;

  const { cliente, veiculo, atualizacoes, orcamento } = ticket;
  return {
    id: ticket.id,
    defeito: ticket.defeito,
    status: ticket.status,
    criado_em: ticket.criado_em,
    cliente: { nome: cliente.nome, telefone: cliente.telefone, email: cliente.email },
    veiculo: {
      modelo: veiculo.modelo, tipo: veiculo.tipo, placa: veiculo.placa,
      marca: veiculo.marca, ano: veiculo.ano,
    },
    atualizacoes: atualizacoes.map(item => ({
      id: item.id, descricao: item.descricao, valorServico: item.valor_servico,
    })),
    orcamento: orcamento && {
      id: orcamento.id, valorTotal: orcamento.valor_total, status: orcamento.status,
    },
  };
}
