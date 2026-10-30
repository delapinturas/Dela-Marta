// Pagina adm - confere usuario e senha e abre o painel.
if (estaLogado()) {
  location.replace('painel.html');
}

const form = document.getElementById('login-form');
const msg = document.getElementById('login-msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value;

  let hash = '';
  try {
    hash = await hashCredenciais(usuario, senha);
  } catch (erro) {
    msg.textContent = 'Não foi possível verificar o login neste navegador.';
    return;
  }

  if (hash === AUTH_HASH) {
    try {
      sessionStorage.setItem(AUTH_KEY, AUTH_HASH);
    } catch (erro) {
      msg.textContent = 'Ative o armazenamento do navegador para entrar.';
      return;
    }
    location.href = 'painel.html';
  } else {
    msg.textContent = 'Usuário ou senha incorretos.';
    document.getElementById('senha').value = '';
  }
});
