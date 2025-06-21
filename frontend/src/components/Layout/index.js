// Layout Components Export

// Enhanced Header Component
export { default as EnhancedHeader } from './EnhancedHeader';

// Type definitions are available in EnhancedHeader.d.ts for TypeScript projects
// Import them directly from the .d.ts file when using TypeScript

// Re-export existing layout components if they exist
// Uncomment and modify as needed based on existing components
// export { default as Navbar } from './Navbar';
// export { default as Footer } from './Footer';
// export { default as Sidebar } from './Sidebar';

// Layout utilities and hooks
// export { useResponsive } from './hooks/useResponsive';
// export { useTheme } from './hooks/useTheme';

// Layout constants
export const LAYOUT_CONSTANTS = {
  HEADER_HEIGHT: {
    sm: '60px',
    md: '72px',
    lg: '84px'
  },
  BREAKPOINTS: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  },
  Z_INDEX: {
    header: 1000,
    sidebar: 999,
    modal: 1100,
    tooltip: 1200
  }
};

// Layout theme configuration
export const LAYOUT_THEMES = {
  light: {
    header: {
      background: '#ffffff',
      border: '#e5e7eb',
      text: '#374151',
      textHover: '#111827'
    }
  },
  dark: {
    header: {
      background: '#1f2937',
      border: '#374151',
      text: '#f9fafb',
      textHover: '#ffffff'
    }
  }
};

// Default export for convenience
export default {
  EnhancedHeader
};