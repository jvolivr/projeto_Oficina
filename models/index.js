import Cliente from './Cliente.js';
import Veiculo from './Veiculo.js';
import Ticket from './Ticket.js';
import Atualizacao from './Atualizacao.js';
import Orcamento from './Orcamento.js';

Cliente.hasMany(Veiculo, { foreignKey: 'cliente_id', onDelete: 'NO ACTION' });
Veiculo.belongsTo(Cliente, { foreignKey: 'cliente_id', onDelete: 'NO ACTION' });

Ticket.belongsTo(Cliente, { as: 'cliente', foreignKey: 'cliente_id', onDelete: 'NO ACTION' });
Ticket.belongsTo(Veiculo, { as: 'veiculo', foreignKey: 'veiculo_id', onDelete: 'NO ACTION' });

Ticket.hasMany(Atualizacao, { as: 'atualizacoes', foreignKey: 'ticket_id', onDelete: 'CASCADE' });
Atualizacao.belongsTo(Ticket, { foreignKey: 'ticket_id' });

Ticket.hasOne(Orcamento, { as: 'orcamento', foreignKey: 'ticket_id', onDelete: 'CASCADE' });
Orcamento.belongsTo(Ticket, { foreignKey: 'ticket_id' });

export { Cliente, Veiculo, Ticket, Atualizacao, Orcamento };
