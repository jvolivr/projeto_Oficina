require('dotenv/config');
const path = require('node:path');

const config = {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../database/oficina.sqlite'),
  logging: false,
};

module.exports = { development: config, test: config, production: config };
