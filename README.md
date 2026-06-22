# 🧶 Tejiendo Sueños

Landing page de e-commerce para **Tejiendo Sueños**, tejidos artesanales hechos a mano en Buenos Aires. Sitio estático (HTML + CSS + JS vanilla, sin frameworks ni build step) listo para correr local, subir a GitHub y publicar.

## Estructura del proyecto

```
punto-tierra/
├── index.html           # Página principal (todas las secciones del diseño)
├── login.html            # Iniciar sesión / crear cuenta
├── checkout.html         # Datos de envío, pago y resumen del pedido
├── gracias.html           # Confirmación de compra
├── pedidos.html           # Historial de pedidos del usuario logueado
├── css/
│   └── style.css        # Estilos (paleta boho, responsive)
├── js/
│   ├── cart.js           # Módulo de carrito (localStorage)
│   ├── auth.js            # Módulo de autenticación simulada (localStorage)
│   ├── orders.js          # Módulo de pedidos (localStorage)
│   ├── header.js          # Drawer de carrito + dropdown de cuenta (todas las páginas)
│   ├── script.js          # Interactividad de la home (filtros, búsqueda, menú, etc.)
│   ├── login.js, checkout.js, gracias.js, pedidos.js   # Lógica de cada página
├── assets/               # Para imágenes propias que quieras sumar
├── package.json          # Scripts opcionales para servidor local
├── .gitignore
└── README.md
```

## Funcionalidad incluida

- 🛍️ **Carrito** en panel deslizable (drawer), con +/− cantidad, quitar ítems y subtotal en vivo, persistido en `localStorage`.
- 👤 **Login / registro simulado** (email+contraseña o botón "Continuar con Google" simulado). Sin backend: ideal para probar el flujo completo ya mismo.
- 🧾 **Checkout completo**: datos de envío, método de pago (sin cobro real todavía), aplicar código de descuento, resumen con subtotal/descuento/envío/total.
- ✅ **Confirmación de compra** con número de pedido.
- 📦 **Historial de pedidos** ("Mis pedidos") vinculado a la cuenta logueada.
- 🧵 **Filtros de productos** por categoría (Vestidos, Sacos, Tops, Accesorios, En oferta).
- 🔍 **Buscador** que filtra productos por texto (funciona también desde otras páginas, redirigiendo a la home con el resultado).
- 📋 **Copiar y aplicar código de descuento** (TIERRA20 = 20% off) desde la home o el checkout.
- 📱 **Menú responsive** con hamburguesa en mobile.
- 🧭 **Scroll-spy**: resalta la sección activa en el nav al scrollear.

> ⚠️ **Nota importante:** el login y los pedidos son una *simulación front-end* pensada para probar el flujo de principio a fin. Los usuarios y contraseñas se guardan sin cifrar en el `localStorage` del navegador — **no uses esto tal cual con datos reales de clientes**. Antes de publicar en serio, hay que reemplazar `auth.js` por un backend de autenticación real (por ejemplo Firebase Auth, Supabase Auth o un servidor propio) y conectar `checkout.js` a una pasarela de pago real (Mercado Pago, Stripe, etc.).

## Cómo verlo en tu computadora

No necesitás instalar nada para abrirlo: alcanza con abrir `index.html` en el navegador. Pero para que el `fetch`/rutas funcionen igual que en producción, lo ideal es levantar un servidor local:

### Opción A — con Node (recomendado)
```bash
npm install -g serve
npm start
# o directamente: npx serve .
```
Abrí **http://localhost:3000**

### Opción B — con Python (si no tenés Node)
```bash
python3 -m http.server 3000
```

## Subirlo a GitHub

```bash
cd tejiendo-sueños
git init
git add .
git commit -m "Primer commit: landing Punto Tierra"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/tejiendo-sueños.git
git push -u origin main
```

> Reemplazá `TU_USUARIO` por tu usuario de GitHub. Si todavía no creaste el repo, hacelo primero desde github.com → **New repository** (sin agregar README, para evitar conflictos).

## Publicarlo (GitHub Pages — gratis)

1. En tu repo de GitHub, andá a **Settings → Pages**.
2. En **Source**, elegí la rama `main` y la carpeta `/ (root)`.
3. Guardá. En 1-2 minutos tu sitio va a estar disponible en:
   ```
   https://TU_USUARIO.github.io/punto-tierra/
   ```

### Alternativas de hosting
- **Netlify**: arrastrá la carpeta `punto-tierra` a [app.netlify.com/drop](https://app.netlify.com/drop), o conectá el repo de GitHub para deploy automático en cada push.
- **Vercel**: `npx vercel` desde la carpeta del proyecto.

## Próximos pasos sugeridos

- Reemplazar las ilustraciones SVG de las prendas por fotos reales en `assets/` y actualizar los `<svg>` por `<img>`.
- Conectar el botón "Comprar ahora" / carrito a una pasarela de pago real (Mercado Pago, Stripe, etc.) o a un checkout.
- Agregar más productos editando el bloque `.product-grid` en `index.html` (cada `<article class="product-card">` es independiente).
- Sumar Google Analytics / Meta Pixel antes de publicar si vas a hacer marketing.

---
Hecho a mano, con amor 🌿
