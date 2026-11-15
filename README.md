# GameRadar CO — Premium

Versión mejorada del prototipo académico GameRadar CO, construida con React 18 y Vite 6.

## Requisitos
- Node.js 18 o superior
- npm

## Ejecutar en local

1. Descomprime el proyecto.
2. Abre una terminal dentro de la carpeta `gameradar-co-premium`.
3. Instala dependencias:

```bash
npm install
```

4. Inicia el servidor:

```bash
npm run dev
```

5. Abre la dirección que indique Vite (normalmente `http://localhost:5173`).

## Mejoras incluidas
- Estética premium oscura con detalles violeta y lima.
- Radar animado, puntos luminosos y microinteracciones.
- Tarjetas con hover, brillo y transiciones.
- Animaciones de modales, paneles y notificaciones.
- Historial real de juegos visitados, guardado en `localStorage`.
- Atajo `Ctrl + K` / `⌘ + K` para enfocar el buscador.
- Tecla `Esc` para cerrar ventanas modales.
- Favoritos con confirmación visual.
- Comparación de precio ajustada a la plataforma seleccionada.
- Estadísticas de catálogo calculadas automáticamente.
- Corrección del valor inicial sugerido al crear una alerta.
- Favicon propio de GameRadar CO.
- Respeto por la preferencia de movimiento reducido del sistema.

## Alcance de los datos
Los precios, descuentos y gráficos siguen siendo ilustrativos/sintéticos. No se consultan tiendas en tiempo real, no se envían notificaciones externas y no existen convenios comerciales activos. El historial añadido registra los videojuegos que el usuario abre en este navegador; no representa un histórico real de cotizaciones.
