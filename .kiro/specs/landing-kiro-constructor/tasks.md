# Tasks · Landing Kiro en modo constructor
**Fase 2 · Lista de Tareas** | Estado: ✅ 100% Completado

---

## TASK-01 · RF-01 — Hero informativo
> Sección superior con identidad visual, datos del evento y CTA.

- [x] `<h1>` con `span.highlight` aplicando gradiente `--purple-light → --neon`
- [x] Badge `⚡ WORKSHOP GRATUITO` con `border: var(--neon)`, color neón y animación `pulseBadge`
- [x] Meta lista con 3 ítems: fecha (Sáb 12 sep 2026), hora (9–11 AM), lugar (UNAB · Salón L51)
- [x] Emojis de meta con `aria-hidden="true"` para lectores de pantalla
- [x] Botón CTA `href="#agenda"` con `aria-label`, clase `.btn-primary`, scroll suave vía `initSmoothScroll()`
- [x] `:focus-visible` en botón CTA con outline neón (RNF-01.1)

**Criterios WCAG:** Contraste texto/fondo verificado (`#ffffff`/`#e2e8f0` sobre `#1a1b2e`). Skip link operativo.

---

## TASK-02 · RF-02 — Contador regresivo
> Widget de tiempo real hacia 2026-09-12T09:00:00-05:00.

- [x] `EVENT_DATE = new Date('2026-09-12T09:00:00-05:00')` — zona horaria Colombia hardcodeada
- [x] `tick()` recursivo con `setTimeout(tick, 1000)`
- [x] `updateDigit()` con clase `.flip` y `scaleY(0.8)` — animación flip por dígito
- [x] Al expirar: `elCountdown.classList.add('hidden')` + mensaje `'🎉 ¡Este evento ya se realizó!'`
- [x] `aria-label` inicial `'Calculando tiempo restante para el evento'` antes del primer tick
- [x] `updateAriaLabel(days, hours, minutes)` ejecutado en primer tick y cada minuto (`seconds === 0`)
- [x] `role="timer"` en `#countdown` + `aria-live="polite"` en `#countdown-ended`

**RNF-02.1:** Solo `.textContent` y `.classList` — sin reflow masivo del DOM.
**RNF-02.2:** Offset ISO `-05:00` garantiza sincronización UTC-5 en cualquier navegador.

---

## TASK-03 · RF-03 — Agenda interactiva con timeline
> 6 bloques expand/collapse con navegación por teclado.

- [x] 6 `<article class="timeline-item">` con `role="listitem"`, `tabindex="0"` y `aria-label` descriptivo
- [x] `aria-expanded="false"` inicializado en todos los bloques al cargar
- [x] `toggleItem(clickedItem)` — colapsa todos, luego expande el clickeado (si no estaba expandido)
- [x] `aria-expanded="true"/"false"` actualizado en cada toggle
- [x] Solo un bloque expandido a la vez
- [x] Navegación `ArrowDown` / `ArrowUp` entre bloques
- [x] Teclas `Enter` y `Space` disparan `toggleItem()`
- [x] Bloque 10:00 (Refrigerio): `.tl-card--snack` + `.tl-dot--special`
- [x] Bloque 10:15 (Flappy Kiro): `.tl-card--star` + `.tl-star-badge` con "★ ESTRELLA" + borde `var(--neon)`

**RNF-03.1:** Área táctil mínima 44×44px garantizada por padding del `.tl-card-inner`.
**RNF-03.2:** Transición `.tl-desc` con `opacity` (GPU compositor) + `max-height` (flujo de espacio). `opacity: 0.7` colapsado → `opacity: 1` expandido.

---

## TASK-04 · RF-04 — Resaltado de bloque activo EN VIVO
> Detección de hora Colombia para resaltado en tiempo real.

