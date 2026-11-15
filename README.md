# GameRadar CO

Aplicación web académica para comparar precios de videojuegos en pesos colombianos.

## Requisitos
- Node.js 18 o superior
- npm

## Ejecutar en local

1. Descomprime el proyecto.
2. Abre una terminal dentro de la carpeta `gameradar-co-react`.
3. Instala dependencias:

```bash
npm install
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

5. Abre la dirección local que indique Vite (normalmente `http://localhost:5173`).

## Compilar para producción

```bash
npm run build
npm run preview
```

## Funcionalidades
- Catálogo de 36 videojuegos.
- Búsqueda por nombre.
- Filtros por plataforma, género, precio máximo y ofertas.
- Ordenamiento por precio, descuento y nombre.
- Comparación de precios por tienda en ficha de cada juego.
- Favoritos persistentes en `localStorage`.
- Alertas locales de precio objetivo.
- Filtro por presupuesto.
- Puntaje Radar ilustrativo.
- Vista de historial con gráfico de demostración.
- Página Acerca con posibles modelos de negocio.

## Estructura

- `src/data.js`: catálogo y generación de precios ilustrativos.
- `src/App.jsx`: interfaz, navegación y lógica de interacción.
- `src/styles.css`: diseño responsive dark.
- `src/main.jsx`: punto de entrada de React.

## Importante: alcance de la demostración

Los precios y descuentos son **datos sintéticos de demostración**. No son precios actuales, no se consultan tiendas en tiempo real y no existen convenios comerciales activos. Las alertas se almacenan únicamente en el navegador y no envían notificaciones.

Para convertir el prototipo en un servicio comercial se necesitaría integrar fuentes autorizadas de precios (API, feed o acuerdos con tiendas), un backend y una base de datos. Una futura versión podría usar Supabase para autenticación y persistencia multiusuario.

## Modelo de negocio propuesto
1. Comisiones de afiliación por compras originadas desde enlaces autorizados.
2. Publicidad claramente identificada y separada de los resultados orgánicos.
3. Suscripción premium para alertas avanzadas e historial extendido.

Este proyecto no procesa pagos ni realiza ventas.
