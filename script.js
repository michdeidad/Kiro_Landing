/* =====================================================
   KIRO EN MODO CONSTRUCTOR · script.js
   Vanilla JS — sin dependencias externas
   RF-02: Contador regresivo UTC-5 con flip animation
   RF-03: Agenda expand/collapse + teclado
   RF-04: Resaltado EN VIVO hora Colombia
   RF-06: Pixel robot snippets rotativos
   RF-08: IntersectionObserver + prefers-reduced-motion
   ===================================================== */

'use strict';

/* ── Fecha objetivo del evento ──────────────────────── */
// 12 de septiembre de 2026, 9:00 AM — hora Colombia UTC-5
const EVENT_DATE = new Date('2026-09-12T09:00:00-05:00');

/* ══════════════════════════════════════════════════════
   RF-02 · CONTADOR REGRESIVO
   Target: 2026-09-12T09:00:00-05:00
   - Actualización cada 1s con setTimeout recursivo
   - Animación flip en cada dígito al cambiar
   - Al expirar: oculta .countdown, muestra mensaje
   - aria-label dinámico cada minuto para screen readers
   ══════════════════════════════════════════════════════ */
(function initCountdown() {
  const elDays      = document.getElementById('cd-days');
  const elHours     = document.getElementById('cd-hours');
  const elMinutes   = document.getElementById('cd-minutes');
  const elSeconds   = document.getElementById('cd-seconds');
  const elCountdown = document.getElementById('countdown');
  const elEnded     = document.getElementById('countdown-ended');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  /**
   * Formatea un número a dos dígitos.
   * @param {number} n
   * @returns {string}
   */
  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  /**
   * Actualiza un dígito con animación flip si el valor cambia.
   * @param {HTMLElement} el
   * @param {string} newValue
   */
  function updateDigit(el, newValue) {
    if (el.textContent === newValue) return;
    el.classList.add('flip');
    setTimeout(() => {
      el.textContent = newValue;
      el.classList.remove('flip');
    }, 80);
  }

  /** Actualiza el aria-label del timer para screen readers. */
  function updateAriaLabel(days, hours, minutes) {
    elCountdown.setAttribute(
      'aria-label',
      `Faltan ${days} días, ${hours} horas y ${minutes} minutos para el evento`
    );
  }

  function tick() {
    const now  = Date.now();
    const diff = EVENT_DATE.getTime() - now;

    if (diff <= 0) {
      // Evento ya se realizó — ocultar contador, mostrar mensaje
      elCountdown.classList.add('hidden');
      elEnded.classList.remove('hidden');
      elEnded.textContent = '🎉 ¡Este evento ya se realizó!';
      return; // detener el tick
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days    = Math.floor(totalSeconds / 86400);
    const hours   = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    updateDigit(elDays,    pad(days));
    updateDigit(elHours,   pad(hours));
    updateDigit(elMinutes, pad(minutes));
    updateDigit(elSeconds, pad(seconds));

    // Actualizar aria-label cada minuto (cuando segundos == 0) y en el primer tick
    if (seconds === 0 || elCountdown.getAttribute('aria-label') === null) {
      updateAriaLabel(days, hours, minutes);
    }

    setTimeout(tick, 1000);
  }

  // Establecer aria-label inicial antes del primer tick
  elCountdown.setAttribute('aria-label', 'Calculando tiempo restante para el evento');
  tick();
})();

/* ══════════════════════════════════════════════════════
   RF-03 · AGENDA INTERACTIVA
   - 6 bloques timeline con expand/collapse
   - Solo un bloque expandido a la vez
   - Navegación por teclado: Enter / Space
   - aria-expanded actualizado en cada interacción
   RF-04 · RESALTADO EN VIVO
   - isActive() con hora Colombia UTC-5
   - Recalculo cada 30s con setInterval
   - aria-current en bloque activo
   ══════════════════════════════════════════════════════ */
(function initAgenda() {
  /**
   * Slots de la agenda mapeados a .timeline-item por índice.
   * Horas en UTC-5 (Colombia). Solo activos el 12 sep 2026.
   */
  const EVENT_DAY = '2026-09-12'; // fecha del evento (Colombia)

  const slots = [
    { label: 'Bienvenida',  start: [9,  0],  end: [9,  15] },
    { label: 'Vibecoding',  start: [9,  15], end: [9,  45] },
    { label: 'Demo Kiro',   start: [9,  45], end: [10,  0] },
    { label: 'Refrigerio',  start: [10,  0], end: [10, 15] },
    { label: 'Flappy Kiro', start: [10, 15], end: [11,  0] },
    { label: 'Cierre',      start: [11,  0], end: [11, 15] },
  ];

  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  // RF-03: Inicializar aria-expanded en false en todos los bloques
  items.forEach((item) => {
    item.setAttribute('aria-expanded', 'false');
  });

  /* ── RF-04: Detección hora Colombia ─────────────────── */
  /**
   * Devuelve la hora actual en Colombia (UTC-5) como objeto {date, hours, minutes}.
   * @returns {{ dateStr: string, totalMin: number }}
   */
  function getColombiaTime() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const col = new Date(utc + (-5 * 3600000));
    const y   = col.getFullYear();
    const m   = String(col.getMonth() + 1).padStart(2, '0');
    const d   = String(col.getDate()).padStart(2, '0');
    return {
      dateStr:  `${y}-${m}-${d}`,
      totalMin: col.getHours() * 60 + col.getMinutes(),
    };
  }

  /**
   * Devuelve true si la hora Colombia actual cae dentro del slot,
   * Y solo si es el día del evento.
   * @param {number} sh - start hour
   * @param {number} sm - start minute
   * @param {number} eh - end hour
   * @param {number} em - end minute
   */
  function isActive(sh, sm, eh, em) {
    const { dateStr, totalMin } = getColombiaTime();
    if (dateStr !== EVENT_DAY) return false;
    return totalMin >= sh * 60 + sm && totalMin < eh * 60 + em;
  }

  /** RF-04: Resalta el bloque activo; limpia los demás.
   *  RNF-04.1: Guard document.hidden para no consumir CPU
   *  cuando la pestaña está en segundo plano.
   */
  function highlightCurrentSlot() {
    // RNF-04.1: saltar cálculo si la pestaña está inactiva
    if (document.hidden) return;

    items.forEach((item, i) => {
      if (!slots[i]) return;
      const [sh, sm] = slots[i].start;
      const [eh, em] = slots[i].end;
      if (isActive(sh, sm, eh, em)) {
        item.classList.add('tl-item--active');
        item.setAttribute('aria-current', 'true');
      } else {
        item.classList.remove('tl-item--active');
        item.removeAttribute('aria-current');
      }
    });
  }

  highlightCurrentSlot();
  setInterval(highlightCurrentSlot, 30000); // RF-04: recalculo cada 30s

  /* ── RF-03: Expand / collapse ────────────────────────── */
  /**
   * Alterna el estado expandido de un bloque.
   * Colapsa todos los demás primero.
   * @param {HTMLElement} clickedItem
   */
  function toggleItem(clickedItem) {
    const isExpanded = clickedItem.classList.contains('tl-item--expanded');

    // Colapsar todos
    items.forEach((item) => {
      item.classList.remove('tl-item--expanded');
      item.setAttribute('aria-expanded', 'false');
    });

    // Expandir el clickeado solo si no estaba expandido
    if (!isExpanded) {
      clickedItem.classList.add('tl-item--expanded');
      clickedItem.setAttribute('aria-expanded', 'true');
    }
  }

  items.forEach((item) => {
    // Click
    item.addEventListener('click', () => toggleItem(item));

    // Teclado: Enter y Space (RF-03 accesibilidad)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(item);
      }
      // Flecha abajo / arriba para navegar entre bloques
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = item.nextElementSibling;
        if (next && next.classList.contains('timeline-item')) next.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = item.previousElementSibling;
        if (prev && prev.classList.contains('timeline-item')) prev.focus();
      }
    });
  });
})();

