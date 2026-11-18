import { Sequelize, Transaction } from 'sequelize';
import config from '../config/database.cjs';

export const sequelize = new Sequelize({
  ...config.development,
  transactionType: Transaction.TYPES.IMMEDIATE,
  define: { timestamps: false },
});
