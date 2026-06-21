/* ============================================================
   PUNTO TIERRA — header compartido: cuenta + carrito (drawer)
   Requiere que cart.js y auth.js estén cargados antes.
   ============================================================ */
(function () {
  'use strict';

  if (!window.PTCart || !window.PTAuth) return;

  /* ---------------- Badge del carrito ---------------- */
  function updateCartBadge() {
    var badge = document.getElementById('cartBadge');
    if (!badge) return;
    var count = PTCart.getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  /* ---------------- Dropdown de cuenta ---------------- */
  var accountBtn = document.getElementById('accountBtn');
  var accountDropdown = document.getElementById('accountDropdown');

  function renderAccountDropdown() {
    if (!accountDropdown) return;
    var session = PTAuth.getSession();

    if (session) {
      var initials = session.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      accountDropdown.innerHTML =
        '<div class="account-dropdown-head">' +
          '<span class="account-avatar">' + initials + '</span>' +
          '<span><strong>' + session.name + '</strong><small>' + session.email + '</small></span>' +
        '</div>' +
        '<a href="pedidos.html" class="account-dropdown-link">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M6 7v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>' +
          'Mis pedidos' +
        '</a>' +
        '<button class="account-dropdown-link account-dropdown-logout" id="logoutBtn">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>' +
          'Cerrar sesión' +
        '</button>';

      var logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
          PTAuth.logout();
          closeAccountDropdown();
        });
      }
    } else {
      accountDropdown.innerHTML =
        '<div class="account-dropdown-guest">' +
          '<p>Iniciá sesión para guardar tu carrito y ver tus pedidos.</p>' +
          '<a href="login.html" class="btn btn-terracotta account-dropdown-cta">Iniciar sesión</a>' +
        '</div>';
    }
  }

  function openAccountDropdown() {
    if (!accountDropdown) return;
    renderAccountDropdown();
    accountDropdown.hidden = false;
    accountBtn.setAttribute('aria-expanded', 'true');
  }
  function closeAccountDropdown() {
    if (!accountDropdown) return;
    accountDropdown.hidden = true;
    accountBtn.setAttribute('aria-expanded', 'false');
  }

  if (accountBtn) {
    accountBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (accountDropdown.hidden) openAccountDropdown(); else closeAccountDropdown();
    });
    document.addEventListener('click', function (e) {
      if (!accountDropdown.hidden && !accountDropdown.contains(e.target) && e.target !== accountBtn) {
        closeAccountDropdown();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAccountDropdown();
    });
  }

  /* ---------------- Drawer del carrito ---------------- */
  var cartBtn = document.getElementById('cartBtn');
  var cartDrawer = document.getElementById('cartDrawer');
  var cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  var cartDrawerClose = document.getElementById('cartDrawerClose');
  var cartDrawerItems = document.getElementById('cartDrawerItems');
  var cartDrawerFooter = document.getElementById('cartDrawerFooter');
  var cartDrawerSubtotal = document.getElementById('cartDrawerSubtotal');

  function renderCartDrawer() {
    if (!cartDrawerItems) return;
    var cart = PTCart.getCart();

    if (cart.length === 0) {
      cartDrawerItems.innerHTML = '<p class="cart-drawer-empty">Tu carrito está vacío. ¡Sumá alguna prenda tejida con amor! 🌿</p>';
      if (cartDrawerFooter) cartDrawerFooter.hidden = true;
      return;
    }

    cartDrawerItems.innerHTML = cart.map(function (item) {
      return (
        '<div class="cart-drawer-item" data-name="' + escapeHtml(item.name) + '">' +
          '<div class="cart-drawer-item-info">' +
            '<strong>' + escapeHtml(item.name) + '</strong>' +
            '<span>' + PTCart.formatPrice(item.price) + '</span>' +
          '</div>' +
          '<div class="cart-drawer-item-qty">' +
            '<button class="qty-btn" data-action="dec" aria-label="Restar uno">−</button>' +
            '<span>' + item.qty + '</span>' +
            '<button class="qty-btn" data-action="inc" aria-label="Sumar uno">+</button>' +
          '</div>' +
          '<button class="cart-drawer-remove" data-action="remove" aria-label="Quitar ' + escapeHtml(item.name) + '">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6"/></svg>' +
          '</button>' +
        '</div>'
      );
    }).join('');

    if (cartDrawerFooter) {
      cartDrawerFooter.hidden = false;
      cartDrawerSubtotal.textContent = PTCart.formatPrice(PTCart.getSubtotal());
    }
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (cartDrawerItems) {
    cartDrawerItems.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var itemEl = e.target.closest('.cart-drawer-item');
      if (!itemEl) return;
      var name = itemEl.getAttribute('data-name');
      var cart = PTCart.getCart();
      var item = cart.find(function (i) { return i.name === name; });
      if (!item) return;

      var action = btn.getAttribute('data-action');
      if (action === 'inc') PTCart.setQty(name, item.qty + 1);
      if (action === 'dec') {
        if (item.qty <= 1) PTCart.removeItem(name); else PTCart.setQty(name, item.qty - 1);
      }
      if (action === 'remove') PTCart.removeItem(name);
    });
  }

  function openCartDrawer() {
    if (!cartDrawer) return;
    renderCartDrawer();
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
  if (cartDrawerOverlay) cartDrawerOverlay.addEventListener('click', closeCartDrawer);
  if (cartDrawerClose) cartDrawerClose.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeCartDrawer();
  });

  /* ---------------- Reactividad a cambios ---------------- */
  document.addEventListener('ptcart:change', function () {
    updateCartBadge();
    renderCartDrawer();
  });
  document.addEventListener('ptauth:change', function () {
    renderAccountDropdown();
  });

  /* ---------------- Init ---------------- */
  updateCartBadge();

  /* Exponer helpers por si otras páginas los necesitan */
  window.PTHeader = {
    openCartDrawer: openCartDrawer,
    closeCartDrawer: closeCartDrawer,
    renderCartDrawer: renderCartDrawer,
    updateCartBadge: updateCartBadge
  };
})();