/* ══════════════════════════════════════════════════════
   RF-08 · INTERSECTION OBSERVER — Animaciones de entrada
   - Targets: .timeline-item, .speaker-card, .section-header,
     .countdown-wrapper, .footer-organizers
   - opacity 0→1 + translateY(24px→0) con stagger 0.05s
   - Se anima una sola vez (unobserve tras disparar)
   - Guard: prefers-reduced-motion → skip todas las animaciones
   ══════════════════════════════════════════════════════ */
(function initAnimations() {
  const targets = document.querySelectorAll(
    '.timeline-item, .speaker-card, .section-header, .countdown-wrapper, .footer-organizers'
  );

  if (!targets.length) return;

  /**
   * Si el usuario prefiere movimiento reducido,
   * no aplicar ninguna animación de entrada.
   */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Estado inicial: invisible y desplazado hacia abajo
  targets.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${(i * 0.05).toFixed(2)}s, transform 0.5s ease ${(i * 0.05).toFixed(2)}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // Animar y dejar de observar (solo una vez)
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ══════════════════════════════════════════════════════
   RF-06 · PIXEL ROBOT — Animación de pantalla
   - El robot CSS es fallback cuando hero-illustration.png falla
   - La visibilidad inicial se controla desde el HTML (onerror/onload)
   - Esta IIFE solo maneja los snippets rotativos de la pantalla
   ══════════════════════════════════════════════════════ */
(function initPixelRobot() {
  const screen = document.querySelector('.pr-code');
  if (!screen) return;

  /**
   * Snippets que rotan en la pantalla del robot cada 1.4s.
   * Mezcla de símbolos de código y emojis técnicos.
   * @type {string[]}
   */
  const snippets = [
    '_',   '{}',  '/>',  '[]',  '=>',
    '/**', '✓',   '🚀',  '<>',  ';;',
    'fn()', '···', '✦',  '[]', '#!',
  ];
  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % snippets.length;
    screen.textContent = snippets[idx];
  }, 1400);
})();

