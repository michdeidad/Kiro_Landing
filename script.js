/* =====================================================
   KIRO EN MODO CONSTRUCTOR · script.js
   Vanilla JS — sin dependencias externas
   - Contador regresivo en tiempo real
   - Agenda interactiva con resaltado de bloque activo
   - Animaciones de entrada (Intersection Observer)
   - Pixel robot blinking loop (ya en CSS, aquí el cursor)
   ===================================================== */

'use strict';

/* ── Fecha objetivo del evento ──────────────────────── */
// 12 de septiembre de 2026, 9:00 AM (hora Colombia, UTC-5)
const EVENT_DATE = new Date('2026-09-12T09:00:00-05:00');

/* ══════════════════════════════════════════════════════
   CONTADOR REGRESIVO
   ══════════════════════════════════════════════════════ */
(function initCountdown() {
  const elDays    = document.getElementById('cd-days');
  const elHours   = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');
  const elCountdown = document.getElementById('countdown');
  const elEnded     = document.getElementById('countdown-ended');

  if (!elDays || !elHours || !elMinutes || !elSeconds) return;

  /**
   * Pad a number to two digits.
   * @param {number} n
   * @returns {string}
   */
  function pad(n) {
    return String(Math.max(0, n)).padStart(2, '0');
  }

  /**
   * Animate a digit element with a brief scale-down when the value changes.
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

  function tick() {
    const now  = Date.now();
    const diff = EVENT_DATE.getTime() - now;

    if (diff <= 0) {
      // Event has started or passed
      updateDigit(elDays,    '00');
      updateDigit(elHours,   '00');
      updateDigit(elMinutes, '00');
      updateDigit(elSeconds, '00');
      elCountdown.classList.add('hidden');
      elEnded.classList.remove('hidden');
      return; // stop ticking
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

    // Update accessible label for screen readers every minute
    if (seconds === 0) {
      elCountdown.setAttribute(
        'aria-label',
        `Faltan ${days} días, ${hours} horas y ${minutes} minutos para el evento`
      );
    }

    setTimeout(tick, 1000);
  }

  tick();
})();

/* ══════════════════════════════════════════════════════
   AGENDA INTERACTIVA
   Resalta el bloque de tiempo actual durante el evento.
   Fuera del horario del evento no resalta nada.
   ══════════════════════════════════════════════════════ */
(function initAgenda() {
  /**
   * Agenda slots: each entry maps to a .timeline-item by index.
   * times are [startHour, startMin] in UTC-5.
   */
  const slots = [
    { label: 'Bienvenida',          start: [9,  0],  end: [9, 15] },
    { label: 'Vibecoding',          start: [9, 15],  end: [9, 45] },
    { label: 'Demo Kiro',           start: [9, 45],  end: [10, 0] },
    { label: 'Refrigerio',          start: [10,  0], end: [10, 15] },
    { label: 'Flappy Kiro',         start: [10, 15], end: [11,  0] },
    { label: 'Cierre',              start: [11,  0], end: [11, 15] },
  ];

  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  /**
   * Returns true if the current local time (in Colombia, UTC-5) falls
   * within [startH:startM, endH:endM).
   */
  function isActive(startH, startM, endH, endM) {
    // Get current time in Colombia (UTC-5)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const col = new Date(utc + (-5 * 3600000));
    const curMin = col.getHours() * 60 + col.getMinutes();
    const startMin = startH * 60 + startM;
    const endMin   = endH   * 60 + endM;
    return curMin >= startMin && curMin < endMin;
  }

  function highlightCurrentSlot() {
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
  // Re-check every 30 seconds
  setInterval(highlightCurrentSlot, 30000);

  /* ── Expand/collapse on click (optional detail toggle) ── */
  items.forEach((item) => {
    item.addEventListener('click', () => {
      const isExpanded = item.classList.contains('tl-item--expanded');
      // Collapse all
      items.forEach(i => {
        i.classList.remove('tl-item--expanded');
        i.setAttribute('aria-expanded', 'false');
      });
      // Expand clicked unless it was already expanded
      if (!isExpanded) {
        item.classList.add('tl-item--expanded');
        item.setAttribute('aria-expanded', 'true');
      }
    });

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
})();

/* ══════════════════════════════════════════════════════
   INTERSECTION OBSERVER — Animaciones de entrada
   ══════════════════════════════════════════════════════ */
(function initAnimations() {
  // Add initial state class to animatable elements
  const targets = document.querySelectorAll(
    '.timeline-item, .speaker-card, .section-header, .countdown-wrapper'
  );

  if (!targets.length) return;

  // Only animate if the user hasn't requested reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();

/* ══════════════════════════════════════════════════════
   PIXEL ROBOT — Cursor code animation
   Cycles random code snippets on the robot's screen
   ══════════════════════════════════════════════════════ */
(function initPixelRobot() {
  const screen = document.querySelector('.pr-code');
  if (!screen) return;

  const snippets = ['_', '{}', '/>', '[]', '=>', '/**', '✓', '🚀', '<>', ';;'];
  let idx = 0;

  setInterval(() => {
    idx = (idx + 1) % snippets.length;
    screen.textContent = snippets[idx];
  }, 1400);
})();

/* ══════════════════════════════════════════════════════
   SMOOTH SCROLL — Enhanced for internal anchors
   ══════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Move focus to section for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();

/* ══════════════════════════════════════════════════════
   AGENDA ACTIVE STYLES — injected dynamically
   (avoids CSS specificity issues with the star card)
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
    .tl-item--active {
      position: relative;
    }
    @keyframes activePulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
    .tl-item--expanded .tl-desc {
      max-height: 200px;
    }
  `;
  document.head.appendChild(style);
})();
