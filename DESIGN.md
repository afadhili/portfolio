# DESIGN.md — Bento Portfolio

A modern personal portfolio built around a **bento grid**: a mosaic of rounded cards of different sizes, each showing one thing (intro, projects, stack, links, etc.). It has subtle motion, and a **built-in dark and light mode**.

This document is the source of truth for visual design, layout, motion, and theming. It is framework-agnostic (works with Vue, React, Svelte, or plain HTML/CSS). Tokens are written as CSS custom properties.

---

## 1. Design Principles

1. **One idea per card.** Every bento tile communicates a single thing at a glance.
2. **Calm, not busy.** Motion supports hierarchy; it never competes with content.
3. **Soft geometry.** Large radii, generous padding, consistent gaps.
4. **Theme parity.** Dark and light are both first-class. Neither is an afterthought or a simple color inversion.
5. **Accessible by default.** Contrast, keyboard focus, and `prefers-reduced-motion` are requirements, not extras.
6. **Fast.** Animate only `transform` and `opacity`. No layout thrash, no heavy libraries required.

---

## 2. Theming (Dark / Light)

### 2.1 Strategy

- Use CSS custom properties on `:root`, overridden under `[data-theme="dark"]`.
- Resolution order:
  1. Saved user choice in `localStorage` (`theme`: `"light" | "dark"`).
  2. Otherwise, system preference via `prefers-color-scheme`.
- Toggle sets `document.documentElement.dataset.theme` and persists the choice.
- Apply the theme with an **inline script in `<head>`** before first paint to avoid a flash of the wrong theme.
- Smooth theme transition: `background-color`, `color`, `border-color` at 250ms (disabled for reduced motion).

```html
<script>
  (function () {
    try {
      var saved = localStorage.getItem("theme");
      var system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.dataset.theme = saved || system;
    } catch (e) {
      document.documentElement.dataset.theme = "light";
    }
  })();
</script>
```

```js
// toggle
function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
}
```

Optional: use the View Transitions API (`document.startViewTransition`) for a circular reveal from the toggle button, falling back to the plain swap.

### 2.2 Color Tokens

```css
:root {
  color-scheme: light;

  /* Surfaces */
  --bg:            #f5f5f7;   /* page background */
  --surface:       #ffffff;   /* cards */
  --surface-2:     #f0f0f3;   /* nested / hover surface */
  --border:        #e4e4e9;
  --border-strong: #d2d2d9;

  /* Text */
  --text:          #0f0f14;
  --text-muted:    #5c5c6b;
  --text-subtle:   #8a8a99;

  /* Accent */
  --accent:        #5b5bf0;   /* indigo */
  --accent-2:      #e0508f;   /* pink, secondary highlight */
  --accent-soft:   rgba(91, 91, 240, 0.10);
  --on-accent:     #ffffff;

  /* Status */
  --success:       #1f9d63;
  --warning:       #c98a0a;

  /* Effects */
  --shadow-sm: 0 1px 2px rgba(15, 15, 20, 0.04), 0 1px 1px rgba(15, 15, 20, 0.03);
  --shadow-md: 0 8px 24px rgba(15, 15, 20, 0.08);
  --shadow-lg: 0 20px 48px rgba(15, 15, 20, 0.12);
  --glow:      0 0 0 1px var(--border);
  --noise-opacity: 0.025;
}

[data-theme="dark"] {
  color-scheme: dark;

  --bg:            #09090b;
  --surface:       #131316;
  --surface-2:     #1b1b20;
  --border:        #26262d;
  --border-strong: #34343d;

  --text:          #f4f4f6;
  --text-muted:    #a1a1ad;
  --text-subtle:   #71717d;

  --accent:        #8b8bff;
  --accent-2:      #ff7ab0;
  --accent-soft:   rgba(139, 139, 255, 0.14);
  --on-accent:     #0b0b14;

  --success:       #3ddc97;
  --warning:       #f0b429;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.45);
  --shadow-lg: 0 20px 48px rgba(0, 0, 0, 0.55);
  --glow:      0 0 0 1px var(--border), 0 0 40px -12px rgba(139, 139, 255, 0.25);
  --noise-opacity: 0.04;
}
```

### 2.3 Contrast Requirements

| Pair | Minimum |
|---|---|
| `--text` on `--surface` / `--bg` | 7:1 (AAA) |
| `--text-muted` on `--surface` | 4.5:1 (AA) |
| `--on-accent` on `--accent` | 4.5:1 |
| Focus ring on any surface | 3:1 |

`--text-subtle` is for decorative or tertiary text only (timestamps, hints), never for essential information.

---

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display / headings | **Inter Tight** or **Geist** (600–700) | tight tracking |
| Body / UI | **Inter** or **Geist** (400–500) | |
| Mono (labels, code, stats) | **JetBrains Mono** or **Geist Mono** (400–500) | small uppercase labels |

