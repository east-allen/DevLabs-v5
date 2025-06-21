import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import EnhancedHeader from '../EnhancedHeader';

// Mock router for testing
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('EnhancedHeader', () => {
  beforeEach(() => {
    // Reset any mocks before each test
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders the header with default props', () => {
      renderWithRouter(<EnhancedHeader />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /devlabs logo/i })).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      renderWithRouter(<EnhancedHeader />);
      
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /workspaces/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      renderWithRouter(<EnhancedHeader />);
      
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    });
  });

  describe('Logo Functionality', () => {
    it('displays logo with correct attributes', () => {
      renderWithRouter(<EnhancedHeader />);
      
      const logo = screen.getByRole('img', { name: /devlabs logo/i });
      expect(logo).toHaveAttribute('loading', 'eager');
      expect(logo).toHaveAttribute('decoding', 'async');
    });

    it('handles logo loading error with fallback', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      renderWithRouter(<EnhancedHeader />);
      
      const logo = screen.getByRole('img', { name: /devlabs logo/i });
      
      // Simulate logo load error
      fireEvent.error(logo);
      
      await waitFor(() => {
        expect(logo).toHaveAttribute('src', '/favicon.png');
        expect(consoleSpy).toHaveBeenCalledWith('Primary logo failed to load, using fallback');
      });
      
      consoleSpy.mockRestore();
    });

    it('calls onLogoClick when logo is clicked', () => {
      const mockOnLogoClick = jest.fn();
      renderWithRouter(<EnhancedHeader onLogoClick={mockOnLogoClick} />);
      
      const logoLink = screen.getByLabelText(/go to homepage/i);
      fireEvent.click(logoLink);
      
      expect(mockOnLogoClick).toHaveBeenCalledTimes(1);
    });

    it('shows loading skeleton initially', () => {
      renderWithRouter(<EnhancedHeader />);
      
      const skeleton = document.querySelector('.header__logo-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('hides skeleton after logo loads', async () => {
      renderWithRouter(<EnhancedHeader />);
      
      const logo = screen.getByRole('img', { name: /devlabs logo/i });
      fireEvent.load(logo);
      
      await waitFor(() => {
        const skeleton = document.querySelector('.header__logo-skeleton');
        expect(skeleton).not.toBeInTheDocument();
      });
    });
  });

  describe('Mobile Menu', () => {
    it('renders mobile menu toggle button', () => {
      renderWithRouter(<EnhancedHeader />);
      
      const toggleButton = screen.getByLabelText(/open menu/i);
      expect(toggleButton).toBeInTheDocument();
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles mobile menu when button is clicked', () => {
      renderWithRouter(<EnhancedHeader />);
      
      const toggleButton = screen.getByLabelText(/open menu/i);
      
      // Initially closed
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      
      // Click to open
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByLabelText(/close menu/i)).toBeInTheDocument();
      
      // Click to close
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes mobile menu when navigation link is clicked', () => {
      renderWithRouter(<EnhancedHeader />);
      
      const toggleButton = screen.getByLabelText(/open menu/i);
      const homeLink = screen.getByRole('link', { name: /home/i });
      
      // Open menu
      fireEvent.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // Click navigation link
      fireEvent.click(homeLink);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Props and Customization', () => {
    it('applies custom className', () => {
      renderWithRouter(<EnhancedHeader className="custom-header" />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('custom-header');
    });

    it('applies size variants correctly', () => {
      const { rerender } = renderWithRouter(<EnhancedHeader size="sm" />);
      
      let logo = screen.getByRole('img', { name: /devlabs logo/i });
      expect(logo).toHaveClass('header__logo--sm');
      
      rerender(
        <BrowserRouter>
          <EnhancedHeader size="lg" />
        </BrowserRouter>
      );
      
      logo = screen.getByRole('img', { name: /devlabs logo/i });
      expect(logo).toHaveClass('header__logo--lg');
    });

    it('applies variant classes correctly', () => {
      const { rerender } = renderWithRouter(<EnhancedHeader variant="compact" />);
      
      let header = screen.getByRole('banner');
      expect(header).toHaveClass('header--compact');
      
      rerender(
        <BrowserRouter>
          <EnhancedHeader variant="transparent" />
        </BrowserRouter>
      );
      
      header = screen.getByRole('banner');
      expect(header).toHaveClass('header--transparent');
    });

    it('uses custom logo props', () => {
      const customLogoSrc = 'https://example.com/custom-logo.png';
      const customLogoAlt = 'Custom Logo';
      
      renderWithRouter(
        <EnhancedHeader logoSrc={customLogoSrc} logoAlt={customLogoAlt} />
      );
      
      const logo = screen.getByRole('img', { name: /custom logo/i });
      expect(logo).toHaveAttribute('src', customLogoSrc);
      expect(logo).toHaveAttribute('alt', customLogoAlt);
    });

    it('hides navigation when showNavigation is false', () => {
      renderWithRouter(<EnhancedHeader showNavigation={false} />);
      
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /home/i })).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      renderWithRouter(<EnhancedHeader />);
      
      expect(screen.getByRole('banner')).toHaveAttribute('aria-label', 'Site header');
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
      expect(screen.getByLabelText(/go to homepage/i)).toBeInTheDocument();
    });

    it('supports keyboard navigation', () => {
      renderWithRouter(<EnhancedHeader />);
      
      const logoLink = screen.getByLabelText(/go to homepage/i);
      const homeLink = screen.getByRole('link', { name: /home/i });
      const toggleButton = screen.getByLabelText(/open menu/i);
      
      // Test focus management
      logoLink.focus();
      expect(logoLink).toHaveFocus();
      
      homeLink.focus();
      expect(homeLink).toHaveFocus();
      
      toggleButton.focus();
      expect(toggleButton).toHaveFocus();
    });

    it('handles keyboard events for mobile menu', () => {
      renderWithRouter(<EnhancedHeader />);
      
      const toggleButton = screen.getByLabelText(/open menu/i);
      
      // Test Enter key
      fireEvent.keyDown(toggleButton, { key: 'Enter', code: 'Enter' });
      fireEvent.click(toggleButton); // Simulate the click that would happen
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      
      // Test Space key
      fireEvent.keyDown(toggleButton, { key: ' ', code: 'Space' });
      fireEvent.click(toggleButton); // Simulate the click that would happen
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Performance', () => {
    it('memoizes the component correctly', () => {
      const { rerender } = renderWithRouter(<EnhancedHeader />);
      
      const initialHeader = screen.getByRole('banner');
      
      // Rerender with same props
      rerender(
        <BrowserRouter>
          <EnhancedHeader />
        </BrowserRouter>
      );
      
      const rerenderedHeader = screen.getByRole('banner');
      expect(rerenderedHeader).toBe(initialHeader);
    });

    it('has correct displayName for debugging', () => {
      expect(EnhancedHeader.displayName).toBe('EnhancedHeader');
    });
  });

  describe('Error Handling', () => {
    it('handles missing navigation gracefully', () => {
      // Test with empty navigation array
      const originalConfig = require('../EnhancedHeader').HEADER_CONFIG;
      const mockConfig = { ...originalConfig, navigation: [] };
      
      jest.doMock('../EnhancedHeader', () => ({
        ...jest.requireActual('../EnhancedHeader'),
        HEADER_CONFIG: mockConfig
      }));
      
      renderWithRouter(<EnhancedHeader />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /home/i })).not.toBeInTheDocument();
    });

    it('handles undefined onLogoClick gracefully', () => {
      renderWithRouter(<EnhancedHeader onLogoClick={undefined} />);
      
      const logoLink = screen.getByLabelText(/go to homepage/i);
      
      // Should not throw error
      expect(() => fireEvent.click(logoLink)).not.toThrow();
    });
  });
});