/* ══════════════════════════════════════════════════════
   RNF-03 · SMOOTH SCROLL — Anchors internos accesibles
   - Scroll suave a la sección destino
   - Mueve el foco al destino para screen readers
   ══════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Mover foco al destino para lectores de pantalla
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  });
})();

/* ══════════════════════════════════════════════════════
   RF-04 · AGENDA ACTIVE STYLES — Inyectados dinámicamente
   Evita conflictos de especificidad con .tl-card--star.
   Solo contiene estilos que dependen de estado JS en tiempo real.
   ══════════════════════════════════════════════════════ */
(function injectActiveStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .tl-item--active .tl-card {
      border-color: var(--neon) !important;
      box-shadow: 0 0 28px rgba(122,255,0,0.2) !important;
    }
    .tl-item--active .tl-dot {
      background: var(--neon) !important;
      box-shadow: 0 0 16px var(--neon-glow) !important;
      animation: activePulse 1.2s ease-in-out infinite;
    }
    .tl-item--active .tl-time .tl-hour {
      color: var(--neon) !important;
    }
    .tl-item--active {
      position: relative;
    }
    .tl-item--active::before {
      content: '● EN VIVO';
      position: absolute;
      top: 0.9rem;
      right: 1rem;
      font-family: var(--font-mono);
      font-size: 0.58rem;
      font-weight: 700;
      color: var(--neon);
      letter-spacing: 0.1em;
      animation: activePulse 1.2s ease-in-out infinite;
      z-index: 2;
    }
    @keyframes activePulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
  `;
  document.head.appendChild(style);
})();

