---
name: ui-shopify
description: >
  Shopify Polaris design system + UI/UX design intelligence tổng quát.
  Dùng khi implement giao diện Shopify embedded app, storefront widget,
  hoặc cần tra cứu accessibility, layout, typography, color palette.
  Gộp từ Xipat shopify-design-guideline + ui-ux-pro-max.
---

# UI Shopify — Design System & UX Intelligence

Comprehensive design guide cho Shopify apps. Kết hợp Shopify Polaris patterns với UI/UX best practices tổng quát.

## Khi nào dùng

- Implement giao diện Shopify embedded app (Frontend)
- Implement storefront widget/banner (Storefront)
- Chọn color palette, typography, layout patterns
- Review code cho UX issues
- Accessibility audit

## Phần 1: Shopify Polaris & App Design

### Polaris Component Patterns

Khi implement giao diện cho Shopify embedded app, tuân theo:
- **Polaris components** — dùng Polaris components thay vì custom HTML/CSS
- **Shopify Admin UI conventions** — layout, navigation, content structure
- **App Bridge integration** — communication giữa app và Shopify admin

Chi tiết patterns và examples: xem `references/apps.md`

### Key Polaris Principles

1. **Content first** — UI phục vụ content, không ngược lại
2. **Consistency** — giữ nhất quán với Shopify admin look & feel
3. **Responsive** — embedded app phải responsive trong Shopify admin iframe
4. **Accessible** — tuân theo WCAG 2.1 AA standards

## Phần 2: UI/UX Rules (theo Priority)

### 1. Accessibility (CRITICAL)

- `color-contrast` — Minimum 4.5:1 ratio cho normal text
- `focus-states` — Visible focus rings trên interactive elements
- `alt-text` — Descriptive alt text cho meaningful images
- `aria-labels` — aria-label cho icon-only buttons
- `keyboard-nav` — Tab order matches visual order
- `form-labels` — Use label with for attribute

### 2. Touch & Interaction (CRITICAL)

- `touch-target-size` ��� Minimum 44x44px touch targets
- `hover-vs-tap` — Use click/tap cho primary interactions
- `loading-buttons` — Disable button during async operations
- `error-feedback` — Clear error messages near problem
- `cursor-pointer` — Add cursor-pointer cho clickable elements

### 3. Performance (HIGH)

- `image-optimization` — Use WebP, srcset, lazy loading
- `reduced-motion` — Check prefers-reduced-motion
- `content-jumping` — Reserve space cho async content

### 4. Layout & Responsive (HIGH)

- `viewport-meta` — width=device-width initial-scale=1
- `readable-font-size` �� Minimum 16px body text on mobile
- `horizontal-scroll` — Content phải fit viewport width
- `z-index-management` — Define z-index scale (10, 20, 30, 50)

### 5. Typography & Color (MEDIUM)

- `line-height` — Use 1.5-1.75 cho body text
- `line-length` — Limit 65-75 characters per line
- `font-pairing` — Match heading/body font personalities

### 6. Animation (MEDIUM)

- `duration-timing` — 150-300ms cho micro-interactions
- `transform-performance` — Use transform/opacity, không dùng width/height
- `loading-states` �� Skeleton screens hoặc spinners

### 7. Style Selection (MEDIUM)

- `style-match` — Match style to product type
- `consistency` — Same style across all pages
- `no-emoji-icons` — Use SVG icons, không dùng emojis

## Pre-delivery Checklist

Trước khi hoàn thành UI implementation:

- [ ] Visual quality: đúng design, consistent spacing
- [ ] Interaction: hover states, loading states, error states
- [ ] Light/dark mode support (nếu applicable)
- [ ] Layout responsive trong Shopify admin iframe
- [ ] Accessibility: contrast, focus, keyboard nav, aria-labels
- [ ] Polaris components used correctly (không custom khi Polaris có sẵn)

## References

- `references/apps.md` — Shopify app design patterns chi tiết
- `references/index.md` — Shopify design system index
