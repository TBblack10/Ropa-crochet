/* ============================================================
   PUNTO TIERRA — checkout.html
   ============================================================ */
(function () {
  'use strict';

  var cart = PTCart.getCart();
  var checkoutEmpty = document.getElementById('checkoutEmpty');
  var checkoutContent = document.getElementById('checkoutContent');

  if (cart.length === 0) {
    checkoutEmpty.hidden = false;
    checkoutContent.hidden = true;
    return;
  }

  /* ---------- Prefill si hay sesión ---------- */
  var session = PTAuth.getSession();
  if (session) {
    document.getElementById('custName').value = session.name || '';
    document.getElementById('custEmail').value = session.email || '';
  }

  /* ---------- Resumen del pedido ---------- */
  var itemsEl = document.getElementById('orderSummaryItems');
  var sumSubtotal = document.getElementById('sumSubtotal');
  var sumDiscountRow = document.getElementById('sumDiscountRow');
  var sumDiscount = document.getElementById('sumDiscount');
  var sumShipping = document.getElementById('sumShipping');
  var sumTotal = document.getElementById('sumTotal');

  function renderSummary() {
    cart = PTCart.getCart();
    itemsEl.innerHTML = cart.map(function (item) {
      return '<div class="order-summary-item"><span>' + item.qty + '× ' + escapeHtml(item.name) + '</span><strong>' + PTCart.formatPrice(item.price * item.qty) + '</strong></div>';
    }).join('');

    var totals = PTCart.getTotals();
    sumSubtotal.textContent = PTCart.formatPrice(totals.subtotal);
    if (totals.discount > 0) {
      sumDiscountRow.hidden = false;
      sumDiscount.textContent = '-' + PTCart.formatPrice(totals.discount);
    } else {
      sumDiscountRow.hidden = true;
    }
    sumShipping.textContent = totals.shipping === 0 ? 'Gratis' : PTCart.formatPrice(totals.shipping);
    sumTotal.textContent = PTCart.formatPrice(totals.total);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  renderSummary();

  /* ---------- Código de descuento ---------- */
  var promoInput = document.getElementById('promoInput');
  var promoApplyBtn = document.getElementById('promoApplyBtn');
  var promoFeedback = document.getElementById('promoFeedback');

  var existingPromo = PTCart.getAppliedPromo();
  if (existingPromo) promoInput.value = existingPromo.label;

  promoApplyBtn.addEventListener('click', function () {
    var result = PTCart.applyPromo(promoInput.value);
    promoFeedback.hidden = false;
    if (result) {
      promoFeedback.textContent = '¡Código aplicado! ' + result.percent + '% de descuento.';
      promoFeedback.className = 'promo-feedback is-success';
    } else {
      promoFeedback.textContent = 'Ese código no es válido.';
      promoFeedback.className = 'promo-feedback is-error';
    }
    renderSummary();
  });

  /* ---------- Método de pago ---------- */
  var paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(function (opt) {
    opt.addEventListener('click', function () {
      paymentOptions.forEach(function (o) { o.classList.remove('is-selected'); });
      opt.classList.add('is-selected');
      opt.querySelector('input').checked = true;
    });
  });

  /* ---------- Confirmar pedido ---------- */
  var form = document.getElementById('checkoutForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var totals = PTCart.getTotals();
    var paymentEl = form.querySelector('input[name="payment"]:checked');

    var order = PTOrders.createOrder({
      items: PTCart.getCart(),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      payment: paymentEl ? paymentEl.value : 'tarjeta',
      customer: {
        name: document.getElementById('custName').value,
        email: document.getElementById('custEmail').value,
        phone: document.getElementById('custPhone').value,
        address: document.getElementById('custAddress').value,
        city: document.getElementById('custCity').value,
        zip: document.getElementById('custZip').value
      }
    });

    PTCart.clearCart();
    PTCart.clearPromo();

    window.location.href = 'gracias.html?order=' + encodeURIComponent(order.id);
  });

})();