- [x] `EVENT_DAY = '2026-09-12'` como constante de guardia de fecha
- [x] `getColombiaTime()` — calcula UTC-5 manualmente: `utc + (-5 * 3600000)`, devuelve `{ dateStr, totalMin }`
- [x] `isActive(sh, sm, eh, em)` — verifica `dateStr === EVENT_DAY` antes de comparar minutos
- [x] `highlightCurrentSlot()` — añade `.tl-item--active` + `aria-current="true"` al bloque activo, limpia los demás
- [x] `setInterval(highlightCurrentSlot, 30000)` — recalculo cada 30s
- [x] **RNF-04.1:** `if (document.hidden) return;` como primera línea de `highlightCurrentSlot()`
- [x] `injectActiveStyles()` inyecta `::before { content: '● EN VIVO' }` + `animation: activePulse` en `<head>`
- [x] Sin bloque activo fuera del 12 sep 2026 9:00–11:15 AM Colombia

---

## TASK-05 · RF-05 — Tarjetas de ponentes
> Grid de ponentes con hover/glow neón y accesibilidad completa.

- [x] Tarjeta Juliana Ramírez A.: `.speaker-card--juliana`, badge `.org-badge--aws`, bio, charla
- [x] Tarjeta José Verbel: `.speaker-card--jose`, badge `.org-badge--community`, bio, charla
- [x] `tabindex="0"` + `aria-label="Ponente [nombre]"` en cada `<article>`
- [x] `cursor: pointer` — indica interactividad
- [x] Hover + `:focus-visible`: `border-color: var(--neon)`, `transform: translateY(-4px)`, `outline: 2px solid var(--neon)`
- [x] `.speaker-glow` — `opacity: 0` base, `opacity: 1` en hover/focus (radial-gradient neón)
- [x] `.speaker-ring` — `border-color: var(--neon)` + `scale(1.05) rotate(10deg)` en hover
- [x] Grid `1fr` base → `1fr 1fr` a `@media (min-width: 768px)`

---

## TASK-06 · RF-06 — Robot pixel art animado
> Ilustración/fallback CSS con animaciones y snippets rotativos.

- [x] `<img id="hero-img">` con `loading="eager"`, `onerror` muestra `#pixel-robot`, `onload` lo oculta
- [x] `.pixel-robot { display: none }` por defecto en CSS — solo visible si la imagen falla
- [x] Animación `robotFloat` (translateY 0 → -12px, 3s loop) en `.pixel-robot`
- [x] Animación `eyeBlink` (scaleY 0.1 al 95%) en `.pr-eye` con `animation-delay: 0.15s` en `.pr-eye-r`
- [x] `initPixelRobot()` — 15 snippets rotativos cada 1.4s: `['_', '{}', '/>', '[]', '=>', '/**', '✓', '🚀', '<>', ';;', 'fn()', '···', '✦', '[]', '#!']`
- [x] **RNF-06.1:** `@media (prefers-reduced-motion: reduce)` desactiva `robotFloat`, `eyeBlink`, blobs, `pulseBadge`, `blinkSep` y transiciones de tarjetas

---

## TASK-07 · RF-07 — Footer con logos enlazados
> Organizadores con URLs reales, nombres oficiales y accesibilidad.

- [x] `<a href="https://bucaratec.com">` → nombre: "BucaraTec"
- [x] `<a href="https://aws.amazon.com">` → nombre: "Amazon Web Services – AWS"
- [x] `<a href="https://unab.edu.co">` → nombre: "Universidad Autónoma de Bucaramanga – UNAB"
- [x] `target="_blank" rel="noopener noreferrer"` en los 3 enlaces (RNF-07.1)
- [x] `aria-label="[Org] — abre en nueva pestaña"` en cada enlace
- [x] Hover + `:focus-visible`: `translateY(-4px) scale(1.05)` + `filter: drop-shadow` neón + `outline: 2px solid var(--neon)`
- [x] `.footer-org-name` cambia a `color: var(--neon)` en hover/focus
- [x] `.footer-logo-fallback` con `display: none` → `display: flex` vía `onerror` si imagen no carga
- [x] Emojis del `.footer-event-info` con `aria-hidden="true"`

---

## TASK-08 · RF-08 — Animaciones IntersectionObserver
> Animaciones de entrada con respeto a preferencias del usuario.

