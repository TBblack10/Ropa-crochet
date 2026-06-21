/* ============================================================
   PUNTO TIERRA — módulo de autenticación simulada (front-end)
   ⚠️ Esto es un MOCK para prototipado: las contraseñas se guardan
   en localStorage sin cifrar. No usar tal cual en producción —
   reemplazar por un backend real (auth + base de datos) antes de
   manejar usuarios de verdad.
   Expone window.PTAuth
   ============================================================ */
(function (global) {
  'use strict';

  var USERS_KEY = 'puntotierra_users';
  var SESSION_KEY = 'puntotierra_session';

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (e) {
      return null;
    }
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    document.dispatchEvent(new CustomEvent('ptauth:change', { detail: { user: user } }));
  }

  function isLoggedIn() {
    return !!getSession();
  }

  function register(name, email, password) {
    email = (email || '').trim().toLowerCase();
    var users = getUsers();
    if (users.some(function (u) { return u.email === email; })) {
      return { ok: false, error: 'Ya existe una cuenta con ese email.' };
    }
    var user = { name: name.trim(), email: email, password: password, provider: 'email' };
    users.push(user);
    saveUsers(users);
    setSession({ name: user.name, email: user.email, provider: 'email' });
    return { ok: true };
  }

  function login(email, password) {
    email = (email || '').trim().toLowerCase();
    var users = getUsers();
    var user = users.find(function (u) { return u.email === email; });
    if (!user || user.password !== password) {
      return { ok: false, error: 'Email o contraseña incorrectos.' };
    }
    setSession({ name: user.name, email: user.email, provider: 'email' });
    return { ok: true };
  }

  function loginWithGoogle() {
    var demo = {
      name: 'Cliente Google',
      email: 'cliente.demo@gmail.com',
      provider: 'google'
    };
    var users = getUsers();
    if (!users.some(function (u) { return u.email === demo.email; })) {
      users.push({ name: demo.name, email: demo.email, password: null, provider: 'google' });
      saveUsers(users);
    }
    setSession(demo);
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    document.dispatchEvent(new CustomEvent('ptauth:change', { detail: { user: null } }));
  }

  global.PTAuth = {
    getSession: getSession,
    isLoggedIn: isLoggedIn,
    register: register,
    login: login,
    loginWithGoogle: loginWithGoogle,
    logout: logout
  };
})(window);
