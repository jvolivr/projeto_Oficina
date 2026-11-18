import { Router } from 'express';
import * as tickets from '../controllers/api/TicketsController.js';

const router = Router();
// No Express 4, encaminhe a rejeição do controller ao middleware de erros.
const rota = controller => (req, res, next) => controller(req, res).catch(next);

router.get('/tickets', rota(tickets.listar));
router.post('/tickets', rota(tickets.criar));
router.get('/tickets/:id', rota(tickets.buscar));
router.put('/tickets/:id', rota(tickets.atualizar));
router.delete('/tickets/:id', rota(tickets.excluir));

export default router;
