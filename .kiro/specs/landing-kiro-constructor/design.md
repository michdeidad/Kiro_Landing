# Design · Landing Kiro en modo constructor
**Fase 2 · Diseño Técnico** | Estado: ✅ Cerrado

---

## 1. Arquitectura de Archivos

```
Ziro webb/
├── index.html          # SPA semántica: Hero, Agenda, Ponentes, Footer
├── styles.css          # Estilos globales: variables :root, mobile-first, breakpoints
├── script.js           # Lógica Vanilla JS: 6 IIFEs independientes
│
├── assets/
│   ├── hero-illustration.png   # Ilustración pixel art (hero principal)
│   ├── logo-aws.png            # Logo AWS User Group Bucaramanga
│   ├── logo-bucaratec.png      # Logo BucaraTec
│   ├── logo-unab.png           # Logo UNAB TEC
│   └── manifest.json           # Manifiesto de assets
│
└── .kiro/
    ├── steering/
    │   └── brand-and-specs.md  # Guía de marca y reglas del proyecto
    └── specs/
        └── landing-kiro-constructor/
            ├── requirements.md  # RF-01–RF-08 + RNF (congelado)
            ├── design.md        # ← este archivo
            └── tasks.md         # Checklist de implementación
```

---

## 2. Paleta de Colores · Variables CSS `:root`

Toda la paleta se gestiona exclusivamente mediante variables en `:root`. Ningún valor de color aparece hardcodeado en reglas de estilo.

| Variable CSS | Valor | Uso |
|---|---|---|
| `--bg-primary` | `#1a1b2e` | Fondo principal (dark navy) |
| `--bg-secondary` | `#12131f` | Fondo secciones alternas |
| `--bg-card` | `#1e2040` | Fondo de tarjetas |
| `--bg-card-hover` | `#252750` | Estado hover de tarjetas |
| `--purple-deep` | `#4a3f8c` | Acento púrpura profundo |
| `--purple-mid` | `#6b5fb5` | Acento púrpura medio |
| `--purple-light` | `#8b7fd4` | Acento púrpura claro |
| `--neon` | `#7aff00` | Neón BucaraTec — destaque principal |
| `--neon-dim` | `rgba(122,255,0,0.15)` | Neón translúcido (fondos de badge) |
| `--neon-glow` | `rgba(122,255,0,0.4)` | Neón para box-shadow/glow |
| `--text-white` | `#ffffff` | Títulos y texto primario |
| `--text-light` | `#e2e8f0` | Texto de cuerpo |
| `--text-muted` | `#a0aec0` | Texto secundario / metadatos |
| `--border-subtle` | `rgba(107,95,181,0.25)` | Bordes sutiles |
| `--border-neon` | `rgba(122,255,0,0.35)` | Bordes activos neón |

---

## 3. Tipografías

| Familia | Uso | Pesos |
|---|---|---|
| Space Grotesk | Cuerpo, títulos, UI general | 300, 400, 500, 600, 700 |
| Space Mono | Badges, contadores, código, etiquetas técnicas | 400, 700 |

Cargadas vía Google Fonts con `rel="preconnect"` para optimizar LCP.

---

## 4. Sistema de Breakpoints (Mobile-First)

| Breakpoint | Ancho | Cambios de layout |
|---|---|---|
| Base | 0–479px | Columna única; countdown compacto; timeline reducido |
| Mobile compacto | `max-width: 480px` | Countdown-num 1.5rem; timeline-item 56px 20px 1fr |
| Tablet | `min-width: 768px` | Hero 2 columnas; ponentes grid 2×1; timeline 88px 32px 1fr |
| Desktop | `min-width: 1024px` | Espaciado ampliado; hero-illustration 360px |
| Wide | `min-width: 1440px` | Container 1200px; hero-title 4.25rem; timeline 840px |

---

## 5. Módulos JavaScript (IIFEs)

Cada módulo es una IIFE autocontenida con JSDoc. No comparten estado global excepto `EVENT_DATE`.

| IIFE | RF/RNF | Responsabilidad |
|---|---|---|
| `initCountdown()` | RF-02, RNF-02.x | Contador regresivo UTC-5, flip animation, aria-label dinámico, mensaje post-evento |
| `initAgenda()` | RF-03, RF-04, RNF-03.x, RNF-04.1 | Expand/collapse con `toggleItem()`, resaltado EN VIVO con `getColombiaTime()`, guard `document.hidden`, ArrowUp/Down navigation |
| `initAnimations()` | RF-08, RNF-08.1 | IntersectionObserver con stagger 0.05s, guard `prefers-reduced-motion` |
| `initPixelRobot()` | RF-06, RNF-06.1 | 15 snippets rotativos cada 1.4s en pantalla del robot |
| `initSmoothScroll()` | RNF-03 | Scroll suave a anchors internos, foco accesible al destino |
| `injectActiveStyles()` | RF-04 | Inyección de estilos dinámicos para `.tl-item--active` (evita conflictos de especificidad con `.tl-card--star`) |

---

## 6. Estructura HTML Semántica

```
<body>
  <a class="skip-link">           ← RNF-03: accesibilidad teclado
  <section role="banner">         ← Hero (landmark)
  <section role="main">           ← Agenda (landmark principal)
  <section role="region">         ← Ponentes (landmark)
  <footer role="contentinfo">     ← Footer
```

Roles ARIA usados en elementos dinámicos:
- `role="timer"` + `aria-label` dinámico → contador regresivo
- `aria-live="polite"` → mensaje post-evento
- `aria-expanded` → bloques de agenda (actualizado por JS)
- `aria-current="true"` → bloque activo EN VIVO
- `aria-hidden="true"` → elementos decorativos (emojis, blobs, pixel grid)

---

## 7. Estrategia de Fallback — Robot Pixel Art

```
img[onerror] → oculta imagen → muestra #pixel-robot (CSS/HTML)
img[onload]  → oculta #pixel-robot (si la imagen carga correctamente)
```

El robot CSS inicia con `display: none` y solo se activa vía JS desde el atributo `onerror` del `<img>`.

---

## 8. Decisiones de Diseño Clave

| Decisión | Justificación |
|---|---|
| Sin frameworks CSS/JS | Máxima portabilidad, cero dependencias, menor surface de ataque |
| `document.hidden` guard en setInterval | RNF-04.1: evita consumo de CPU en pestañas inactivas |
| `opacity` + `max-height` en expand/collapse | RNF-03.2: `opacity` se compone en GPU; `max-height` gestiona el flujo de espacio |
| `@media prefers-reduced-motion` en CSS | RNF-06.1: desactiva `robotFloat`, `eyeBlink`, blobs, badge pulse y transiciones de tarjetas |
| `injectActiveStyles()` como IIFE separada | Evita conflictos de especificidad CSS con `.tl-card--star` que tiene `border-color: var(--neon)` hardcodeado |
| Zona horaria UTC-5 con offset ISO string | Compatibilidad universal: no depende de la zona horaria del navegador del visitante |
| `rel="noopener noreferrer"` en todos los enlaces externos | RNF-07.1: mitigación de tabnabbing |
