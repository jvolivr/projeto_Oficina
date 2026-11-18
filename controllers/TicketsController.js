import statusTicket from '../models/statusTicket.js';

export function abrirOficina(req, res) {
  res.render('oficina', { statusTicket });
}
