import express from 'express';
import { fileURLToPath } from 'node:url';
import { ValidationError } from 'sequelize';
import { sequelize } from './core/sequelize.js';
import api from './routes/api.js';
import web from './routes/web.js';

const app = express();
app.set('view engine', 'ejs');
app.set('views', fileURLToPath(new URL('./views/', import.meta.url)));
app.use(express.static(fileURLToPath(new URL('./public/', import.meta.url))));
app.use(express.json());
app.use(web);
app.use(api);
app.use((erro, req, res, next) => {
  if (res.headersSent) return next(erro);
  const codigo = erro.original?.code;
  if (erro instanceof ValidationError || codigo === 'SQLITE_CONSTRAINT' || erro.status === 400) {
    return res.status(400).json({ erro: erro.message });
  }
  console.error(erro.message);
  res.status(500).json({ erro: 'Erro interno ao processar o ticket.' });
});

const porta = Number(process.env.PORT) || 3002;
await sequelize.authenticate();
app.listen(porta, () => console.log('Oficina em http://localhost:' + porta));