Load with `font-display: swap` and self-host if possible. Use a system-font fallback stack.

### Scale (fluid)

```css
:root {
  --fs-xs:   0.75rem;                              /* 12 */
  --fs-sm:   0.875rem;                             /* 14 */
  --fs-base: 1rem;                                 /* 16 */
  --fs-lg:   1.125rem;                             /* 18 */
  --fs-xl:   clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem);
  --fs-2xl:  clamp(1.5rem, 1.2rem + 1.2vw, 2rem);
  --fs-3xl:  clamp(2rem, 1.4rem + 2.4vw, 3rem);
  --fs-hero: clamp(2.5rem, 1.5rem + 4.5vw, 4.75rem);

  --lh-tight: 1.1;
  --lh-snug:  1.3;
  --lh-body:  1.6;

  --tracking-tight: -0.03em;   /* headings */
  --tracking-label: 0.08em;    /* mono uppercase labels */
}
```

- Hero name: `--fs-hero`, weight 700, `--tracking-tight`, `--lh-tight`.
- Card titles: `--fs-xl`, weight 600.
- Card eyebrow labels: mono, `--fs-xs`, uppercase, `--tracking-label`, `--text-subtle`.
- Body copy max width: `60ch`.

---

## 4. Spacing, Radius, Sizing

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;

  --radius-sm:  10px;
  --radius-md:  16px;
  --radius-lg:  24px;   /* bento cards (default) */
  --radius-xl:  32px;
  --radius-pill: 999px;

  --container: 1200px;
  --gap: 16px;          /* bento gap; 12px on mobile, 20px on ≥1280 */
  --card-pad: 24px;     /* 20px on mobile, 28px on large cards */
}
```

---

## 5. Layout: The Bento Grid

### 5.1 Grid Definition

- CSS Grid, **4 columns** on desktop, **2 on tablet**, **1 on mobile**.
- Row unit: `grid-auto-rows: 180px` (desktop), `160px` (tablet), `auto` with `min-height` (mobile).
- Use `grid-auto-flow: dense` to fill gaps when reordering at breakpoints.
- Container: `max-width: var(--container)`, centered, horizontal padding `var(--space-5)`.

```css
.bento {
  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 180px;
  grid-auto-flow: dense;
}

@media (max-width: 1024px) {
  .bento { grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 160px; }
}
@media (max-width: 640px) {
  .bento { grid-template-columns: 1fr; grid-auto-rows: minmax(160px, auto); --gap: 12px; }
}
```

### 5.2 Card Size Modifiers

| Class | Desktop span (cols × rows) | Tablet | Mobile |
|---|---|---|---|
| `.card--1x1` | 1 × 1 | 1 × 1 | 1 × 1 |
| `.card--2x1` | 2 × 1 | 2 × 1 | 1 × 1 |
| `.card--1x2` | 1 × 2 | 1 × 2 | 1 × 2 |
| `.card--2x2` | 2 × 2 | 2 × 2 | 1 × 2 |
| `.card--3x1` | 3 × 1 | 2 × 1 | 1 × 1 |
| `.card--4x1` | 4 × 1 | 2 × 1 | 1 × 1 |

### 5.3 Reference Desktop Layout (4 cols)

```
┌───────────────────────┬───────────┬───────────┐
│                       │           │           │
│   HERO / INTRO        │  PHOTO /  │  THEME +  │
│   (2×2)               │  AVATAR   │  STATUS   │
│                       │  (1×2)    │  (1×1)    │
│                       │           ├───────────┤
│                       │           │ LOCATION  │
│                       │           │ + CLOCK   │
├───────────┬───────────┼───────────┴───────────┤
│ FEATURED  │ FEATURED  │                       │
│ PROJECT A │ PROJECT B │   TECH STACK          │
│ (2×2)     │ (1×2)     │   (marquee, 2×1)      │
│           │           ├───────────┬───────────┤
│           │           │ GITHUB    │ SOCIALS   │
├───────────┴───────────┤ ACTIVITY  │ (1×1)     │
│  EXPERIENCE TIMELINE  │ (1×1)     │           │
│  (2×1)                │           │           │
├───────────────────────┴───────────┴───────────┤
│  CONTACT CTA  (4×1)                           │
└───────────────────────────────────────────────┘
```

This is a starting arrangement. Keep the **hero card top-left** and the **contact CTA full-width at the bottom**; shuffle the rest to fit the actual content.

### 5.4 Page Structure

1. **Top bar** (sticky, blurred): logo/initials, section links (optional), theme toggle.
2. **Bento grid** (main content).
3. **Footer**: small, muted, copyright + "built with" note.

---

## 6. Card Anatomy

Base card styles:

```css
.card {
  position: relative;
  overflow: hidden;
  padding: var(--card-pad);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition:
    transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 300ms ease,
    border-color 300ms ease,
    background-color 250ms ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
}
```

Optional layers (all `pointer-events: none`, `position: absolute; inset: 0`):

- **Spotlight**: radial gradient following the cursor (see §7.4).
- **Noise**: 2–4% opacity grain using `--noise-opacity` for depth.
- **Gradient wash**: subtle `linear-gradient(135deg, var(--accent-soft), transparent 60%)` on featured cards.

Interactive cards (links) must be real `<a>` elements with a visible focus ring and an arrow icon (`↗`) that nudges on hover.

---

## 7. Motion & Animation

### 7.1 Principles

- Duration: **150–200ms** micro-interactions, **300–500ms** card transitions, **600–900ms** entrances.
- Easing:
  - `--ease-out: cubic-bezier(0.2, 0.8, 0.2, 1)` for entrances and hovers.
  - `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)` for layout/theme changes.
  - Springs (optional, via Motion/GSAP/Framer Motion): stiffness ~220, damping ~24.
- Only animate `transform` and `opacity`. Add `will-change` only during the animation.

### 7.2 Page-Load Entrance (staggered)

Cards fade up and scale in slightly, staggered by their index.

```css
.card {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
  animation: card-in 700ms var(--ease-out) forwards;
  animation-delay: calc(var(--i, 0) * 70ms);
}

