---
version: alpha
name: Cham.ai — Quiet Ledger
description: Visual identity for Cham.ai, an AI-powered wealth collective for savings circles, investment pools and gig escrow — an achromatic, Fixa-inspired system.
colors:
  primary: "#0f0f0f"
  primary-inverse: "#ffffff"
  surface: "#ffffff"
  surface-cream: "#EAEAEA"
  surface-muted: "#E2E2E2"
  surface-dark: "#151515"
  surface-raised-dark: "#1A1A1A"
  on-primary: "#ffffff"
  on-surface: "#0f0f0f"
  text-strong: "#0f0f0f"
  text-muted: "#868686"

  link: "#0099ff"
  success-container: "#e9fdf7"
  success: "#007155"
  destructive: "#dc2626"
  paypal: "#0070e0"
typography:
  headline-display:
    fontFamily: Switzer
    fontSize: 96px
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Switzer
    fontSize: 64px
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: -0.045em
  headline-md:
    fontFamily: Switzer
    fontSize: 32px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Switzer
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.03em
  accent-serif:
    fontFamily: Instrument Serif
    fontWeight: 400
    lineHeight: 0.95
  money-xl:
    fontFamily: Switzer
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.03em
    fontFeature: "tnum"
  body-lg:
    fontFamily: Switzer
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.4
  body-md:
    fontFamily: Switzer
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Switzer
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
  label-lg:
    fontFamily: Switzer
    fontSize: 15px
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: -0.02em
  label-sm:
    fontFamily: Switzer
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.2
  badge:
    fontFamily: Switzer
    fontSize: 14px
    fontWeight: 500
    lineHeight: 0.95
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 24px
  section: 40px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  section-gap: 160px
  base: 8px
  gutter: 60px
  container-max: 1320px
components:
  logo-mark:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    size: 28px
  button-primary:
    backgroundColor: "{colors.primary-inverse}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 42px
    padding: 16px
  button-primary-hover:
    backgroundColor: "#f0f0f0"
    textColor: "{colors.on-surface}"
  button-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 42px
    padding: 16px
  button-dark-hover:
    backgroundColor: "#2a2a2a"
    textColor: "{colors.on-primary}"
  button-ghost:
    backgroundColor: "#DEDEDE"
    textColor: "{colors.text-strong}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 42px
    padding: 16px
  button-on-dark:
    backgroundColor: "#2C2C2C"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.lg}"
    height: 42px
    padding: 16px
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-strong}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    height: 44px
    padding: 14px
  chip:
    backgroundColor: "#DEDEDE"
    textColor: "#525252"
    typography: "{typography.badge}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 12px
  chip-dark:
    backgroundColor: "#212121"
    textColor: "{colors.on-primary}"
    typography: "{typography.badge}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 12px
  card-light:
    backgroundColor: "#DEDEDE"
    textColor: "{colors.text-strong}"
    rounded: "{rounded.xl}"
    padding: 40px
  card-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.section}"
    padding: 64px
  panel-dark:
    backgroundColor: "{colors.surface-raised-dark}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: 40px
  glass-panel:
    backgroundColor: "#06070c"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
  progress-fill:
    backgroundColor: "{colors.primary-inverse}"
    rounded: "{rounded.full}"
    height: 6px
  page-panel:
    backgroundColor: "{colors.surface-cream}"
    rounded: "{rounded.section}"
    padding: 160px
  band-muted:
    backgroundColor: "{colors.surface-muted}"
    rounded: "{rounded.section}"
    padding: 160px
  text-link:
    textColor: "{colors.link}"
    typography: "{typography.body-md}"
  status-success:
    backgroundColor: "{colors.success-container}"
    textColor: "{colors.success}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
    height: 24px
    padding: 8px
  status-destructive:
    textColor: "{colors.destructive}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
  badge-paypal:
    textColor: "{colors.paypal}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.md}"
  caption:
    textColor: "{colors.text-muted}"
    typography: "{typography.body-sm}"
---

## Overview

Cham.ai is where people pool money they already trust each other with — a savings
circle, a chama, a tontine — and give it software-grade discipline. The identity
holds two truths at once: the warmth of money passed around a table, and the
precision of a settlement terminal that moves it instantly via PayPal and PYUSD.

