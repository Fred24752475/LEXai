# LexGH Design System & UI Skill

This skill defines the visual language, component design, depth/glassmorphism, and animation guidelines for **LexGH** (Lex AI) — an AI compliance platform for Ghanaian businesses, powered by Npontu Technologies. It serves as both a system design reference and an AI instruction set for generating UI.

The aesthetic is **warm, premium, and trustworthy**: a soft off-white canvas, a deep "Ghana green" brand, gold/amber accents, and richly layered frosted-glass surfaces with tactile depth.

**Do not retrofit these styles across the app automatically. Use this document as a reference when explicitly asked to build, restyle, or extend components.** Prefer the existing utility classes in `app/globals.css` and tokens in `tailwind.config.ts` over hand-rolled values.

---

## 1. System Design Guide

### Typography
- **Font:** Geist Sans, loaded via `var(--font-geist-sans)` (`font-sans` and `font-heading` both map to it). Fallbacks: `system-ui, sans-serif`.
- **Headings:** Bold/extrabold with tight tracking — `font-extrabold tracking-tight` (or `font-bold`).
- **Body:** Relaxed line height (`leading-relaxed`), secondary text in `text-slate-600` / `text-ink-500`.
- **Smoothing:** `-webkit-font-smoothing: antialiased` (set globally).
- **Hierarchy:**
  - Hero `h1`: `text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl leading-[1.06]`
  - Section `h2`: `text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl`
  - Card title: `text-[1.85rem] font-bold tracking-tight text-slate-900`
  - Body: `text-lg text-slate-600 leading-relaxed`
  - Gradient text accent: `text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400` (green) or `from-amber-600 to-amber-400` (gold).

### Color Palette
Defined in `tailwind.config.ts`. Always prefer these tokens over raw hex.

- **Brand (Ghana green) — primary:**
  `brand-50 #f2f8f4`, `100 #e0efe5`, `200 #c2dfcc`, `300 #96c7a8`, `400 #65a87e`, `500 #4a8f64`, `600 #38724f`, `700 #2d5c40`, `800 #264a34`, `900 #1f3d2b`.
  Primary actions use `brand-500/600`; deep backgrounds use `brand-900`.
- **Amber (gold) — accent / secondary product:**
  `amber-50 #fdf7ee`, `100 #faebd4`, `200 #f4d3a3`, `300 #ecb668`, `400 #e09840`, `500 #c97d2e`, `600 #a96224`, `700 #8a4b1e`.
- **Ink (text):** `ink-900 #0f172a`, `ink-700 #334155`, `ink-500 #64748b`, `ink-300 #cbd5e1`. (Slate utilities are used interchangeably for text/borders.)
- **Surfaces:** `--surface: #ffffff` (cards), `--background: #fdfbf7` (warm off-white canvas).
- **Status:** success → `brand-700` / `#059669`; warning → `amber-600` / `#d97706`; danger → `red-600` / `#dc2626`.

### Canvas / Background
The page background is a warm off-white with two fixed radial tints (green top-left, amber top-right):

```css
body {
  background-color: #fdfbf7;
  background-image:
    radial-gradient(circle at 12% -10%, rgba(74,143,100,0.07), transparent 40%),
    radial-gradient(circle at 95% 5%, rgba(201,125,46,0.05), transparent 42%);
  background-attachment: fixed;
}
```

For **dark sections** (How-it-works, CTA), use a deep gradient `bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900` with blurred color orbs floating inside.

### Radii & Spacing
- Token overrides: `rounded-xl` = `0.875rem`, `rounded-2xl` = `1.25rem`. Large surfaces use `rounded-3xl` / `rounded-[2rem]`.
- Page width: `container-page` = `mx-auto w-full max-w-6xl px-5 sm:px-8`.
- Header height: `h-16` via `header-bar`.

### Shadows & Depth
Two registered tokens plus bespoke layered stacks:
- `shadow-card`: `0 1px 3px rgba(15,23,42,0.08), 0 8px 24px rgba(15,23,42,0.06)` — default resting card.
- `shadow-lift`: `0 8px 30px rgba(15,23,42,0.12)` — hovered/elevated.

**Depth philosophy:** premium surfaces combine *four* layers in one `shadow-[...]`:
1. a wide, soft outer drop shadow (ambient elevation),
2. an **inset top highlight** (`inset 0 2px 0 rgba(255,255,255,0.95)`) simulating a lit top edge,
3. an **inset bottom shadow** (`inset 0 -1px 0 rgba(15,23,42,0.12)`) for a grounded base edge,
4. a hairline ring (`0 0 0 1px rgba(255,255,255,0.65)`) to crisp the border.

On hover, swap the outer shadow for a larger, **color-tinted** glow (green `rgba(56,114,79,…)` or amber `rgba(201,125,46,…)`) and lift with `-translate-y-1.5`.

---

## 2. Glassmorphism & Frosted Effects

Three tiers of glass are used. Reach for the lightest tier that fits.

