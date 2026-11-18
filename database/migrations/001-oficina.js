const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  async up(queryInterface) {
    const sql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
    const db = queryInterface.sequelize;
    await db.transaction(async transaction => {
      // O driver SQLite executa uma instrução por chamada.
      for (const comando of sql.split(';').map(parte => parte.trim()).filter(Boolean)) {
        await db.query(comando, { transaction });
      }
    });
  },

  async down() {
    throw new Error('A migração inicial pode abranger tabelas preexistentes. Reversão manual necessária.');
  },
};
