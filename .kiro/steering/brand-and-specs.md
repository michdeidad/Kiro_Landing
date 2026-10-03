---

inclusion: always

---

# GUIDELINES Y ESPECIFICACIONES TÉCNICAS DEL PROYECTO

## 1. Identidad Visual y Paleta de Colores Estricta

- **Fondo Principal (Dark Navy):** `#1a1b2e`

- **Acentos y Degradados Púrpuras:** `#4a3f8c` y `#6b5fb5`

- **Color Neón de Destaque (BucaraTec):** `#7aff00` (Usar en botones principales, badges y bordes activos)

- **Texto:** Blanco `#ffffff` e Iris/Gris Claro `#e2e8f0` para legibilidad.

## 2. Arquitectura de Código y Rendimiento

- **Estructura limpia:** Modularizar en `index.html`, `styles.css` y `script.js`.

- **Assets:** Mapear imágenes y logos obligatoriamente desde la carpeta `assets/`.

- **CSS:** Usar Flexbox / CSS Grid, variables CSS (`:root`) para la paleta de colores y garantizando responsividad (Mobile First / Breakpoints en 768px y 1024px).

- **JS:** Código limpio sin librerías pesadas (vanilla JS).

## 3. Reglas de Ejecución Agéntica

- No reinstalar ni proponer frameworks pesados si no se solicitan (mantener Vanilla HTML/CSS/JS).

- Priorizar la optimización de espacio, legibilidad tipográfica y micro-interacciones (hover effects en neón `#7aff00`).
