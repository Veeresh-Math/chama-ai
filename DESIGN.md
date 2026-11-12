# DESIGN.md — Cham.ai Visual System

## Tokens (globals.css)
- Background: `0 0% 91.8%` (cream `#EAEAEA`), dark `0 0% 8.2%`
- Foreground: `0 0% 6%` (#0f0f0f), dark `0 0% 98%`
- Primary: `0 0% 6%` (black), dark `0 0% 100%` (white)
- Border: `0 0% 84%`, dark `0 0% 100% / 0.1`
- Ring: `0 0% 6%` / dark `0 0% 98%`
- Radius: `12px`
- Destructive: `0 72% 41%`

## Typography
- Sans: Switzer (400/500/600), fallback Inter/system-ui
- Serif: Instrument Serif (italic accents)
- Base: 16px, line-height 1.3
- Headings: `text-wrap: balance` / `text-pretty`, tracking-tight, `tabular-nums` for numbers
- Ellipsis: `…` not `...`; curly quotes `“ ”`; non-breaking spaces for brand/units

## Components
- **Button** (`ui/button.tsx`): cva variants default/destructive/outline/secondary/ghost/link; sizes default/sm/lg/icon; `focus-visible:ring-1`, `focus-visible:outline-none`
- **Card** (`ui/card.tsx`): rounded-xl border bg-card shadow
- **Dialog** (`ui/dialog.tsx`): Radix, animate-in/out, close button with `sr-only` label
- **Drawer** (`ui/drawer.tsx`): Vaul, bottom sheet, grab handle
- **Badge** (`ui/badge.tsx`): default/secondary/destructive/outline/success/warning
- **Avatar** (`ui/avatar.tsx`): Radix, image + fallback
- **CtaLink** (`landing/primitives.tsx`): Next Link, primary/ghost/onDark variants, focus-visible ring

## Layout
- Container: `mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-[60px]`
- Sections: `py-28 sm:py-40`, `scroll-mt-[120px]` for anchor navigation
- Hero: `bg-night`, clamp typography 2.75rem–6rem
- Sidebar dashboard: `w-64`, collapsible to `w-20`

## Motion
- GSAP (FadeIn, ScrollReveal, StaggerContainer): power3.out, opacity + transform only
- `prefers-reduced-motion`: globals.css sets `animation-duration: 0.01ms`, `transition-duration: 0.01ms`, scroll-behavior auto
- Avoid `transition: all`; list properties explicitly
- Honor `prefers-reduced-motion` in all GSAP tweens (currently missing — see audit fixes)

## Accessibility rules (enforced)
- Icon buttons need `aria-label`
- Decorative icons/SVGs need `aria-hidden="true"`
- Form controls need `<label>` or `aria-label`
- `<button>` for actions, `<a>`/`<Link>` for navigation
- Images need `alt` (or `alt=""` decorative)
- Async updates need `aria-live="polite"`
- Focus visible rings; never `outline-none` without replacement
- Skip link to main content
- `overscroll-behavior: contain` on modals/drawers/sheets
- `touch-action: manipulation`

## Dark mode
- `color-scheme: dark` not yet set on `<html>` (recommended)
- `<meta name="theme-color">` matches page background (`#EAEAEA`)
