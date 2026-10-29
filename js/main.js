/* Dela Marta Pinturas — comportamento da página
   1) Menu do celular   2) Filtro do portfólio   3) Formulário de orçamento */

/* ---------- 1) Menu do celular ---------- */
const menuBtn = document.getElementById('menu');
const nav = document.getElementById('navigation');

function setMenu(aberto) {
  menuBtn.setAttribute('aria-expanded', String(aberto));
  menuBtn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  menuBtn.textContent = aberto ? '✕' : '☰';
  nav.classList.toggle('open', aberto);
}

menuBtn.addEventListener('click', () => {
  setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
});

// Fecha o menu ao tocar em um link
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});


/* ---------- 2) Filtro do portfólio ---------- */
const filtros = document.querySelectorAll('.filter');
const projetos = document.querySelectorAll('.project');

filtros.forEach((botao) => {
  botao.addEventListener('click', () => {
    const escolhido = botao.dataset.filter;

    filtros.forEach((b) => {
      b.classList.toggle('selected', b === botao);
      b.setAttribute('aria-pressed', String(b === botao));
    });

    projetos.forEach((card) => {
      card.hidden = escolhido !== 'todos' && card.dataset.type !== escolhido;
    });
  });
});


/* ---------- 3) Formulário de orçamento ---------- */
const form = document.getElementById('quoteForm');
const generated = document.getElementById('generated');
const preview = document.getElementById('messagePreview');
const copyBtn = document.getElementById('copy');

function montarMensagem({ nome, local, servico, detalhes }) {
  return [
    'Olá, Dela Marta Pinturas! Gostaria de solicitar um orçamento.',
    '',
    'Nome: ' + nome,
    'Serviço: ' + servico,
    ...(local ? ['Local: ' + local] : []),
    ...(detalhes ? ['Detalhes: ' + detalhes] : []),
    '',
    'Podemos conversar?'
  ].join('\n');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  preview.value = montarMensagem({
    nome: document.getElementById('name').value.trim(),
    local: document.getElementById('city').value.trim(),
    servico: document.getElementById('service').value,
    detalhes: document.getElementById('details').value.trim()
  });

  generated.classList.add('visible');
  copyBtn.textContent = 'Copiar mensagem';
  generated.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

copyBtn.addEventListener('click', async () => {
  try {
    if (!navigator.clipboard) throw new Error('clipboard indisponível');
    await navigator.clipboard.writeText(preview.value);
    copyBtn.textContent = 'Copiado ✓';
  } catch (erro) {
    // Plano B: seleciona o texto para a pessoa copiar manualmente
    preview.focus();
    preview.select();
    copyBtn.textContent = 'Selecione e copie o texto';
  }
});
