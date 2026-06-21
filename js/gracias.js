/* ============================================================
   PUNTO TIERRA — gracias.html
   ============================================================ */
(function () {
  'use strict';

  var card = document.getElementById('confirmCard');
  var params = new URLSearchParams(window.location.search);
  var orderId = params.get('order');
  var order = orderId ? PTOrders.getOrder(orderId) : null;

  if (!order) {
    card.innerHTML =
      '<h1>No encontramos ese pedido</h1>' +
      '<p>Puede que el enlace haya expirado o el pedido ya no esté disponible en este navegador.</p>' +
      '<div class="confirm-actions"><a href="index.html" class="btn btn-terracotta">Volver a la tienda</a></div>';
    return;
  }

  var itemsHtml = order.items.map(function (item) {
    return '<div class="order-summary-item"><span>' + item.qty + '× ' + item.name + '</span><strong>' + PTCart.formatPrice(item.price * item.qty) + '</strong></div>';
  }).join('');

  card.innerHTML =
    '<div class="confirm-icon">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
    '</div>' +
    '<h1>¡Gracias por tu compra, ' + order.customer.name.split(' ')[0] + '!</h1>' +
    '<p>Tu pedido fue confirmado y ya lo estamos preparando con mucho cariño.</p>' +
    '<span class="confirm-order-id">Pedido ' + order.id + '</span>' +
    '<div class="order-summary-items" style="text-align:left; margin-bottom:18px;">' + itemsHtml + '</div>' +
    '<div class="order-summary-totals" style="text-align:left;">' +
      '<div><span>Envío a</span><strong>' + order.customer.address + ', ' + order.customer.city + '</strong></div>' +
      '<div><span>Pago</span><strong>' + paymentLabel(order.payment) + '</strong></div>' +
      '<div class="grand-total"><span>Total pagado</span><span>' + PTCart.formatPrice(order.total) + '</span></div>' +
    '</div>' +
    '<div class="confirm-actions">' +
      '<a href="index.html" class="btn btn-outline">Seguir comprando</a>' +
      '<a href="pedidos.html" class="btn btn-terracotta">Ver mis pedidos</a>' +
    '</div>';

  function paymentLabel(value) {
    return { tarjeta: 'Tarjeta de crédito/débito', transferencia: 'Transferencia bancaria', efectivo: 'Efectivo al recibir' }[value] || value;
  }
})();
