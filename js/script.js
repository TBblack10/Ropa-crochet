/* ============================================================
   PUNTO TIERRA — interactividad de la página principal
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Año del footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2200);
  }

  /* ---------- Agregar al carrito (usa PTCart) ---------- */
  document.querySelectorAll('.add-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var name = btn.getAttribute('data-name') || 'Producto';
      var price = btn.getAttribute('data-price') || 0;

      if (window.PTCart) {
        PTCart.addItem(name, price, 1);
        showToast('"' + name + '" agregado al carrito');
        if (window.PTHeader) PTHeader.openCartDrawer();
      }

      // micro-interacción
      btn.style.transform = 'scale(0.85)';
      setTimeout(function () { btn.style.transform = ''; }, 140);
    });
  });

  /* ---------- Favoritos (wishlist) ---------- */
  document.querySelectorAll('.wish-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var active = btn.classList.toggle('is-active');
      btn.textContent = active ? '♥' : '♡';
      btn.setAttribute('aria-label', active ? 'Quitar de favoritos' : 'Agregar a favoritos');
    });
  });

  /* ---------- Filtros de productos ---------- */
  var filterPills = document.querySelectorAll('.filter-pill');
  var productCards = document.querySelectorAll('.product-card');
  var emptyState = document.getElementById('emptyState');

  function applyFilter(filter) {
    var visibleCount = 0;
    productCards.forEach(function (card) {
      var categories = (card.getAttribute('data-category') || '').split(' ');
      var matches = filter === 'todos' || categories.indexOf(filter) !== -1;
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });
    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  filterPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      filterPills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      applyFilter(pill.getAttribute('data-filter'));
    });
  });

  /* ---------- Copiar código de descuento ---------- */
  var copyBtn = document.getElementById('copyCodeBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var code = 'TIERRA20';
      var fallback = function () {
        var temp = document.createElement('textarea');
        temp.value = code;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        try { document.execCommand('copy'); } catch (err) { /* noop */ }
        document.body.removeChild(temp);
      };

      var onCopied = function () {
        var original = copyBtn.innerHTML;
        copyBtn.innerHTML = '¡Copiado!';
        if (window.PTCart) PTCart.applyPromo(code);
        showToast('Código TIERRA20 aplicado a tu carrito');
        setTimeout(function () { copyBtn.innerHTML = original; }, 1800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(onCopied, function () {
          fallback();
          onCopied();
        });
      } else {
        fallback();
        onCopied();
      }
    });
  }

  /* ---------- Menú móvil ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Resaltar link activo según scroll ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.mainnav a');

  function onScrollSpy() {
    var scrollPos = window.scrollY + 140;
    var current = '';
    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

  /* ---------- Búsqueda ---------- */
  var searchForm = document.getElementById('searchForm');
  var searchInput = document.getElementById('searchInput');

  function runSearch(query) {
    query = (query || '').trim().toLowerCase();
    if (!query) return;

    var found = false;
    productCards.forEach(function (card) {
      var text = card.textContent.toLowerCase();
      var matches = text.indexOf(query) !== -1;
      card.style.display = matches ? '' : 'none';
      if (matches) found = true;
    });

    filterPills.forEach(function (p) { p.classList.remove('active'); });
    if (emptyState) emptyState.hidden = found;

    var productosSection = document.getElementById('productos');
    if (productosSection) productosSection.scrollIntoView({ behavior: 'smooth' });
  }

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      runSearch(searchInput.value);
    });
  }

  /* Si llegamos desde otra página con ?q=..., aplicamos la búsqueda */
  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q');
  if (initialQuery) {
    if (searchInput) searchInput.value = initialQuery;
    runSearch(initialQuery);
  }

})();
