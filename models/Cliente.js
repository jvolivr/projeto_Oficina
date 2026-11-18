import { DataTypes } from 'sequelize';
import { sequelize } from '../core/sequelize.js';

export default sequelize.define('Cliente', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.TEXT, allowNull: false },
  telefone: { type: DataTypes.TEXT, allowNull: false },
  email: DataTypes.TEXT,
}, { tableName: 'clientes' });
