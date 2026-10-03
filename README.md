# Kiro en modo constructor 🚀

> **Workshop gratuito** · Sábado 12 de septiembre de 2026 · 9:00 AM – 11:00 AM  
> UNAB · Salón L51 · Bucaramanga, Colombia

Landing page oficial del taller **"Kiro en modo constructor: specs, agentes y una web real"**, organizado por [BucaraTec](https://bucaratec.com), AWS User Group Bucaramanga y UNAB TEC.

---

## 📋 Descripción

Esta página web presenta el evento donde los asistentes aprenderán a utilizar **Kiro** (el IDE agentic de AWS) para construir aplicaciones reales con specs, agentes y flujos de trabajo automatizados. El taller incluye demos en vivo, una charla sobre Vibecoding y el workshop estrella: **Flappy Kiro**.

---

## 🎯 Contenido del evento

| Hora       | Actividad                              | Ponente            |
|------------|----------------------------------------|--------------------|
| 9:00 AM    | Bienvenida y contexto                  | —                  |
| 9:15 AM    | Tendencia: Vibecoding                  | José Verbel        |
| 9:45 AM    | Demo: Kiro en modo constructor         | Juliana Ramírez A. |
| 10:00 AM   | ☕ Refrigerio & Networking             | —                  |
| 10:15 AM   | 🎮 Workshop: Flappy Kiro               | Juliana Ramírez A. |
| 11:00 AM   | Q&A y cierre                           | —                  |

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| **HTML5**  | Estructura semántica (secciones, artículos, roles ARIA) |
| **CSS3**   | Variables `:root`, Flexbox, CSS Grid, animaciones, media queries mobile-first |
| **JavaScript Vanilla** | Contador regresivo en tiempo real, agenda dinámica con resaltado, Intersection Observer, smooth scroll |

Sin frameworks ni dependencias externas. Solo las fuentes de Google Fonts (`Space Grotesk` + `Space Mono`).

---

## 📁 Estructura de archivos

```
Ziro webb/
│
├── index.html          # Página principal (única)
├── styles.css          # Estilos globales con variables de marca
├── script.js           # Lógica: contador, agenda interactiva, animaciones
│
├── assets/
│   ├── hero-illustration.png   # Ilustración pixel art del hero
│   ├── logo-aws.png            # Logo AWS User Group
│   ├── logo-bucaratec.png      # Logo BucaraTec
│   ├── logo-unab.png           # Logo UNAB TEC
│   └── manifest.json           # Manifiesto de assets
│
└── .kiro/
    └── steering/
        └── brand-and-specs.md  # Guía de marca y especificaciones técnicas
```

---

## 🎨 Paleta de colores

| Variable CSS          | Valor      | Uso |
|-----------------------|------------|-----|
| `--bg-primary`        | `#1a1b2e`  | Fondo principal (dark navy) |
| `--purple-deep`       | `#4a3f8c`  | Acento púrpura profundo |
| `--purple-mid`        | `#6b5fb5`  | Acento púrpura medio |
| `--neon`              | `#7aff00`  | Neón BucaraTec — botones, badges, hovers |
| `--text-white`        | `#ffffff`  | Texto principal |
| `--text-light`        | `#e2e8f0`  | Texto secundario |

---

## 🔤 Tipografías

- **Space Grotesk** — textos de cuerpo, títulos, UI general
- **Space Mono** — badges, contadores, etiquetas técnicas, código

---

## 📱 Responsive

El diseño sigue la estrategia **mobile-first** con dos breakpoints:

- `768px` — layout de dos columnas (hero, ponentes)
- `1024px` — ajustes de espaciado y tamaños para desktop

---

## ⚡ Características de la página

- **Contador regresivo** en tiempo real (zona horaria Colombia UTC-5)
- **Agenda interactiva** con resaltado del bloque activo durante el evento
- **Pixel robot animado** como ilustración de fallback
- **Animaciones de entrada** con `IntersectionObserver` (respeta `prefers-reduced-motion`)
- **Botón flotante** de registro con animación neón
- **Logos de organizadores** con fallback de texto si la imagen no carga
- Accesibilidad: roles ARIA, `aria-label`, navegación por teclado, `focus-visible`

---

## 🏢 Organizadores

| Organización | Descripción |
|--------------|-------------|
| **BucaraTec** | Comunidad tecnológica de Bucaramanga, impulsora del ecosistema tech regional |
| **AWS User Group Bucaramanga** | Grupo de usuarios de Amazon Web Services liderado por Juliana Ramírez A. |
| **UNAB TEC** | Universidad Autónoma de Bucaramanga — sede del evento (Salón L51) |

---

## 🚀 Cómo visualizar

1. Clona o descarga este repositorio
2. Abre `index.html` directamente en el navegador, o
3. Usa **Live Server** en VS Code para recarga automática:
   - Instala la extensión *Live Server* (Ritwick Dey)
   - Clic derecho en `index.html` → **Open with Live Server**

---

## 📝 Notas de desarrollo

- Este proyecto fue construido con **Kiro IDE** como demostración práctica del workshop.
- No se requiere ningún proceso de build ni instalación de dependencias.
- Los assets de logos deben estar en la carpeta `assets/` con los nombres exactos indicados en la estructura.

---

*Hecho con ❤️ y **Kiro** · Bucaramanga, Colombia · 2026*
