// Painel - so abre para quem fez login; senao volta para a tela de login.
if (!estaLogado()) {
  location.replace('pagina.html');
} else {
  document.body.hidden = false;
}

document.getElementById('sair').addEventListener('click', () => {
  try {
    sessionStorage.removeItem(AUTH_KEY);
  } catch (e) {}
  location.href = 'pagina.html';
});