### Tier 1 — Frosted bars (navigation, floating toolbars)
Lightweight translucency for sticky chrome.
```html
<header class="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
```
Floating overlay / action bar (Cluely-style movable bar):
```html
<div class="rounded-2xl bg-white/80 backdrop-blur-md border border-white/40 shadow-xl p-1.5">
```

### Tier 2 — Subtle glass panels (stat strips, trust bars)
```html
<div class="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-sm shadow-sm">
```

### Tier 3 — Premium layered "luxury glass" cards
The signature LexGH surface (used for the two-product cards and the hero demo frame). It stacks: a translucent grained body, a multi-layer depth shadow, an inner ring + inset borders, blurred aurora orbs, and a top accent strip.

```html
<div class="glass-grain group relative h-full overflow-hidden rounded-3xl border border-white/85 bg-white/60 p-8
            shadow-[0_26px_80px_rgba(15,23,42,0.17),0_2px_0_rgba(255,255,255,0.98)_inset,0_-1px_0_rgba(15,23,42,0.1)_inset,0_0_0_1px_rgba(255,255,255,0.75)]
            backdrop-blur-2xl transition-all duration-500 ease-out hover:-translate-y-1.5
            hover:shadow-[0_34px_96px_rgba(56,114,79,0.26),0_2px_0_rgba(255,255,255,0.98)_inset,0_-1px_0_rgba(15,23,42,0.12)_inset,0_0_0_1px_rgba(255,255,255,0.85)]">
  <!-- 1. Top accent strip (brand or amber) -->
  <div class="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 shadow-[0_0_20px_rgba(56,114,79,0.55)]"></div>

  <!-- 2. Inner ring + inset borders for glass edges -->
  <div class="pointer-events-none absolute inset-0 rounded-3xl">
    <div class="absolute inset-0 rounded-3xl ring-1 ring-white/75"></div>
    <div class="absolute inset-[1.5px] rounded-[1.35rem] border border-slate-200/45"></div>
    <div class="absolute inset-[1.5px] rounded-[1.35rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(148,163,184,0.22)]"></div>
  </div>

  <!-- 3. Blurred aurora orbs (animate on hover, see luxury-aurora) -->
  <div class="pointer-events-none absolute inset-0">
    <div class="absolute -top-20 -left-16 h-48 w-48 rounded-full bg-brand-200/50 blur-3xl"></div>
    <div class="luxury-aurora absolute -bottom-24 left-[-8%] h-56 w-[70%] rounded-full bg-brand-300/30 blur-3xl opacity-55 group-hover:opacity-80 transition-opacity duration-700"></div>
    <div class="luxury-aurora luxury-aurora-reverse absolute -bottom-28 right-[-10%] h-52 w-[62%] rounded-full bg-emerald-200/25 blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-white/75 via-white/38 to-white/22"></div>
  </div>

  <!-- 4. Content must be relative z-10 -->
  <div class="relative z-10"> ... </div>
</div>
```

The `.glass-grain` component class adds soft white highlight blooms plus a faint SVG fractal-noise texture so the frosted surface reads as real glass rather than flat transparency. Use the **amber** variants (`rgba(201,125,46,…)`, `bg-amber-*`, `bg-yellow-200/25`) for the Health Check / accent card.

> Frosted-glass rules: always pair `bg-white/{60-80}` with a `backdrop-blur-*`, give edges a `border-white/{40-85}` and/or `ring-white/75`, keep real content on `relative z-10`, and mark all decorative layers `pointer-events-none`.

---

## 3. Components & Utility Classes

These live in `@layer components` in `app/globals.css`. Reuse them — don't re-derive.

| Class | Purpose |
| --- | --- |
| `container-page` | Centered max-w-6xl page gutter |
| `header-bar` | 16-unit-tall flex header row |
| `card` | `rounded-2xl border border-slate-200/80 bg-white shadow-sm` |
| `btn` | Base button (pill-ish `rounded-xl`, focus ring `brand-500/40`) |
| `btn-primary` | Green gradient CTA (`from-brand-400 to-brand-600`) with green glow shadow, hover lift + scale |
| `btn-amber` | Gold gradient CTA (`from-amber-400 to-amber-600`) with amber glow |
| `btn-secondary` | White, slate border, hover → brand border/text |
| `btn-ghost` | Transparent, hover slate-100 |
| `input` | `rounded-xl` field, focus `ring-brand-500/30` |
| `label` | Form label |
| `chip` | Small rounded-full pill base |
| `badge-authority` | `chip` in brand-50/brand-700 with brand ring |
| `section-label` | Amber pill eyebrow label (`border-amber-200 bg-amber-50 text-amber-700`) |
| `glass-grain` | Adds glass highlight blooms + noise texture (see Tier 3) |

### Buttons
Primary CTA baseline (matches `.btn-primary`):
```html
<button class="relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white
               transition-all duration-300 ease-out bg-gradient-to-b from-brand-400 to-brand-600 rounded-xl
               shadow-[0_8px_20px_rgba(74,143,100,0.28)] hover:shadow-[0_12px_28px_rgba(74,143,100,0.42)]
               hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]">
  Get started free
</button>
```
Use `.btn-amber` (amber glow `rgba(201,125,46,…)`) for accent CTAs, typically on dark CTA sections.

