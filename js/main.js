/* Dela Marta Pinturas — comportamento da página
   1) Menu do celular   2) Portfólio e filtro   3) Formulário via WhatsApp   4) Contatos */

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


/* ---------- 2) Portfólio (fotos reais de js/config.js) e filtro ---------- */
const CFG = window.SITE || {};
const gallery = document.getElementById('gallery');
const galleryNote = document.getElementById('galleryNote');
const NOMES_TIPO = { interna: 'Pintura interna', externa: 'Pintura externa', acabamento: 'Acabamentos' };

function el(tag, attrs = {}, texto) {
  const e = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (texto) e.textContent = texto;
  return e;
}

function figura(src, legenda, titulo) {
  const f = el('figure', { class: 'shot' });
  f.append(el('img', { src, alt: titulo + (legenda ? ' — ' + legenda : ''), loading: 'lazy' }));
  f.append(el('figcaption', {}, legenda));
  return f;
}

if (Array.isArray(CFG.projetos) && CFG.projetos.length) {
  gallery.replaceChildren(...CFG.projetos.map((p) => {
    const card = el('article', { class: 'project', 'data-type': p.tipo });
    const fotos = el('div', { class: 'photos' + (p.antes ? ' pair' : '') });
    if (p.antes) fotos.append(figura(p.antes, 'Antes', p.titulo));
    fotos.append(figura(p.depois, p.antes ? 'Depois' : '', p.titulo));
    const corpo = el('div', { class: 'project-body' });
    corpo.append(el('h3', {}, p.titulo), el('p', {}, NOMES_TIPO[p.tipo] || ''));
    card.append(fotos, corpo);
    return card;
  }));
} else {
  galleryNote.hidden = false;
}

const filtros = document.querySelectorAll('.filter');
filtros.forEach((botao) => {
  botao.addEventListener('click', () => {
    const escolhido = botao.dataset.filter;
    filtros.forEach((b) => {
      b.classList.toggle('selected', b === botao);
      b.setAttribute('aria-pressed', String(b === botao));
    });
    gallery.querySelectorAll('.project').forEach((card) => {
      card.hidden = escolhido !== 'todos' && card.dataset.type !== escolhido;
    });
  });
});


/* ---------- 3) Formulário de orçamento via WhatsApp ---------- */
const form = document.getElementById('quoteForm');
const generated = document.getElementById('generated');
const generatedTitle = document.getElementById('generatedTitle');
const generatedNote = document.getElementById('generatedNote');
const preview = document.getElementById('messagePreview');
const copyBtn = document.getElementById('copy');
const numero = String(CFG.whatsapp || '').replace(/\D/g, '');

const wa = el('a', { class: 'copy wa', target: '_blank', rel: 'noopener', hidden: '' }, 'Abrir WhatsApp ↗');
copyBtn.after(wa);

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

  const mensagem = montarMensagem({
    nome: document.getElementById('name').value.trim(),
    local: document.getElementById('city').value.trim(),
    servico: document.getElementById('service').value,
    detalhes: document.getElementById('details').value.trim()
  });
  preview.value = mensagem;
  copyBtn.textContent = 'Copiar mensagem';

  if (numero) {
    generatedTitle.textContent = 'Abrindo o WhatsApp…';
    generatedNote.textContent = 'Se não abrir, toque em "Abrir WhatsApp" ou copie a mensagem.';
    wa.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensagem);
    wa.hidden = false;
    window.open(wa.href, '_blank', 'noopener');
  } else {
    generatedTitle.textContent = 'Mensagem preparada:';
    generatedNote.textContent = 'O WhatsApp da empresa ainda não foi configurado. Copie a mensagem e envie à equipe.';
    wa.hidden = true;
  }

  generated.classList.add('visible');
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


/* ---------- 4) Contatos, ano do rodapé e rótulo do botão ---------- */
const links = document.getElementById('contactLinks');
const itens = [];
if (numero) itens.push(['WhatsApp', 'https://wa.me/' + numero, 'Chamar no WhatsApp']);
if (CFG.instagram) itens.push(['Instagram', 'https://instagram.com/' + encodeURIComponent(CFG.instagram), '@' + CFG.instagram]);
if (CFG.telefone) {
  const digitos = CFG.telefone.replace(/\D/g, '');
  itens.push(['Telefone', 'tel:+' + (digitos.startsWith('55') ? digitos : '55' + digitos), CFG.telefone]);
}
if (CFG.email) itens.push(['E-mail', 'mailto:' + CFG.email, CFG.email]);
itens.forEach(([nome, href, texto]) => {
  const a = el('a', { href, rel: 'noopener' });
  if (href.startsWith('http')) a.target = '_blank';
  a.append(el('small', {}, nome), el('strong', {}, texto));
  links.append(a);
});
if (CFG.regiao) links.append(el('p', { class: 'region' }, CFG.regiao));

document.getElementById('year').textContent = new Date().getFullYear();
if (!numero) document.getElementById('submitBtn').textContent = 'Preparar mensagem de orçamento ↗';
