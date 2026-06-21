/* ============================================================
   PUNTO TIERRA — módulo de carrito (compartido entre páginas)
   Expone window.PTCart
   ============================================================ */
(function (global) {
  'use strict';

  var CART_KEY = 'puntotierra_cart';
  var PROMO_KEY = 'puntotierra_promo';
  var VALID_PROMOS = { TIERRA20: { label: 'TIERRA20', percent: 20 } };

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    document.dispatchEvent(new CustomEvent('ptcart:change', { detail: { cart: cart } }));
  }

  function addItem(name, price, qty) {
    qty = qty || 1;
    var cart = getCart();
    var existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ name: name, price: Number(price) || 0, qty: qty });
    }
    saveCart(cart);
    return cart;
  }

  function setQty(name, qty) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.name === name; });
    if (!item) return cart;
    item.qty = Math.max(1, qty);
    saveCart(cart);
    return cart;
  }

  function removeItem(name) {
    var cart = getCart().filter(function (i) { return i.name !== name; });
    saveCart(cart);
    return cart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getCount() {
    return getCart().reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  function getSubtotal() {
    return getCart().reduce(function (sum, item) { return sum + item.qty * item.price; }, 0);
  }

  /* ---- Promos ---- */
  function getAppliedPromo() {
    var code = localStorage.getItem(PROMO_KEY);
    return code && VALID_PROMOS[code] ? VALID_PROMOS[code] : null;
  }

  function applyPromo(code) {
    code = (code || '').trim().toUpperCase();
    if (VALID_PROMOS[code]) {
      localStorage.setItem(PROMO_KEY, code);
      document.dispatchEvent(new CustomEvent('ptcart:change', { detail: { cart: getCart() } }));
      return VALID_PROMOS[code];
    }
    return null;
  }

  function clearPromo() {
    localStorage.removeItem(PROMO_KEY);
    document.dispatchEvent(new CustomEvent('ptcart:change', { detail: { cart: getCart() } }));
  }

  function getShipping(subtotal) {
    if (subtotal === 0) return 0;
    return subtotal >= 8000 ? 0 : 1200;
  }

  function getTotals() {
    var subtotal = getSubtotal();
    var promo = getAppliedPromo();
    var discount = promo ? Math.round(subtotal * (promo.percent / 100)) : 0;
    var shipping = getShipping(subtotal - discount);
    var total = subtotal - discount + shipping;
    return { subtotal: subtotal, discount: discount, shipping: shipping, total: total, promo: promo };
  }

  function formatPrice(value) {
    return '$' + Math.round(value).toLocaleString('es-AR');
  }

  global.PTCart = {
    getCart: getCart,
    addItem: addItem,
    setQty: setQty,
    removeItem: removeItem,
    clearCart: clearCart,
    getCount: getCount,
    getSubtotal: getSubtotal,
    getTotals: getTotals,
    applyPromo: applyPromo,
    clearPromo: clearPromo,
    getAppliedPromo: getAppliedPromo,
    formatPrice: formatPrice
  };
})(window);
