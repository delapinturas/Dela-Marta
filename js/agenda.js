// Agenda do painel - calendario mensal com lembretes salvos no navegador (localStorage).
// Quando houver servidor, e so trocar carregar()/salvar() para falar com ele.

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const NOTAS_KEY = 'agenda-notas';

function carregar() {
  try {
    const dados = JSON.parse(localStorage.getItem(NOTAS_KEY) || '{}');
    return dados && typeof dados === 'object' && !Array.isArray(dados) ? dados : {};
  } catch (e) {
    return {};
  }
}

function salvar(dados) {
  try {
    localStorage.setItem(NOTAS_KEY, JSON.stringify(dados));
    return true;
  } catch (e) {
    return false;
  }
}

function chave(ano, mes, dia) {
  return ano + '-' + String(mes + 1).padStart(2, '0') + '-' + String(dia).padStart(2, '0');
}

function iniciar() {
  const grade = document.getElementById('cal-dias');
  const tituloMes = document.getElementById('mes-titulo');
  const tituloDia = document.getElementById('dia-titulo');
  const lista = document.getElementById('lista-notas');
  const semNotas = document.getElementById('sem-notas');
  const form = document.getElementById('form-nota');
  const campo = document.getElementById('nova-nota');

  const agora = new Date();
  let ano = agora.getFullYear();
  let mes = agora.getMonth();
  let selecionado = chave(ano, mes, agora.getDate());
  let notas = carregar();

  function notasDoDia(k) {
    return Array.isArray(notas[k]) ? notas[k].filter((n) => typeof n === 'string') : [];
  }

  function desenharCalendario() {
    tituloMes.textContent = MESES[mes] + ' ' + ano;
    grade.replaceChildren();

    const primeiro = new Date(ano, mes, 1).getDay();
    const total = new Date(ano, mes + 1, 0).getDate();
    const hojeK = chave(agora.getFullYear(), agora.getMonth(), agora.getDate());

    for (let i = 0; i < primeiro; i++) {
      const v = document.createElement('div');
      v.className = 'cal-dia vazio';
      grade.append(v);
    }
    for (let d = 1; d <= total; d++) {
      const k = chave(ano, mes, d);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cal-dia' + (k === hojeK ? ' hoje' : '') + (k === selecionado ? ' selecionado' : '');
      b.textContent = String(d);
      b.setAttribute('aria-label', d + ' de ' + MESES[mes] + (notasDoDia(k).length ? ', com lembretes' : ''));
      const qtd = notasDoDia(k).length;
      if (qtd) {
        const m = document.createElement('span');
        m.className = 'marca';
        m.textContent = String(qtd);
        b.append(m);
      }
      b.addEventListener('click', () => {
        selecionado = k;
        desenharCalendario();
        desenharNotas();
      });
      grade.append(b);
    }
  }

  function desenharNotas() {
    const [a, m, d] = selecionado.split('-').map(Number);
    tituloDia.textContent = d + ' de ' + MESES[m - 1] + ' de ' + a;
    lista.replaceChildren();
    const itens = notasDoDia(selecionado);
    semNotas.hidden = itens.length > 0;
    itens.forEach((texto, i) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = texto;
      const x = document.createElement('button');
      x.type = 'button';
      x.textContent = '✕';
      x.setAttribute('aria-label', 'Apagar lembrete');
      x.addEventListener('click', () => {
        notas[selecionado] = itens.filter((_, j) => j !== i);
        if (!notas[selecionado].length) delete notas[selecionado];
        salvar(notas);
        desenharCalendario();
        desenharNotas();
      });
      li.append(span, x);
      lista.append(li);
    });
  }

  function mudarMes(delta) {
    mes += delta;
    if (mes < 0) { mes = 11; ano--; }
    if (mes > 11) { mes = 0; ano++; }
    desenharCalendario();
  }

  document.getElementById('mes-ant').addEventListener('click', () => mudarMes(-1));
  document.getElementById('mes-prox').addEventListener('click', () => mudarMes(1));
  document.getElementById('hoje').addEventListener('click', () => {
    ano = agora.getFullYear();
    mes = agora.getMonth();
    selecionado = chave(ano, mes, agora.getDate());
    desenharCalendario();
    desenharNotas();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = campo.value.trim();
    if (!texto) return;
    notas[selecionado] = notasDoDia(selecionado).concat(texto);
    salvar(notas);
    campo.value = '';
    desenharCalendario();
    desenharNotas();
  });

  desenharCalendario();
  desenharNotas();
}