@keyframes card-in {
  to { opacity: 1; transform: none; }
}
```

Set `--i` per card (`style="--i: 3"`). Cap the total stagger at ~700ms.

### 7.3 Scroll-Reveal

For cards below the fold, use `IntersectionObserver` (threshold 0.15) to add `.is-visible`; fall back to the load animation for browsers without support. Alternatively use CSS `animation-timeline: view()` where supported, with the observer as a fallback. Reveal once only.

### 7.4 Cursor Spotlight (hover)

```css
.card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    320px circle at var(--mx, 50%) var(--my, 50%),
    var(--accent-soft),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 300ms ease;
  pointer-events: none;
}
.card:hover::before { opacity: 1; }
```

```js
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});
```

Skip on touch devices (`@media (hover: hover)`).

### 7.5 Per-Card Micro-Animations

| Card | Animation |
|---|---|
| Hero | Name reveals word by word (mask slide-up, 60ms stagger). Waving emoji or a gentle blinking cursor next to the role. |
| Avatar / photo | Slow 3D tilt following the pointer (max ±6°), parallax inner image. |
| Theme toggle | Sun ↔ moon icon morph (rotate + scale + crossfade, 400ms). Optional circular View Transition reveal. |
| Status | Pulsing green dot (`scale 1 → 1.8`, `opacity 1 → 0`, 2s loop) with "Available for work". |
| Clock / location | Live time, tick without layout shift (`font-variant-numeric: tabular-nums`). |
| Featured project | Image zooms 1.04 on hover; arrow icon slides diagonally; title underline draws left to right. |
| Tech stack | Infinite horizontal marquee, pauses on hover, edge fade mask. |
| GitHub activity | Contribution squares fade in with diagonal stagger. |
| Socials | Icons lift and tint to `--accent` on hover. |
| Experience | Timeline line draws as the card enters view (`stroke-dashoffset`). |
| Contact CTA | Magnetic button (follows cursor within ~12px), animated gradient border. |
| Counters | Numbers count up from 0 once when visible. |

### 7.6 Reduced Motion (required)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .card { opacity: 1; transform: none; }
  .marquee__track { animation: none; }
}
```

Disable marquee, tilt, magnetic effect, pulse, and count-up under reduced motion; show final values immediately.

---

## 8. Components

### 8.1 Top Bar
- Height 64px, `position: sticky; top: 0`, `backdrop-filter: blur(12px)`, background `color-mix(in srgb, var(--bg) 70%, transparent)`, bottom border `--border`.
- Left: initials/logotype. Right: nav links (hidden on mobile) + theme toggle.

### 8.2 Theme Toggle
- 40×40px icon button, pill or circle, `--surface-2` background, `--border` outline.
- `aria-label="Toggle theme"`, `aria-pressed` reflecting dark state.
- Keyboard: Enter/Space. Icon swaps with a rotate/scale transition.

### 8.3 Buttons
- **Primary**: `--accent` background, `--on-accent` text, pill radius, 44px min height. Hover: lift 1px, brightness 1.05. Active: scale 0.98.
- **Secondary**: transparent with `--border-strong`, hover `--surface-2`.
- **Icon button**: 40px circle.

### 8.4 Tags / Chips
- Mono, `--fs-xs`, padding `4px 10px`, radius pill, `--surface-2` background, `--border` outline.

