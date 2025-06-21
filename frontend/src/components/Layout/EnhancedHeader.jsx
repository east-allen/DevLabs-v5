import React, { useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import './EnhancedHeader.css';

// Configuration constants
const HEADER_CONFIG = {
  logo: {
    src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Photoroom_20250619_201954-x1Dnz3eqks5ega4wIxPoVqzH8GYrPQ.png',
    alt: 'DevLabs Logo',
    fallbackSrc: '/favicon.png'
  },
  navigation: [
    { label: 'Home', path: '/' },
    { label: 'Workspaces', path: '/workspaces' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ]
};

const EnhancedHeader = memo(({
  logoSrc = HEADER_CONFIG.logo.src,
  logoAlt = HEADER_CONFIG.logo.alt,
  size = 'md',
  variant = 'default',
  onLogoClick,
  className = '',
  showNavigation = true
}) => {
  const [logoError, setLogoError] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logo loading errors
  const handleLogoError = useCallback((e) => {
    console.warn('Primary logo failed to load, using fallback');
    setLogoError(true);
    e.target.src = HEADER_CONFIG.logo.fallbackSrc;
  }, []);

  const handleLogoLoad = useCallback(() => {
    setLogoLoaded(true);
  }, []);

  const handleLogoClick = useCallback(() => {
    if (onLogoClick) {
      onLogoClick();
    }
  }, [onLogoClick]);

  const toggleMobileMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Size classes mapping
  const sizeClasses = {
    sm: 'header-logo--sm',
    md: 'header-logo--md',
    lg: 'header-logo--lg'
  };

  const variantClasses = {
    default: 'header--default',
    compact: 'header--compact',
    transparent: 'header--transparent'
  };

  return (
    <header 
      className={`header ${variantClasses[variant]} ${className}`}
      role="banner"
      aria-label="Site header"
    >
      <div className="header__container">
        {/* Logo Section */}
        <div className="header__logo-section">
          <Link 
            to="/" 
            className="header__logo-link"
            onClick={handleLogoClick}
            aria-label="Go to homepage"
          >
            <img 
              src={logoSrc}
              alt={logoAlt}
              className={`header__logo ${sizeClasses[size]} ${
                logoLoaded ? 'header__logo--loaded' : 'header__logo--loading'
              }`}
              onError={handleLogoError}
              onLoad={handleLogoLoad}
              loading="eager"
              decoding="async"
              role="img"
            />
            {!logoLoaded && (
              <div className="header__logo-skeleton" aria-hidden="true" />
            )}
          </Link>
        </div>

        {/* Navigation Section */}
        {showNavigation && (
          <nav className="header__nav" role="navigation" aria-label="Main navigation">
            <ul className={`header__nav-list ${isMenuOpen ? 'header__nav-list--open' : ''}`}>
              {HEADER_CONFIG.navigation.map((item, index) => (
                <li key={item.path} className="header__nav-item">
                  <Link 
                    to={item.path}
                    className="header__nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="header__mobile-toggle"
              onClick={toggleMobileMenu}
              aria-expanded={isMenuOpen}
              aria-controls="main-navigation"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="header__hamburger">
                <span className="header__hamburger-line"></span>
                <span className="header__hamburger-line"></span>
                <span className="header__hamburger-line"></span>
              </span>
            </button>
          </nav>
        )}

        {/* Action Buttons */}
        <div className="header__actions">
          <Link to="/login" className="header__btn header__btn--secondary">
            Login
          </Link>
          <Link to="/register" className="header__btn header__btn--primary">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
});

EnhancedHeader.displayName = 'EnhancedHeader';

export default EnhancedHeader;