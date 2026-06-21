/* ============================================================
   PUNTO TIERRA — pedidos.html
   ============================================================ */
(function () {
  'use strict';

  var content = document.getElementById('ordersContent');
  var session = PTAuth.getSession();

  if (!session) {
    content.innerHTML =
      '<div class="orders-empty">' +
        '<p>Iniciá sesión para ver el historial de tus pedidos.</p>' +
        '<a href="login.html?redirect=pedidos.html" class="btn btn-terracotta">Iniciar sesión</a>' +
      '</div>';
    return;
  }

  var orders = PTOrders.getOrdersForEmail(session.email);

  if (orders.length === 0) {
    content.innerHTML =
      '<div class="orders-empty">' +
        '<p>Todavía no hiciste ningún pedido, ' + session.name.split(' ')[0] + '.</p>' +
        '<a href="index.html#productos" class="btn btn-terracotta">Ver productos</a>' +
      '</div>';
    return;
  }

  content.innerHTML = orders.map(function (order) {
    var itemsSummary = order.items.map(function (i) { return i.qty + '× ' + i.name; }).join(' · ');
    var date = new Date(order.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    return (
      '<article class="order-card">' +
        '<div class="order-card-head">' +
          '<div><strong>Pedido ' + order.id + '</strong><small>' + date + '</small></div>' +
          '<span class="order-status">' + order.status + '</span>' +
        '</div>' +
        '<p class="order-card-items">' + itemsSummary + '</p>' +
        '<div class="order-card-total"><span>Total</span><span>' + PTCart.formatPrice(order.total) + '</span></div>' +
      '</article>'
    );
  }).join('');
})();