### Cards
- Standard content card: `card` + `p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out`.
- Selectable option: 2px border, selected → `border-brand-500 bg-brand-50 shadow-card`, idle hover → `hover:border-brand-300 hover:shadow-card` (see `OptionCard`).
- Premium marketing card: Tier 3 luxury glass (above).

### Badges & Pills
- Authority/category tag: `rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-100`.
- Status pills follow the status colors (success brand, warning amber, danger red) with matching `ring-inset` rings.

### Icon tiles
Square rounded tile holding an SVG icon: `flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600` (or amber variant). On glass cards use a frosted tile: `rounded-xl border border-white/80 bg-white/80 text-brand-700 shadow-sm shadow-brand-100/60`.

### Data viz — HealthGauge
Animated SVG semicircle gauge (220×130, radius 90, `strokeWidth 16`, rounded caps). Track `#e2e8f0`; progress color by score (≥75 green `#059669`, ≥50 amber `#d97706`, else red `#dc2626`). Animate `stroke-dashoffset` over `1.2s cubic-bezier(0.22,1,0.36,1)` and count the number up via `requestAnimationFrame`.

---

## 4. Animations & Motion

Use Tailwind keyframe utilities from the config plus the custom CSS animations in `globals.css`. Always respect `prefers-reduced-motion` (all the animations below are disabled under it).

### Entry animations (Tailwind config)
- `animate-fade-up` — `opacity 0 → 1`, `translateY(12px) → 0`, `0.5s ease-out both`.
- `animate-fade-in`, `animate-scale-in` (`scale 0.96 → 1`).
- Stagger sequential items with inline `style={{ animationDelay: "Nms" }}` (≈70–120ms steps).

### Scroll reveal (preferred for sections)
Wrap on-scroll content in the `ScrollReveal` component (`components/ScrollReveal.tsx`), an IntersectionObserver that adds `.revealed`:
```tsx
<ScrollReveal direction="up" delay={120}>...</ScrollReveal>
```
Directions: `up | left | right | fade | zoom`. Underlying classes (`.scroll-reveal--*`) transition over `0.9s cubic-bezier(0.16,1,0.3,1)`.

### Hover micro-interactions
- Buttons: lift `-translate-y-0.5`, subtle `scale-[1.02]`, widen + intensify the colored shadow; active `scale-[0.98]`. Timing `transition-all duration-300 ease-out`.
- Glass cards: `-translate-y-1.5` with a larger color-tinted shadow and brightening aurora orbs.
- Links with arrow: arrow `group-hover:translate-x-1`.

### Ambient / decorative motion (CSS in globals)
- `luxury-aurora` / `luxury-aurora-reverse` — slow drifting blurred orbs inside glass cards; **paused until `.group:hover`**.
- `authority-marquee__track` — infinite horizontal logo/tag scroll (36s linear), pauses on hover; pair with an edge `mask-image` fade.
- `cta-gradient__sheen`, `cta-orb--green`, `cta-orb--amber` — animated blurred color blobs for the dark CTA section.
- Decorative page orbs: large `rounded-full bg-brand-400/10 blur-[120px]` (and amber) positioned absolutely behind hero content.

---

## 5. AI Implementation Instructions

When asked to "apply the LexGH design system", "build a LexGH card/button", or "style this to match our design guide":

1. **Tailwind first.** Use the tokens (`brand-*`, `amber-*`, `ink-*`) and the component classes in `app/globals.css`. Do not introduce new raw hex when a token exists. (Note: a few legacy components reference a `gold-*` scale that isn't defined — use `amber-*` instead.)
2. **Match the warm-green identity** — green is primary, amber/gold is the accent. Never default to generic blue.
3. **Reuse classes:** `.btn-primary`, `.btn-amber`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.chip`, `.section-label`, `.badge-authority`, `.container-page`. Build new variants on top of `.btn`/`.card` rather than from scratch.
4. **Glass surfaces:** pick the lightest tier (frosted bar → subtle panel → luxury glass). For luxury glass, include all four layers (grain body, layered depth shadow, inner ring/inset borders, aurora orbs) and keep content on `relative z-10` with decorative layers `pointer-events-none`.
5. **Depth:** prefer `shadow-card` / `shadow-lift` for ordinary cards; use the four-part layered `shadow-[…]` (outer glow + inset highlight + inset base + hairline ring) for premium surfaces, switching to a color-tinted glow on hover.
6. **Motion:** wrap scroll-in sections in `ScrollReveal`; use `animate-fade-up` with staggered `animationDelay` for above-the-fold groups; keep hover transitions at `duration-300 ease-out`; gate decorative loops behind `group-hover` and always honor `prefers-reduced-motion`.
7. **Consistency:** shared radii (`rounded-xl`/`rounded-2xl`, large surfaces `rounded-3xl`), soft borders (`border-slate-200/80`, glass `border-white/*`), `ring-inset` rings on pills, and the warm `#fdfbf7` canvas. Add `no-print` to chrome and respect the print styles for report pages.
