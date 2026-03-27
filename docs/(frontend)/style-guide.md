# Style Guide

## Styling Approach

**Tailwind CSS v4** with utility classes applied directly in JSX. No CSS modules, no styled-components, no CSS-in-JS.

The `cn()` utility from `packages/ui/src/lib/utils.ts` combines `clsx` + `tailwind-merge` for conditional/merged class strings:
```typescript
import { cn } from "../../lib/utils"
cn('base-class', condition && 'conditional-class', className)
```

`cn()` is used in `packages/ui` components. In `apps/web`, className strings are composed inline with template literals:
```typescript
className={`flex overflow-hidden rounded-lg border bg-white shadow-sm ${className}`}
```

---

## Class Naming

No BEM, no CSS modules, no custom class names. All styling is done via Tailwind utility classes only.

Custom CSS variables defined in `app/globals.css`:
- `--font-geist-sans` — applied to `body` via `${geistSans.variable}`
- `--font-geist-mono` — applied to `body` via `${geistMono.variable}`

---

## Component className Extension

Dumb components accept a `className` prop (defaults to `''`) and spread it into their base classes:
```typescript
export function CardRoot({ className = '', children, ...props }: CardRootProps) {
  return <div className={`flex overflow-hidden rounded-lg border bg-white shadow-sm ${className}`} {...props}>
```

This allows consumers to extend styles without overriding defaults.

---

## Theming Patterns

- Color palette follows Tailwind defaults
- Brand accent: `amber-400` (used on Button, focus rings, avatar fallback)
- Background: `bg-white` for cards, `bg-brand-secondary-025` referenced on home page (custom token in Tailwind config — not yet found in config file)
- Text: `text-gray-500` for secondary text, `text-gray-900` for primary, `text-gray-600` for labels
- Error state: `text-red-500` (inline), `text-red-600` (headings), `border-red-200` (containers)

---

## Responsive Patterns

No responsive breakpoint classes observed in current components. Layouts use:
- `min-h-screen flex items-center justify-center` — centered page layouts
- `w-full max-w-[size]` — constrained content width (e.g., `max-w-sm`, `max-w-md`)
- `flex flex-col gap-[n]` — vertical stacking with gap

---

## Fonts

Loaded via `next/font/local` in the root layout:
- `--font-geist-sans`: GeistVF.woff
- `--font-geist-mono`: GeistMonoVF.woff

---

## PostCSS

Tailwind v4 is configured via `@tailwindcss/postcss` plugin in `postcss.config.mjs`. No separate `tailwind.config.js` — Tailwind v4 uses CSS-first configuration.
