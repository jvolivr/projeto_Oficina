const el = id => document.getElementById(id);
const form = el('formulario');
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let ticketId = null;
let valoresIniciais = {};

async function api(caminho, metodo = 'GET', dados) {
  const resposta = await fetch(caminho, {
    method: metodo,
    headers: dados ? { 'Content-Type': 'application/json' } : {},
    body: dados ? JSON.stringify(dados) : undefined,
  });
  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => null);
    throw new Error(erro?.erro || 'A operação falhou (' + resposta.status + ').');
  }
  if (resposta.status !== 204) return resposta.json();
}

function mostrarErro(erro) {
  el('mensagem').textContent = erro.message;
}

async function listar() {
  const tickets = await api('/tickets');
  const lista = el('lista');
  lista.replaceChildren();
  if (!tickets.length) lista.textContent = 'Nenhum ticket cadastrado.';
  for (const ticket of tickets) {
    const botao = document.createElement('button');
    botao.className = 'linha';
    for (const [tag, valor] of [['strong', '#' + ticket.id], ['span', ticket.defeito], ['small', ticket.status.replaceAll('_', ' ')]]) {
      const campo = document.createElement(tag);
      campo.textContent = valor;
      botao.append(campo);
    }
    botao.onclick = async () => {
      try { abrir(await api('/tickets/' + ticket.id)); } catch (erro) { mostrarErro(erro); }
    };
    lista.append(botao);
  }
}

function abrir(ticket) {
  form.reset();
  ticketId = ticket?.id ?? null;
  el('mensagem').textContent = '';
  el('titulo').textContent = ticket ? 'Ticket #' + ticket.id : 'Novo ticket';
  el('campo-status').hidden = !ticket;
  el('excluir').hidden = !ticket;
  el('historico').hidden = !ticket;
  if (ticket) {
    const dados = { ...ticket.cliente, ...ticket.veiculo, defeito: ticket.defeito, status: ticket.status };
    for (const [nome, valor] of Object.entries(dados)) form.elements[nome].value = valor ?? '';
    const itens = ticket.atualizacoes.map(atualizacao => {
      const item = document.createElement('li');
      item.textContent = atualizacao.descricao;
      if (atualizacao.valorServico != null) item.textContent += ' · ' + moeda.format(atualizacao.valorServico);
      return item;
    });
    el('atualizacoes').replaceChildren(...itens);
    if (!itens.length) el('atualizacoes').textContent = 'Nenhuma atualização.';
    const orcamento = ticket.orcamento;
    el('orcamento').textContent = orcamento ? moeda.format(orcamento.valorTotal) + ' · ' + orcamento.status : 'Sem orçamento.';
  }
  valoresIniciais = Object.fromEntries(new FormData(form));
  el('painel').hidden = false;
  form.elements.nome.focus();
}

function fechar() {
  el('painel').hidden = true;
  ticketId = null;
  el('novo').focus();
}

el('novo').onclick = () => abrir(null);
el('fechar').onclick = fechar;
form.onsubmit = async evento => {
  evento.preventDefault();
  const dados = Object.fromEntries(new FormData(form));
  const corpo = {
    cliente: { nome: dados.nome, telefone: dados.telefone, email: dados.email },
    veiculo: { modelo: dados.modelo, tipo: dados.tipo, placa: dados.placa, marca: dados.marca, ano: dados.ano || null },
    defeito: dados.defeito,
  };
  if (ticketId) {
    corpo.status = dados.status;
    // Campos opcionais intactos devem manter o valor original do banco, inclusive NULL.
    for (const grupo of [corpo.cliente, corpo.veiculo]) {
      for (const campo of Object.keys(grupo)) {
        if (dados[campo] === valoresIniciais[campo]) delete grupo[campo];
      }
    }
  }
  const botao = evento.submitter;
  botao.disabled = true;
  try {
    const ticket = ticketId ? await api('/tickets/' + ticketId, 'PUT', corpo) : await api('/tickets', 'POST', corpo);
    abrir(ticket);
    el('mensagem').textContent = 'Ticket salvo.';
    await listar();
  } catch (erro) { mostrarErro(erro); }
  finally { botao.disabled = false; }
};

el('excluir').onclick = async () => {
  if (!window.confirm('Excluir este ticket, seu cliente, veículo, atualizações e orçamento?')) return;
  try {
    await api('/tickets/' + ticketId, 'DELETE');
    fechar();
    el('mensagem').textContent = 'Ticket excluído.';
    await listar();
  } catch (erro) { mostrarErro(erro); }
};

listar().catch(mostrarErro);
