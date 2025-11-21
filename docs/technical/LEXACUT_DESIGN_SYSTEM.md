# 🎨 LexaCut Design System
## Elegant · Minimal · Classy

---

## 🎯 Core Philosophy

> "Simplicity is the ultimate sophistication" — Leonardo da Vinci

**Principles:**
- ✨ **Elegant**: Clean lines, intentional spacing, refined details
- 🎭 **Minimal**: Only what's necessary, no visual noise
- 💎 **Classy**: Timeless aesthetics, professional feel

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-600: #2563eb;      /* Deep Blue - Main actions */
--primary-500: #3b82f6;      /* Blue - Interactive elements */
--primary-400: #60a5fa;      /* Light Blue - Hover states */
```

### Neutral Colors (Elegant Grays)
```css
--neutral-900: #111827;      /* Almost Black - Primary text */
--neutral-800: #1f2937;      /* Dark Gray - Secondary text */
--neutral-700: #374151;      /* Medium Gray - Tertiary text */
--neutral-600: #4b5563;      /* Gray - Disabled text */
--neutral-500: #6b7280;      /* Light Gray - Subtle text */
--neutral-400: #9ca3af;      /* Very Light Gray - Borders */
--neutral-300: #d1d5db;      /* Pale Gray - Dividers */
--neutral-200: #e5e7eb;      /* Off-white - Backgrounds */
--neutral-100: #f3f4f6;      /* Almost White - Cards */
--neutral-50:  #f9fafb;      /* Pure White - Base */
```

### Accent Colors (Subtle & Refined)
```css
--success-500: #10b981;      /* Green - Success states */
--warning-500: #f59e0b;      /* Amber - Warnings */
--error-500:   #ef4444;      /* Red - Errors */
--info-500:    #6366f1;      /* Indigo - Info */
```

---

## 📐 Typography

### Font Family
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;
```

### Font Sizes (Refined Scale)
```css
--text-xs:   0.75rem;   /* 12px - Small labels */
--text-sm:   0.875rem;  /* 14px - Body text */
--text-base: 1rem;      /* 16px - Default */
--text-lg:   1.125rem;  /* 18px - Emphasized */
--text-xl:   1.25rem;   /* 20px - Headings */
--text-2xl:  1.5rem;    /* 24px - Large headings */
--text-3xl:  1.875rem;  /* 30px - Hero */
```

### Font Weights (Intentional Contrast)
```css
--font-light:    300;   /* Elegant, refined */
--font-normal:   400;   /* Body text */
--font-medium:   500;   /* Subtle emphasis */
--font-semibold: 600;   /* Strong emphasis */
--font-bold:     700;   /* Rare, only for critical */
```

### Line Heights (Breathing Room)
```css
--leading-tight:   1.25;  /* Dense data */
--leading-normal:  1.5;   /* Body text */
--leading-relaxed: 1.75;  /* Comfortable reading */
```

---

## 📏 Spacing (Consistent Rhythm)

### Scale (8px base)
```css
--space-1:  0.25rem;  /* 4px  - Tiny */
--space-2:  0.5rem;   /* 8px  - Small */
--space-3:  0.75rem;  /* 12px - Medium-small */
--space-4:  1rem;     /* 16px - Base */
--space-5:  1.25rem;  /* 20px - Medium */
--space-6:  1.5rem;   /* 24px - Large */
--space-8:  2rem;     /* 32px - Extra large */
--space-10: 2.5rem;   /* 40px - Spacious */
--space-12: 3rem;     /* 48px - Very spacious */
```

---

## 🔲 Border Radius (Soft & Refined)

```css
--radius-sm:   0.25rem;  /* 4px  - Subtle */
--radius-base: 0.5rem;   /* 8px  - Default */
--radius-lg:   0.75rem;  /* 12px - Cards */
--radius-xl:   1rem;     /* 16px - Modals */
--radius-full: 9999px;   /* Pill shapes */
```

---

## 🌫️ Shadows (Subtle Depth)

```css
/* Minimal elevation */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Card elevation */
--shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
               0 1px 2px -1px rgba(0, 0, 0, 0.1);

/* Hover elevation */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -2px rgba(0, 0, 0, 0.1);

/* Modal/Dropdown elevation */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -4px rgba(0, 0, 0, 0.1);

/* Dramatic elevation (rare) */
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 8px 10px -6px rgba(0, 0, 0, 0.1);
```

---

## ⚡ Transitions (Smooth & Natural)

