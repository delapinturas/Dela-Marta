// Pagina adm - o login ainda nao tem servidor; por enquanto so avisa.
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('login-msg').textContent = 'Login ainda não disponível.';
});
