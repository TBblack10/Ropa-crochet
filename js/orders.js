/* ============================================================
   PUNTO TIERRA — módulo de pedidos (localStorage)
   Expone window.PTOrders
   ============================================================ */
(function (global) {
  'use strict';

  var ORDERS_KEY = 'puntotierra_orders';

  function getOrders() {
    try {
      return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }

  function createOrder(data) {
    var orders = getOrders();
    var id = 'PT-' + Date.now().toString().slice(-8);
    var order = {
      id: id,
      date: new Date().toISOString(),
      items: data.items,
      subtotal: data.subtotal,
      discount: data.discount,
      shipping: data.shipping,
      total: data.total,
      customer: data.customer,
      payment: data.payment,
      status: 'Confirmado'
    };
    orders.unshift(order);
    saveOrders(orders);
    return order;
  }

  function getOrder(id) {
    return getOrders().find(function (o) { return o.id === id; }) || null;
  }

  function getOrdersForEmail(email) {
    email = (email || '').toLowerCase();
    return getOrders().filter(function (o) { return (o.customer.email || '').toLowerCase() === email; });
  }

  global.PTOrders = {
    getOrders: getOrders,
    createOrder: createOrder,
    getOrder: getOrder,
    getOrdersForEmail: getOrdersForEmail
  };
})(window);
