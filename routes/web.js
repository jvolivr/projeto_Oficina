import { Router } from 'express';
import { abrirOficina } from '../controllers/TicketsController.js';

const router = Router();
router.get('/', abrirOficina);
export default router;
