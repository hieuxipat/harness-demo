export const theme = {
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    text: '#212529',
    background: '#ffffff',
    border: '#dee2e6',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  fonts: {
    body: "'Inter', -apple-system, sans-serif",
    heading: "'Inter', -apple-system, sans-serif",
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
  },
};

export type Theme = typeof theme;
