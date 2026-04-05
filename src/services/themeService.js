/**
 * Theme Service
 * Centralized theme management for PerfumierPro
 * Supports multiple themes with color palettes and component styling
 */

const themes = {
  'luxury-dark': {
    name: 'Luxury Dark',
    colors: {
      primary: '#1a1a2e',
      accent: '#d4af37',
      dark: '#0f3460',
      light: '#f0f0f0',
      gray: '#a0a0a0',
      text: '#f0f0f0',
      textSecondary: '#b0b0b0',
      background: '#1a1a2e',
      surface: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(212, 175, 55, 0.2)',
      success: '#27ae60',
      danger: '#e74c3c',
      warning: '#f1c40f',
      info: '#3498db',
    },
    shadows: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
      md: '0 4px 8px rgba(0, 0, 0, 0.2)',
      lg: '0 8px 16px rgba(212, 175, 55, 0.15)',
      xl: '0 16px 32px rgba(0, 0, 0, 0.3)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '12px',
      full: '9999px',
    },
    transitions: {
      fast: '0.15s ease',
      normal: '0.3s ease',
      slow: '0.5s ease',
    },
  },

  'light': {
    name: 'Light',
    colors: {
      primary: '#f5f5f5',
      accent: '#c9a961',
      dark: '#2c3e50',
      light: '#ffffff',
      gray: '#95a5a6',
      text: '#2c3e50',
      textSecondary: '#7f8c8d',
      background: '#ffffff',
      surface: 'rgba(212, 175, 55, 0.05)',
      border: 'rgba(212, 175, 55, 0.3)',
      success: '#27ae60',
      danger: '#e74c3c',
      warning: '#f1c40f',
      info: '#3498db',
    },
    shadows: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
      md: '0 4px 8px rgba(0, 0, 0, 0.1)',
      lg: '0 8px 16px rgba(212, 175, 55, 0.1)',
      xl: '0 16px 32px rgba(0, 0, 0, 0.15)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '12px',
      full: '9999px',
    },
    transitions: {
      fast: '0.15s ease',
      normal: '0.3s ease',
      slow: '0.5s ease',
    },
  },

  'ocean': {
    name: 'Ocean',
    colors: {
      primary: '#001a33',
      accent: '#00a8cc',
      dark: '#000d1a',
      light: '#e8f4f8',
      gray: '#7a9fb3',
      text: '#e8f4f8',
      textSecondary: '#a0b8c8',
      background: '#001a33',
      surface: 'rgba(0, 168, 204, 0.08)',
      border: 'rgba(0, 168, 204, 0.2)',
      success: '#2ecc71',
      danger: '#e74c3c',
      warning: '#f39c12',
      info: '#3498db',
    },
    shadows: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.2)',
      md: '0 4px 8px rgba(0, 0, 0, 0.3)',
      lg: '0 8px 16px rgba(0, 168, 204, 0.15)',
      xl: '0 16px 32px rgba(0, 0, 0, 0.4)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '12px',
      full: '9999px',
    },
    transitions: {
      fast: '0.15s ease',
      normal: '0.3s ease',
      slow: '0.5s ease',
    },
  },

  'rose-gold': {
    name: 'Rose Gold',
    colors: {
      primary: '#3d2817',
      accent: '#d4a574',
      dark: '#1a0f0a',
      light: '#faf7f2',
      gray: '#a08070',
      text: '#faf7f2',
      textSecondary: '#c4b5a0',
      background: '#3d2817',
      surface: 'rgba(212, 165, 116, 0.08)',
      border: 'rgba(212, 165, 116, 0.2)',
      success: '#2ecc71',
      danger: '#e74c3c',
      warning: '#f39c12',
      info: '#9b59b6',
    },
    shadows: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.15)',
      md: '0 4px 8px rgba(0, 0, 0, 0.25)',
      lg: '0 8px 16px rgba(212, 165, 116, 0.15)',
      xl: '0 16px 32px rgba(0, 0, 0, 0.35)',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      xxl: '3rem',
    },
    borderRadius: {
      sm: '4px',
      md: '6px',
      lg: '12px',
      full: '9999px',
    },
    transitions: {
      fast: '0.15s ease',
      normal: '0.3s ease',
      slow: '0.5s ease',
    },
  },
};

/**
 * Get a specific theme
 */
export const getTheme = (themeName = 'luxury-dark') => {
  return themes[themeName] || themes['luxury-dark'];
};

/**
 * Get all available themes
 */
export const getAllThemes = () => {
  return Object.keys(themes).map(key => ({
    id: key,
    ...themes[key]
  }));
};

/**
 * Get theme color
 */
export const getThemeColor = (theme, colorKey) => {
  return theme?.colors?.[colorKey] || '#ffffff';
};

/**
 * Apply theme to CSS variables
 * This allows easy dynamic theme switching via CSS
 */
export const applyThemeCSSVariables = (theme) => {
  const root = document.documentElement;
  
  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  // Transitions
  Object.entries(theme.transitions).forEach(([key, value]) => {
    root.style.setProperty(`--transition-${key}`, value);
  });
};

/**
 * Create inline styles object from theme
 * Useful for styled-components or inline style props
 */
export const createThemedStyles = (theme) => {
  return {
    container: {
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
    },
    card: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      boxShadow: theme.shadows.md,
    },
    button: {
      primary: {
        backgroundColor: theme.colors.accent,
        color: theme.colors.primary,
        border: 'none',
        borderRadius: theme.borderRadius.md,
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        cursor: 'pointer',
        transition: theme.transitions.normal,
      },
      secondary: {
        backgroundColor: 'transparent',
        color: theme.colors.accent,
        border: `2px solid ${theme.colors.accent}`,
        borderRadius: theme.borderRadius.md,
        padding: `calc(${theme.spacing.sm} - 2px) ${theme.spacing.md}`,
        cursor: 'pointer',
        transition: theme.transitions.normal,
      },
    },
    input: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      fontSize: '1rem',
    },
  };
};

export default themes;
