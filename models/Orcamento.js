import { DataTypes } from 'sequelize';
import { sequelize } from '../core/sequelize.js';

export default sequelize.define('Orcamento', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  valor_total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  status: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'PENDENTE' },
  ticket_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
}, { tableName: 'orcamentos' });