- [x] `initAnimations()` — targets: `.timeline-item, .speaker-card, .section-header, .countdown-wrapper, .footer-organizers`
- [x] Estado inicial por JS: `opacity: 0`, `transform: translateY(24px)`, stagger `0.05s * index`
- [x] Al entrar al viewport: `opacity: 1`, `transform: translateY(0)` + `observer.unobserve()` (una sola vez)
- [x] Guard: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` → early return
- [x] `threshold: 0.12` — dispara cuando el 12% del elemento es visible

**RNF-08.1:** Sin dependencias externas — `IntersectionObserver` nativo del navegador.

---

## TASK-09 · RNF-01/04 — Responsividad y paleta de marca
> Layout funcional de 375px a 1440px con paleta estrictamente variable.

- [x] Base (0–480px): countdown compacto, timeline `56px 20px 1fr`, hero sin overflow
- [x] `@media (min-width: 768px)`: hero 2 columnas, ponentes `1fr 1fr`, countdown `align-self: flex-start`
- [x] `@media (min-width: 1024px)`: hero padding `7rem`, hero-illustration `360px`, speaker-card `2.25rem`
- [x] `@media (min-width: 1440px)`: container `1200px`, `--section-pad: 6rem 2rem`, hero-title `4.25rem`, timeline `840px`
- [x] Paleta 100% en variables `:root` — ningún valor hexadecimal hardcodeado en reglas de estilo
- [x] CSS huérfanos de `.registro` y `.fab` eliminados (~180 líneas)

---

## TASK-10 · RNF-03/05 — Accesibilidad WCAG AA y limpieza final
> Conformidad con WCAG 2.1 nivel AA y código sin deuda técnica.

- [x] `.skip-link` — `top: -100%` base → `top: 0` al recibir `:focus`; visible solo por teclado
- [x] `lang="es"` en `<html>`
- [x] Landmarks: `role="banner"` (hero), `role="main"` (agenda), `role="region"` (ponentes), `role="contentinfo"` (footer)
- [x] `:focus-visible` global: `outline: 2px solid var(--neon)` con `outline-offset: 3px`
- [x] Todos los elementos interactivos con `aria-label` descriptivo
- [x] `role="list"` en `.timeline`, `role="listitem"` en cada bloque
- [x] `role="timer"` en `#countdown`, `aria-live="polite"` en `#countdown-ended`
- [x] `injectActiveStyles()` limpio — sin duplicado `.tl-item--expanded .tl-desc`
- [x] `initSmoothScroll()` con guard `hasAttribute('tabindex')` antes de asignar `-1`
- [x] JS organizado en 6 IIFEs independientes con JSDoc en funciones clave
- [x] Sin código muerto ni referencias a elementos eliminados (registro, FAB)

---

## TASK-11 · Gaps RNF — Correcciones post-auditoría ✅
> Los 3 gaps detectados en el audit de Fase 2 fueron corregidos.

- [x] **RNF-04.1** — `if (document.hidden) return;` en `highlightCurrentSlot()` — evita consumo CPU en pestaña inactiva
- [x] **RNF-03.2** — `opacity: 0.7` (colapsado) → `opacity: 1` (expandido) en `.tl-desc` — `opacity` compuesta en GPU
- [x] **RNF-06.1** — `@media (prefers-reduced-motion: reduce)` cubre `.pixel-robot`, `.pr-eye`, `.pr-eye-l`, `.pr-eye-r`, `.pr-code`, `[class*="pr-"]`, `.blob`, `.badge`, `.countdown-sep`, `.speaker-card`, `.tl-card`, `.footer-logo-item`

---

## Resumen de Estado Final

| Task | RF/RNF | Estado |
|---|---|---|
| TASK-01 | RF-01, RNF-01.x | ✅ |
| TASK-02 | RF-02, RNF-02.x | ✅ |
| TASK-03 | RF-03, RNF-03.x | ✅ |
| TASK-04 | RF-04, RNF-04.1 | ✅ |
| TASK-05 | RF-05, RNF-05.x | ✅ |
| TASK-06 | RF-06, RNF-06.1 | ✅ |
| TASK-07 | RF-07, RNF-07.1 | ✅ |
| TASK-08 | RF-08, RNF-08.1 | ✅ |
| TASK-09 | RNF-01/04 | ✅ |
| TASK-10 | RNF-03/05 | ✅ |
| TASK-11 | Gaps post-auditoría | ✅ |

**Cobertura total: 11/11 tasks · 8 RF · 11 RNF · 100% ✅**

> La Fase 2 queda formalmente cerrada. El proyecto está listo para Fase 3 (despliegue / iteración futura).
