import { DataTypes } from 'sequelize';
import { sequelize } from '../core/sequelize.js';

export default sequelize.define('Ticket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  defeito: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'RECEBIDO' },
  criado_em: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
  veiculo_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'tickets' });
