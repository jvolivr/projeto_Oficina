import { DataTypes } from 'sequelize';
import { sequelize } from '../core/sequelize.js';

export default sequelize.define('Atualizacao', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descricao: { type: DataTypes.TEXT, allowNull: false },
  valor_servico: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  ticket_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'atualizacoes' });
