# Oficina MVC com SQLite

Extraia o ZIP, abra a pasta que contém package.json e execute no terminal do VS Code com Node 24.19 ou superior da série 24:

```powershell
npm ci
npm start
```

Abra http://localhost:3002 para usar a tela. A API responde em /tickets e /tickets/:id. Na primeira execução, o Sequelize prepara as tabelas em database/oficina.sqlite. Nas próximas, reutiliza o mesmo arquivo. Para guardar os cadastros, conserve esse arquivo ao mover o projeto.

O .env é opcional. Para trocar a porta, copie .env.example para .env e ajuste PORT. O caminho do banco fica em config/database.cjs.

## Organização

O Express recebe as requisições em routes/. Os controllers em controllers/api/ chamam os models do Sequelize. A página em views/oficina.ejs usa public/js/oficina.js para listar, criar, consultar, editar e excluir tickets. Os detalhes incluem cliente, veículo, atualizações e orçamento.

O comando npm start executa a migração antes de iniciar server.js. Para executá-la isoladamente, use npm run db:migrate.
