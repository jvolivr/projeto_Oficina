import { DataTypes } from 'sequelize';
import { sequelize } from '../core/sequelize.js';

export default sequelize.define('Veiculo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  modelo: { type: DataTypes.TEXT, allowNull: false },
  tipo: { type: DataTypes.TEXT, allowNull: false },
  placa: DataTypes.TEXT,
  marca: DataTypes.TEXT,
  ano: { type: DataTypes.INTEGER, validate: { isInt: true } },
  cliente_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'veiculos' });
