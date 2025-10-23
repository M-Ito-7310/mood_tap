# Phase 2: UI Foundation & Design System

**Estimated Time:** 2.0-2.5 hours
**Priority:** P0 (Critical Path)
**Recommended Agent:** general-purpose

## Overview

This phase establishes the foundational UI architecture for MoodTap, including design tokens, layout components, and the basic mood button structure. This creates a consistent, maintainable design system that all future components will build upon.

## Objectives

1. Define comprehensive design tokens (colors, spacing, typography)
2. Create base layout with gradient background
3. Build foundational mood button component
4. Implement responsive container system

## Prerequisites

- Phase 1 (Project Foundation) completed
- Next.js 16 with TypeScript configured
- Tailwind CSS v4 installed and working

## Tickets in This Phase

### UI-001: Define Design Tokens
**Priority:** P0
**Estimated Time:** 30-45 minutes

Create a centralized design token system using Tailwind CSS v4's custom properties.

**Tasks:**
1. Create `src/styles/design-tokens.css` with CSS custom properties
2. Define color palette:
   - Mood colors (5 tiers: very-bad, bad, neutral, good, very-good)
   - Background gradients
   - Text colors (primary, secondary, muted)
   - UI accents
3. Define spacing scale (consistent with Tailwind)
4. Define typography scale (font sizes, weights, line heights)
5. Import tokens in global styles

**Acceptance Criteria:**
- All colors defined as CSS custom properties
- Tokens work with Tailwind's utility classes
- Design system is consistent and documented

---

### UI-002: Create Base Layout Component
**Priority:** P0
**Estimated Time:** 30-45 minutes

Build the main layout component that wraps all pages with gradient background.

**Tasks:**
1. Create `src/components/layout/BaseLayout.tsx`
2. Implement gradient background using design tokens
3. Add responsive container with proper padding
4. Include metadata support for SEO
5. Test on multiple viewport sizes

**Acceptance Criteria:**
- Gradient background displays correctly
- Layout is responsive (mobile-first)
- Content is properly contained and centered
- Works on iOS, Android, and desktop browsers

---

### UI-003: Build Mood Button Component
**Priority:** P0
**Estimated Time:** 45-60 minutes

Create the foundational mood button component (without interactions yet).

**Tasks:**
1. Create `src/components/mood/MoodButton.tsx`
2. Define button props interface (mood level, label, onClick)
3. Style button with:
   - Circular shape
   - Touch-optimized size (min 48x48px)
   - Basic color mapping to mood levels
   - Accessible focus states
4. Add accessibility attributes (ARIA labels, roles)
5. Test rendering all 5 mood levels

**Acceptance Criteria:**
- Button renders correctly for all 5 mood levels
- Meets WCAG 2.1 touch target size (44x44px minimum)
- Has proper ARIA labels and keyboard navigation
- Visual design matches minimalist aesthetic

---

### UI-004: Implement Responsive Container Layout
**Priority:** P0
**Estimated Time:** 30-45 minutes

Create a responsive container system for consistent content layout.

**Tasks:**
1. Create `src/components/layout/Container.tsx`
2. Implement responsive padding and max-width
3. Add variants for different content types (narrow, wide, full)
4. Test on mobile, tablet, and desktop
5. Document usage patterns

**Acceptance Criteria:**
- Container adapts to all screen sizes
- Content is never cramped or too wide
- Consistent spacing across breakpoints
- Easy to use with clear API

## Design Specifications

### Color Palette

```css
/* Mood Colors */
--mood-very-bad: #EF4444;      /* Red 500 */
--mood-bad: #F97316;           /* Orange 500 */
--mood-neutral: #EAB308;       /* Yellow 500 */
--mood-good: #22C55E;          /* Green 500 */
--mood-very-good: #3B82F6;     /* Blue 500 */

/* Background Gradient */
--bg-gradient-from: #1E293B;   /* Slate 800 */
--bg-gradient-to: #0F172A;     /* Slate 900 */

/* Text Colors */
--text-primary: #F8FAFC;       /* Slate 50 */
--text-secondary: #CBD5E1;     /* Slate 300 */
--text-muted: #64748B;         /* Slate 500 */
```

### Spacing Scale

Follow Tailwind's default spacing scale:
- `xs`: 0.5rem (8px)
- `sm`: 0.75rem (12px)
- `md`: 1rem (16px)
- `lg`: 1.5rem (24px)
- `xl`: 2rem (32px)
- `2xl`: 3rem (48px)

### Typography

```css
/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## File Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── BaseLayout.tsx      # Main app layout
│   │   └── Container.tsx       # Responsive container
│   └── mood/
│       └── MoodButton.tsx      # Mood selection button
├── styles/
│   ├── design-tokens.css       # CSS custom properties
│   └── globals.css             # Global styles
└── types/
    └── mood.ts                 # (Created in Phase 3)
```

## Testing Checklist

- [ ] Design tokens load correctly in all browsers
- [ ] Gradient background renders smoothly
- [ ] Layout is responsive from 320px to 1920px width
- [ ] Mood buttons are touch-friendly on mobile
- [ ] All components have proper TypeScript types
- [ ] ARIA labels are present and accurate
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Focus states are visible and clear

## Common Issues & Solutions

### Issue: Tailwind utilities not working with custom properties
**Solution:** Ensure Tailwind CSS v4 is configured to recognize custom properties in `tailwind.config.ts`

### Issue: Gradient not smooth on mobile
**Solution:** Use `background-attachment: fixed` sparingly; prefer simple gradients

### Issue: Buttons too small on touch devices
**Solution:** Maintain minimum 44x44px touch targets per WCAG 2.1 guidelines

## Next Steps

After completing Phase 2:
1. Use `/check-progress` to verify all P0 tickets are done
2. Review design system with stakeholders
3. Proceed to Phase 3: Mood Recording UI
4. Use `/start-feature FEAT-001` to begin implementing mood types

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [Next.js 16 App Router](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)

## Notes

- Keep components simple and composable
- Prioritize accessibility from the start
- Test on real devices, not just emulators
- Document any design decisions for future reference
