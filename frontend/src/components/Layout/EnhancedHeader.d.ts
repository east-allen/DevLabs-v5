import { ReactNode } from 'react';

// Navigation item interface
export interface NavigationItem {
  label: string;
  path: string;
  icon?: ReactNode;
  external?: boolean;
}

// Header configuration interface
export interface HeaderConfig {
  logo: {
    src: string;
    alt: string;
    fallbackSrc: string;
  };
  navigation: NavigationItem[];
}

// Component size variants
export type HeaderSize = 'sm' | 'md' | 'lg';

// Component style variants
export type HeaderVariant = 'default' | 'compact' | 'transparent';

// Enhanced Header component props
export interface EnhancedHeaderProps {
  /**
   * Custom logo source URL
   * @default HEADER_CONFIG.logo.src
   */
  logoSrc?: string;
  
  /**
   * Logo alt text for accessibility
   * @default HEADER_CONFIG.logo.alt
   */
  logoAlt?: string;
  
  /**
   * Header size variant
   * @default 'md'
   */
  size?: HeaderSize;
  
  /**
   * Header style variant
   * @default 'default'
   */
  variant?: HeaderVariant;
  
  /**
   * Callback function when logo is clicked
   */
  onLogoClick?: () => void;
  
  /**
   * Additional CSS class names
   * @default ''
   */
  className?: string;
  
  /**
   * Whether to show navigation menu
   * @default true
   */
  showNavigation?: boolean;
  
  /**
   * Custom navigation items (overrides default)
   */
  customNavigation?: NavigationItem[];
  
  /**
   * Whether to show action buttons (Login/Sign Up)
   * @default true
   */
  showActions?: boolean;
  
  /**
   * Custom action buttons content
   */
  customActions?: ReactNode;
  
  /**
   * Theme variant for styling
   */
  theme?: 'light' | 'dark' | 'auto';
  
  /**
   * Whether header should be sticky
   * @default true
   */
  sticky?: boolean;
  
  /**
   * Custom z-index value
   */
  zIndex?: number;
  
  /**
   * Callback when mobile menu state changes
   */
  onMobileMenuToggle?: (isOpen: boolean) => void;
  
  /**
   * Whether to enable backdrop blur effect
   * @default true
   */
  enableBackdropBlur?: boolean;
  
  /**
   * Custom breakpoint for mobile menu (in pixels)
   * @default 768
   */
  mobileBreakpoint?: number;
}

// Component ref interface
export interface EnhancedHeaderRef {
  /**
   * Get current mobile menu state
   */
  getMobileMenuState: () => boolean;
  
  /**
   * Programmatically toggle mobile menu
   */
  toggleMobileMenu: () => void;
  
  /**
   * Close mobile menu
   */
  closeMobileMenu: () => void;
  
  /**
   * Get header element reference
   */
  getHeaderElement: () => HTMLElement | null;
}

// CSS class name mappings
export interface HeaderClassNames {
  header: string;
  container: string;
  logoSection: string;
  logoLink: string;
  logo: string;
  logoSkeleton: string;
  nav: string;
  navList: string;
  navItem: string;
  navLink: string;
  mobileToggle: string;
  hamburger: string;
  hamburgerLine: string;
  actions: string;
  btn: string;
  btnPrimary: string;
  btnSecondary: string;
}

// Theme configuration
export interface HeaderTheme {
  colors: {
    background: string;
    border: string;
    text: string;
    textHover: string;
    primary: string;
    primaryHover: string;
  };
  spacing: {
    padding: string;
    gap: string;
  };
  typography: {
    fontWeight: string;
    fontSize: string;
  };
  effects: {
    shadow: string;
    blur: string;
    transition: string;
  };
}

// Export the main component
declare const EnhancedHeader: React.ForwardRefExoticComponent<
  EnhancedHeaderProps & React.RefAttributes<EnhancedHeaderRef>
>;

export default EnhancedHeader;

// Utility type for component variants
export type HeaderVariants = {
  size: Record<HeaderSize, string>;
  variant: Record<HeaderVariant, string>;
};

// Event handler types
export type HeaderEventHandlers = {
  onLogoClick?: () => void;
  onNavigationClick?: (item: NavigationItem) => void;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
};

// Configuration for responsive behavior
export interface ResponsiveConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  behavior: {
    collapseMobileMenu: boolean;
    hideActionsOnMobile: boolean;
    stackNavigationOnMobile: boolean;
  };
}

// Animation configuration
export interface AnimationConfig {
  duration: number;
  easing: string;
  enableReducedMotion: boolean;
}

// Accessibility configuration
export interface AccessibilityConfig {
  announceMenuState: boolean;
  focusManagement: boolean;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
}