### 8.5 Project Card
- Cover image (16:10) or generated gradient, title, one-line description, 2–4 tags, `↗` link.
- Image area has `border-radius: var(--radius-md)` and inner shadow; zoom on hover.

### 8.6 Timeline Item
- Date (mono, subtle), role + company (semibold), one-line impact. Vertical line `--border`, node dot `--accent`.

### 8.7 Contact CTA
- Large headline ("Let's build something."), email as copy-to-clipboard button (shows "Copied ✓" toast for 1.5s), plus secondary link to socials.

---

## 9. Content Map

| Card | Content |
|---|---|
| Hero | Name, role, one-sentence pitch, primary CTA ("View work") |
| Photo | Portrait or abstract avatar |
| Status | Availability indicator |
| Location | City/country + live local time |
| Projects (2–3) | Cover, title, summary, tags, link |
| Tech stack | Logos/names in a marquee |
| GitHub | Contribution grid or repo count/stars |
| Socials | GitHub, LinkedIn, X, email |
| Experience | 2–4 timeline entries (work, education, notable achievements) |
| Contact | CTA with email |

---

## 10. Responsive Behavior

| Breakpoint | Columns | Notes |
|---|---|---|
| ≥ 1280px | 4 | Gap 20px, container 1200px |
| 1024–1279px | 4 | Gap 16px |
| 640–1023px | 2 | Large cards collapse to full width (2 cols) |
| < 640px | 1 | All cards full width; hero first, contact last; disable tilt/spotlight |

- Touch targets ≥ 44×44px.
- Order on mobile: Hero → Status → Projects → Stack → Experience → Socials → Contact.

---

## 11. Accessibility

- Semantic structure: `<header>`, `<main>`, `<section aria-label>` per card group, `<footer>`.
- Cards that are links: the whole card is one `<a>`; avoid nested interactive elements.
- Focus ring: `outline: 2px solid var(--accent); outline-offset: 3px;` on `:focus-visible`.
- Skip link to main content.
- Images: meaningful `alt`; decorative layers `aria-hidden="true"`.
- Marquee content is duplicated visually only; hide the duplicate from assistive tech.
- Respect `prefers-reduced-motion` and `prefers-color-scheme`.
- Never convey information by color alone (status dot also has text).

---

## 12. Performance

- Target: LCP < 2.0s, CLS < 0.05, INP < 200ms.
- Images: AVIF/WebP, explicit `width`/`height`, `loading="lazy"` below the fold, `fetchpriority="high"` on the hero image.
- Fonts: subset, preload the primary weight, `font-display: swap`.
- Animation: GPU-friendly properties only; pause offscreen animations (IntersectionObserver).
- Keep JS for effects under ~10KB, or use a lightweight library (Motion One, GSAP core).

---

## 13. Suggested File Structure

```
/
├── DESIGN.md
├── index.html
├── src/
│   ├── styles/
│   │   ├── tokens.css        # §2.2, §3, §4 custom properties
│   │   ├── base.css          # reset, typography, focus styles
│   │   ├── bento.css         # grid + card size modifiers
│   │   ├── components.css    # buttons, chips, topbar, timeline
│   │   └── motion.css        # keyframes + reduced-motion rules
│   ├── scripts/
│   │   ├── theme.js          # toggle + persistence
│   │   ├── reveal.js         # IntersectionObserver
│   │   ├── spotlight.js      # cursor spotlight + tilt
│   │   └── clock.js          # live local time
│   └── content/
│       └── data.ts           # projects, experience, socials
└── public/
    ├── fonts/
    └── images/
```

---

## 14. Implementation Checklist

- [ ] Inline theme script in `<head>`; no flash of wrong theme
- [ ] Tokens defined for both themes; contrast verified
- [ ] Bento grid renders correctly at all four breakpoints
- [ ] Staggered load animation + scroll reveal
- [ ] Hover spotlight and lift on cards (hover-capable devices only)
- [ ] Theme toggle works with keyboard and persists across reloads
- [ ] `prefers-reduced-motion` disables all non-essential motion
- [ ] Focus rings visible in both themes
- [ ] Lighthouse: Performance ≥ 95, Accessibility 100
- [ ] Tested in Chrome, Safari, Firefox, and on a real phone

---

## 15. Do / Don't

**Do**
- Keep a consistent gap and radius across every card.
- Use the accent color sparingly: one primary action per view, small highlights elsewhere.
- Give dark mode its own shadows and borders (shadows are weak on dark; rely on borders and subtle glow).

**Don't**
- Don't invert colors mechanically for dark mode.
- Don't animate everything at once; stagger and prioritize the hero.
- Don't use pure `#000` / `#fff` for large surfaces (too harsh).
- Don't put more than one idea or more than ~25 words of body copy in a single card.