```css
--transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base:   200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-smooth: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🎭 Component Patterns

### Buttons (Minimal & Clear)

**Primary Button:**
- Background: `--primary-600`
- Hover: Slight lift + `--primary-500`
- Active: Subtle press
- Focus: Thin ring, no heavy outline
- Padding: `12px 24px` (generous but not bulky)
- Font: Medium weight, uppercase tracking (subtle)

**Secondary Button:**
- Border: 1px solid `--neutral-300`
- Background: Transparent
- Hover: `--neutral-100` background
- Text: `--neutral-700`

**Danger Button:**
- Minimal red accent, not screaming
- Only used for destructive actions

### Cards (Breathing Space)

```css
background: white;
border: 1px solid var(--neutral-200);
border-radius: var(--radius-lg);
padding: var(--space-6);
box-shadow: var(--shadow-sm);
transition: var(--transition-base);

/* Hover */
box-shadow: var(--shadow-md);
border-color: var(--neutral-300);
```

### Tables (Clean & Scannable)

```css
/* No heavy borders */
border-collapse: collapse;

/* Row */
border-bottom: 1px solid var(--neutral-200);
transition: var(--transition-fast);

/* Hover */
background: var(--neutral-50);

/* Header */
font-weight: 600;
font-size: var(--text-xs);
text-transform: uppercase;
letter-spacing: 0.05em;
color: var(--neutral-600);
padding: var(--space-3) var(--space-4);
border-bottom: 2px solid var(--neutral-300);

/* Cell */
padding: var(--space-4);
color: var(--neutral-800);
```

### Inputs (Refined Focus)

```css
border: 1px solid var(--neutral-300);
border-radius: var(--radius-base);
padding: var(--space-3) var(--space-4);
font-size: var(--text-sm);
transition: var(--transition-fast);

/* Focus (elegant ring) */
border-color: var(--primary-500);
box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
outline: none;
```

### Modals (Centered Elegance)

```css
background: white;
border-radius: var(--radius-xl);
max-width: 640px;
padding: var(--space-8);
box-shadow: var(--shadow-xl);

/* Backdrop */
background: rgba(0, 0, 0, 0.5);
backdrop-filter: blur(4px);
```

---

## 📱 Responsive Breakpoints

```css
--screen-sm: 640px;   /* Mobile */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */
```

---

## 🎯 Iconography Rules

- Use **outlined icons** (not filled) for minimal aesthetic
- Icon size: 20px default, 24px for emphasis, 16px for small
- Icon color: `--neutral-600` default, `--primary-600` for interactive
- Always align icons with text baseline
- Use sparingly — only when they add clarity

---

## ✨ Micro-interactions

### Hover States
- Subtle color shift (10% lighter/darker)
- Gentle lift (2-4px translateY)
- Smooth transition (200ms)

### Active States
- Slight press (1px translateY)
- Brief scale (0.98)
- Instant feedback

### Loading States
- Elegant skeleton screens (no spinners unless necessary)
- Subtle pulse animation
- Gray-on-gray, low contrast

---

## 🚫 What to Avoid

❌ **Heavy borders** — use subtle 1px lines
❌ **Loud colors** — prefer muted, professional tones  
❌ **Sharp corners** — always use border-radius
❌ **Dense spacing** — give elements room to breathe
❌ **Multiple fonts** — stick to one family
❌ **Overuse of bold** — use weight intentionally
❌ **Drop shadows everywhere** — use sparingly
❌ **Animations** — only when they serve purpose
❌ **Gradients** — solid colors are more timeless

---

## ✅ Checklist for Every Component

Before finalizing any component, ensure:

- [ ] Adequate whitespace (minimum 16px padding)
- [ ] Readable text contrast (WCAG AA minimum)
- [ ] Consistent border radius (no mixing values)
- [ ] Smooth transitions on interactive elements
- [ ] Clear visual hierarchy (size, weight, color)
- [ ] Aligned to 8px grid
- [ ] Looks good at all breakpoints
- [ ] No visual clutter

---

## 🎨 Example: The Perfect Button

```css
.btn-primary {
  /* Foundation */
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  
  /* Typography */
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  letter-spacing: 0.025em;
  
  /* Spacing */
  padding: var(--space-3) var(--space-6);
  
  /* Visual */
  background: var(--primary-600);
  color: white;
  border: none;
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-sm);
  
  /* Interaction */
  cursor: pointer;
  transition: all var(--transition-base);
  
  /* States */
  &:hover {
    background: var(--primary-500);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}
```

---

## 📚 References

- **Typography**: [Inter Font](https://rsms.me/inter/)
- **Colors**: Tailwind CSS Palette (refined)
- **Spacing**: 8-point grid system
- **Inspiration**: Linear, Stripe, Notion

---

*Design is not just what it looks like. Design is how it works.*  
— Steve Jobs

---

**Version:** 1.0  
**Last Updated:** 2025-01-25  
**By:** LexaPlus Design Team

