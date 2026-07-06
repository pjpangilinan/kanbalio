---
name: Aetheric Terminal
colors:
  surface: '#001234'
  surface-dim: '#001234'
  surface-bright: '#27385e'
  surface-container-lowest: '#000d2a'
  surface-container-low: '#051a3f'
  surface-container: '#0a1e43'
  surface-container-high: '#17294e'
  surface-container-highest: '#22345a'
  on-surface: '#d9e2ff'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#d9e2ff'
  inverse-on-surface: '#1e2f55'
  outline: '#859398'
  outline-variant: '#3c494e'
  surface-tint: '#3cd7ff'
  primary: '#a8e8ff'
  on-primary: '#003642'
  primary-container: '#00d4ff'
  on-primary-container: '#00586b'
  inverse-primary: '#00677e'
  secondary: '#d2bbff'
  on-secondary: '#3f008e'
  secondary-container: '#6001d1'
  on-secondary-container: '#c9aeff'
  tertiary: '#dadef4'
  on-tertiary: '#2b3040'
  tertiary-container: '#bec2d7'
  on-tertiary-container: '#4b4f61'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b4ebff'
  primary-fixed-dim: '#3cd7ff'
  on-primary-fixed: '#001f27'
  on-primary-fixed-variant: '#004e5f'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#dee1f7'
  tertiary-fixed-dim: '#c2c6db'
  on-tertiary-fixed: '#161b2b'
  on-tertiary-fixed-variant: '#414658'
  background: '#001234'
  on-background: '#d9e2ff'
  surface-variant: '#22345a'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 120px
---

## Brand & Style

The brand personality is high-tech, precise, and visionary, designed to position a Full Stack Developer as an architect of digital frontiers. It evokes the feeling of a sophisticated command center—organized, powerful, and luminant.

The design style is **Futuristic Glassmorphism**. It utilizes depth through translucency, background blurs, and subtle "glow" states that suggest energy flowing through the interface. The aesthetic balances the vastness of deep space (Deep Navy backgrounds) with the sharp clarity of modern development tools (Monospaced accents and crisp borders). Large amounts of negative space are used to ensure the dense technical content remains breathable and premium.

## Colors

The palette is anchored by a **Deep Navy (#0A0F1E)** base, providing a high-density foundation for glass effects to layer upon. 

- **Primary (Cyan Glow - #00D4FF):** Used for critical calls to action, active states, and interactive symbols. It represents energy and connectivity.
- **Secondary (Violet - #7C3AED):** Used for decorative highlights, category tags, and syntax highlighting. It adds depth and a premium "cyber" feel.
- **Surface & Borders:** The interface relies on `rgba(255, 255, 255, 0.05)` for card fills to maintain transparency. Borders are strictly `1px` at `rgba(255, 255, 255, 0.08)` to define edges without closing off the space.
- **Typography:** Headings use a near-white **#F0F4FF** for maximum legibility against dark backgrounds, while body text uses a muted **#8B9CC8** to reduce eye strain and establish hierarchy.

## Typography

The typographic system prioritizes clarity and a "developer-first" aesthetic. 

**Inter** is the primary typeface for all structural and narrative content. For large headlines, use heavy weights (700-800) with tight letter spacing to create a sense of impact and authority. 

**JetBrains Mono** is utilized for labels, technical metadata, and code snippets. It should always be used for "Status" indicators, tags, and small captions to reinforce the developer persona. Use uppercase for `label-sm` to create a "terminal" or "HUD" look in small UI details.

## Layout & Spacing

This design system uses a **Fluid Grid** model with a maximum container width of 1280px to ensure readability on ultra-wide monitors. 

- **Desktop:** 12-column grid with 24px gutters. Use wide 80px side margins to isolate the content as a "floating" glass console in the center of the screen.
- **Mobile:** 4-column grid with 16px gutters and 20px margins. Glass cards should span the full width of the grid to maximize internal padding.
- **Rhythm:** Spacing follows a strict base-8 scale. Section gaps are intentionally large (120px) to allow the "Deep Navy" background to act as a visual reset between project showcases or skill blocks.

## Elevation & Depth

Depth is created through **Glassmorphism and Glow**, rather than traditional shadows.

1.  **Level 0 (Background):** The `#0A0F1E` base. Use subtle radial gradients of `#7C3AED` (at 5-10% opacity) in the corners of the viewport to create ambient environmental lighting.
2.  **Level 1 (Cards/Panels):** `rgba(255, 255, 255, 0.05)` fill with a **12px backdrop-filter: blur**. This creates the frosted glass look.
3.  **Level 2 (Hover/Active):** When a card or button is interacted with, increase the border opacity to `rgba(255, 255, 255, 0.2)` and add a subtle outer glow using the primary Cyan color (`box-shadow: 0 0 20px rgba(0, 212, 255, 0.15)`).

Avoid any solid black shadows; depth must always feel light-based.

## Shapes

The shape language is **Rounded (0.5rem base)**. 

While the design is "high-tech," completely sharp corners can feel too aggressive. A 0.5rem (8px) radius on cards and containers provides a sophisticated, hardware-like feel, similar to modern smartphone displays or premium laptop chassis. 

- **Standard Cards:** 0.5rem (8px)
- **Buttons & Chips:** 1rem (16px) for a slightly softer, more interactive feel.
- **Inputs:** 0.5rem (8px)

## Components

### Buttons
- **Primary:** Solid Cyan (#00D4FF) fill with dark navy text. On hover, add a 10px Cyan outer glow.
- **Secondary:** Ghost style. `1px solid rgba(255, 255, 255, 0.2)` border, transparent background, white text. On hover, background becomes `rgba(255, 255, 255, 0.05)`.

### Cards
All cards must implement the 12px backdrop-blur. Content inside cards should have 32px of internal padding (`stack-lg`). Use the `label-sm` (JetBrains Mono) for category labels at the top of the card.

### Chips / Tags
Small, pill-shaped indicators. Use a dark fill `rgba(0, 0, 0, 0.3)` with a 1px border colored by the tag's category (e.g., Violet for 'Backend', Cyan for 'Frontend').

### Input Fields
Darker than the card background (`rgba(0,0,0,0.2)`). The border should be nearly invisible until focused, at which point it glows with the Primary Cyan color.

### Technical Lists
For "Skills" or "Experience," use vertical lists where each item is separated by a 1px `rgba(255, 255, 255, 0.05)` line. Use JetBrains Mono for the dates or version numbers on the left-hand side.
