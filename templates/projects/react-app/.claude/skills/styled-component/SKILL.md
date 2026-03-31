---
name: styled-component
description: "Create styled-components following theme conventions"
---

# Styled-Components

Create styled-components following team conventions.

## When to use

When creating or updating component styles.

## Instructions

### Theme Usage

Always use theme values instead of hardcoded values:

- Colors: theme.colors.primary, theme.colors.text
- Spacing: theme.spacing.sm, theme.spacing.md
- Typography: theme.fonts.body, theme.fonts.heading
- Breakpoints: theme.breakpoints.mobile, theme.breakpoints.tablet

### Patterns

**Responsive styles:** Use theme breakpoints with media queries
**Variants:** Use props to create component variants (primary/secondary/danger)
**Composition:** Extend existing styled components with styled(BaseComponent)
**Animations:** Use keyframes from styled-components, keep animations subtle

### Naming

- PascalCase for styled components: `StyledButton`, `Container`, `Title`
- Descriptive names based on purpose, not appearance
- Prefix with `Styled` only when conflicting with logic components

### Do NOT

- Use inline styles (style prop)
- Hardcode colors, spacing, or font sizes
- Create global styles outside theme
- Nest more than 3 levels deep
