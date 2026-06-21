/* ============================================================
   PUNTO TIERRA — login.html
   ============================================================ */
(function () {
  'use strict';

  var tabLogin = document.getElementById('tabLogin');
  var tabRegister = document.getElementById('tabRegister');
  var loginForm = document.getElementById('loginForm');
  var registerForm = document.getElementById('registerForm');
  var authError = document.getElementById('authError');

  function showTab(which) {
    var isLogin = which === 'login';
    tabLogin.classList.toggle('active', isLogin);
    tabRegister.classList.toggle('active', !isLogin);
    tabLogin.setAttribute('aria-selected', String(isLogin));
    tabRegister.setAttribute('aria-selected', String(!isLogin));
    loginForm.hidden = !isLogin;
    registerForm.hidden = isLogin;
    authError.hidden = true;
  }

  tabLogin.addEventListener('click', function () { showTab('login'); });
  tabRegister.addEventListener('click', function () { showTab('register'); });

  function showError(message) {
    authError.textContent = message;
    authError.hidden = false;
  }

  function redirectAfterAuth() {
    var params = new URLSearchParams(window.location.search);
    var redirect = params.get('redirect');
    window.location.href = redirect ? redirect : 'index.html';
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;
    var result = PTAuth.login(email, password);
    if (!result.ok) { showError(result.error); return; }
    redirectAfterAuth();
  });

  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('registerName').value;
    var email = document.getElementById('registerEmail').value;
    var password = document.getElementById('registerPassword').value;
    var result = PTAuth.register(name, email, password);
    if (!result.ok) { showError(result.error); return; }
    redirectAfterAuth();
  });

  document.getElementById('googleBtn').addEventListener('click', function () {
    PTAuth.loginWithGoogle();
    redirectAfterAuth();
  });

  /* Si ya hay sesión activa, no tiene sentido mostrar el login */
  if (PTAuth.isLoggedIn()) {
    redirectAfterAuth();
  }
})();
