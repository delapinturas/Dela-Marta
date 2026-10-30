// Login simples da area adm. Barreira basica: nao protege informacao sensivel,
// porque o site e estatico e tudo roda no navegador.
// Guardamos so o hash (SHA-256) de usuario + senha, nao os valores em texto.
const AUTH_HASH = '3243e68519722359c90779b2808181bf9b97b6e748291a9b1cd36f8b1f7e3df3';
const AUTH_KEY = 'adm-sessao';

async function hashCredenciais(usuario, senha) {
  const dados = new TextEncoder().encode('delamarta-adm|' + usuario + '|' + senha);
  const buf = await crypto.subtle.digest('SHA-256', dados);
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('');
}

function estaLogado() {
  try {
    return sessionStorage.getItem(AUTH_KEY) === AUTH_HASH;
  } catch (e) {
    return false;
  }
}