The style is **quiet-ledger achromatic**: a Fixa-inspired system built on cream
(#EAEAEA) and deep charcoal (#151515), with every surface, border and shadow
replaced by an alpha ladder of black and white. There is no brand accent — the
photography of the product *is* the UI mockups, the glass and the charts. A single
azure (#0099ff) marks inline text links only; green and red survive exclusively as
semantic form/status signals. One serif italic (Instrument Serif) interrupts the
Switzer grotesque on key headline words — the only flourish the system allows.

## Colors

- **Primary (#0f0f0f):** action black — dark buttons, headings, icon tiles.
- **Primary inverse (#ffffff):** the Fixa button — white fill, black label, 42px
  tall, 12px radius. On dark sections it inverts to white/10 fills.
- **Surfaces:** `surface-cream` (#EAEAEA) is the page; `surface` (#ffffff) lifts
  cards, nav pill and auth panels; `surface-muted` (#E2E2E2) alternates bands;
  `surface-dark` (#151515) is the hero, security band and footer-dark; and
  `surface-raised-dark` (#1A1A1A) sits *inside* dark cards (footer panel).
- **Alpha ladder:** every subdivision uses black at 5/10/20/50/60% on light, white
  at 5/10/15/55% on dark. No colored tints, ever.
- **Text:** `text-strong` (#0f0f0f) and `text-muted` (#868686) on light; white and
  white/50 on dark. `link` (#0099ff) is the only saturated value and only on inline
  text links.
- **Semantic only:** `success` / `success-container` and `destructive` appear in
  form validation, status chips and money deltas — never as decoration.
- **paypal** (#0070e0) is reserved for PayPal rail references if a mark is needed.

## Typography

Two families, cleanly divided by job.

- **Switzer** (400/500/600, Fontshare) is the voice: a neutral grotesque that goes
  from a 96px hero (400, -0.03em, 0.95 line-height) down to 13px captions. Headings
  are weight 500 — never 700/800; emphasis comes from size and tracking, not mass.
  Money figures use `money-xl` with tabular numerals (`tnum`).
- **Instrument Serif italic** (`accent-serif`) styles exactly one word inside a
  headline — "together.", "circle." — at display size. Never in body copy, labels
  or buttons.
- Section badges (`.chip`) are 14px/500 in dark gray (#525252, AA-clean) on a
  black/5 fill with 8px radius; on dark they invert to white/5 fills with white
  text.

## Layout

A **1320px container** with 60px desktop gutters (48px tablet, 20px mobile).
Sections stack as *panels*: cream panels overlap the band above them with a 40px
top radius and a -40px pull, so the page reads as layered cards rather than a
continuous scroll. Vertical rhythm is generous: 160px section padding on desktop
(112px tablet, 96px mobile), 12–16px inside components.

The landing runs: dark hero → cream panel (statement, features, how, demo card) →
dark band (sticky scroll-spy security, gradient testimonials) → cream panel
(pricing, FAQ, giant CTA, footer card). Asymmetric grids (0.8fr / 1.2fr) keep the
sticky security section honest; copy blocks cap at ~60ch.

## Elevation & Depth

**Zero box-shadows.** Depth comes from surface contrast, 1px alpha borders and —
on the hero product mock only — one `glass-panel` liquid-glass layer (WebGL
refraction via liquidGL, CSS `backdrop-blur` fallback).

- Light cards separate from cream with a black/5 fill — no border needed.
- Dark cards separate from night with white/10 hairlines.
- Overlays (dialogs, dropdowns) rely on their border and opaque fill, never shadow.
- Never stack a glass layer on a card that already has one.

## Shapes

The radius ladder is strict: **4px** icon glyphs inside tiles, **8px** chips and
icon tiles, **12px** buttons, inputs and the nav pill, **24px** cards, **40px**
section panels and the hero demo card, **9999px** only for the floating nav pill,
its mobile menu and true circles (avatars, status dots). Never mix two container
radii in one component; never round a card to 16px "because it looks nicer".

## Components

### Buttons

Three families, all 42px tall, `label-lg` type, 12px radius. `button-primary`
(white fill, black label) is the default on light *and* dark — it becomes the
contrast element. `button-dark` (black fill, white label) serves forms and light
cards. `button-on-dark` (white/10 fill) is the quiet alternative on night
surfaces. Hover shifts fill opacity only; focus draws a 2px ring with offset.

### Cards & Surfaces

`card-light` (black/5 fill, 24px radius, 40px padding) holds features, quotes and
pricing on cream; the featured tier inverts to `card-dark` (night fill, white
text). `panel-dark` (24px radius) is the footer. `card-dark` with a 40px radius
wraps large demonstrations (the demo flow). Interactive cards change border or
fill opacity on hover — never elevation.

### Inputs

`input-field`: white surface, ink text, 12px radius, 44px height, black/10 border
deepening to black/40 on focus (2px ring at 2px offset). Errors use a red border
plus helper text below — never color alone.

### Chips, Badges & Status

`chip` / `chip-dark` introduce every section (max one per section). Status chips
in the product use an 8px radius with the semantic green/red pairs; color is
always paired with text or an icon.

### Data Displays

Progress is white fill on a white/10 track (black fill on light cards). Money is
always `money-xl` or body text with `tnum`. Deltas pair black/white with an arrow
icon and the explicit period — "+12.4% this cycle".

## Do's and Don'ts

- Do keep every surface achromatic — cream, white, charcoal, alpha grays
- Don't introduce a brand accent color; azure is for inline links only
- Do use Instrument Serif italic for exactly one word in a headline
- Don't set serif type in body copy, labels or buttons
- Do follow the 8 / 12 / 24 / 40 radius ladder without exceptions
- Don't add a box-shadow anywhere — use fills, borders and alpha ladders
- Do keep green/red for semantic states (validation, status, money deltas) only
- Don't use decorative colored icon tiles in the dashboard
- Do set all currency figures with tabular numerals
- Don't stack two glass or blur layers in one view
- Do maintain WCAG AA contrast (4.5:1) for text on any fill
- Don't put white text on cream or black text on night without an intermediate
