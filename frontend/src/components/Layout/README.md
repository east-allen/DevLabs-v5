# Enhanced Header Component

A modern, accessible, and highly customizable header component for the DevLabs application. Built with React, featuring responsive design, error handling, performance optimizations, and comprehensive accessibility support.

## Features

- 🎨 **Modern Design**: Clean, professional styling with CSS custom properties
- 📱 **Responsive**: Mobile-first design with collapsible navigation
- ♿ **Accessible**: WCAG 2.1 compliant with proper ARIA labels and keyboard navigation
- 🚀 **Performance**: Memoized component with optimized re-renders
- 🎯 **Error Handling**: Graceful fallbacks for logo loading failures
- 🌙 **Theme Support**: Light/dark theme compatibility
- 🧪 **Well Tested**: Comprehensive test coverage
- 📝 **TypeScript**: Full type definitions included

## Installation

```bash
# The component is already included in the DevLabs project
# No additional installation required
```

## Basic Usage

```jsx
import React from 'react';
import EnhancedHeader from './components/Layout/EnhancedHeader';

function App() {
  return (
    <div className="app">
      <EnhancedHeader />
      {/* Your app content */}
    </div>
  );
}
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `logoSrc` | `string` | Default logo URL | Custom logo source URL |
| `logoAlt` | `string` | "DevLabs Logo" | Logo alt text for accessibility |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Header size variant |
| `variant` | `'default' \| 'compact' \| 'transparent'` | `'default'` | Header style variant |
| `onLogoClick` | `() => void` | `undefined` | Callback when logo is clicked |
| `className` | `string` | `''` | Additional CSS classes |
| `showNavigation` | `boolean` | `true` | Whether to show navigation menu |

## Examples

### Basic Header

```jsx
<EnhancedHeader />
```

### Compact Header with Custom Logo

```jsx
<EnhancedHeader 
  variant="compact"
  logoSrc="/custom-logo.png"
  logoAlt="My Custom Logo"
  size="sm"
/>
```

### Transparent Header with Custom Click Handler

```jsx
<EnhancedHeader 
  variant="transparent"
  onLogoClick={() => console.log('Logo clicked!')}
  className="hero-header"
/>
```

### Header Without Navigation

```jsx
<EnhancedHeader 
  showNavigation={false}
  size="lg"
/>
```

## Styling

### CSS Custom Properties

The component uses CSS custom properties for easy theming:

```css
:root {
  --header-bg: #ffffff;
  --header-border: #e5e7eb;
  --header-text: #374151;
  --header-text-hover: #111827;
  --header-logo-size-sm: 32px;
  --header-logo-size-md: 40px;
  --header-logo-size-lg: 48px;
  --header-padding: 1rem 1.5rem;
  --header-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --header-transition: all 0.2s ease-in-out;
  --header-z-index: 1000;
}
```

### Dark Theme Support

```css
[data-theme="dark"] {
  --header-bg: #1f2937;
  --header-border: #374151;
  --header-text: #f9fafb;
  --header-text-hover: #ffffff;
}
```

### Custom Styling

```css
/* Custom header styles */
.my-custom-header {
  --header-bg: #f8fafc;
  --header-border: #cbd5e1;
}

.my-custom-header .header__logo {
  filter: brightness(1.1);
}
```

## Accessibility Features

- **Semantic HTML**: Uses proper `<header>`, `<nav>`, and `<img>` elements
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard support with focus management
- **Focus Indicators**: Visible focus states for all interactive elements
- **Screen Reader Support**: Proper announcements for menu state changes
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## Performance Optimizations

- **React.memo**: Prevents unnecessary re-renders
- **useCallback**: Memoized event handlers
- **Lazy Loading**: Optimized image loading with proper attributes
- **CSS Containment**: Efficient rendering with CSS contain property
- **Minimal Bundle**: Tree-shakeable imports

## Error Handling

- **Logo Fallback**: Automatic fallback to default logo on load error
- **Graceful Degradation**: Component works even with missing props
- **Console Warnings**: Helpful development warnings
- **Error Boundaries**: Compatible with React error boundaries

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **Fallbacks**: Graceful degradation for older browsers

## Testing

Run the test suite:

```bash
npm test -- EnhancedHeader.test.jsx
```

Test coverage includes:
- Component rendering
- Props handling
- User interactions
- Accessibility features
- Error scenarios
- Performance characteristics

## Migration Guide

### From Basic Header

```jsx
// Before
<header className="header">
  <img src="logo.png" alt="Logo" />
  <nav>...</nav>
</header>

// After
<EnhancedHeader logoSrc="logo.png" />
```

### From Custom Header

```jsx
// Before
<CustomHeader 
  logo="logo.png"
  navigation={navItems}
  theme="dark"
/>

// After
<EnhancedHeader 
  logoSrc="logo.png"
  className="dark-theme"
/>
```

## Best Practices

### Performance

```jsx
// ✅ Good: Memoize callback functions
const handleLogoClick = useCallback(() => {
  // Handle click
}, []);

<EnhancedHeader onLogoClick={handleLogoClick} />

// ❌ Bad: Inline functions cause re-renders
<EnhancedHeader onLogoClick={() => handleClick()} />
```

### Accessibility

```jsx
// ✅ Good: Descriptive alt text
<EnhancedHeader 
  logoAlt="DevLabs - Developer Workspace Platform"
/>

// ❌ Bad: Generic alt text
<EnhancedHeader logoAlt="Logo" />
```

### Styling

```jsx
// ✅ Good: Use CSS custom properties
.custom-header {
  --header-bg: var(--brand-primary);
}

// ❌ Bad: Override component styles directly
.custom-header .header {
  background: #ff0000 !important;
}
```

## Troubleshooting

### Common Issues

**Logo not loading:**
- Check if the logo URL is accessible
- Verify CORS settings for external images
- Check browser console for error messages

**Mobile menu not working:**
- Ensure JavaScript is enabled
- Check for CSS conflicts with mobile styles
- Verify viewport meta tag is present

**Styling issues:**
- Check CSS custom property values
- Verify theme class is applied to document
- Look for conflicting CSS rules

### Debug Mode

```jsx
// Enable debug logging
<EnhancedHeader 
  onLogoClick={() => console.log('Logo clicked')}
  className="debug-header"
/>
```

## Contributing

When contributing to the Enhanced Header component:

1. **Follow the existing code style**
2. **Add tests for new features**
3. **Update TypeScript definitions**
4. **Document breaking changes**
5. **Test accessibility features**

## Changelog

### v1.0.0
- Initial release with full feature set
- Responsive design implementation
- Accessibility compliance
- Performance optimizations
- Comprehensive testing

## License

This component is part of the DevLabs project and follows the same license terms.

---

**Need help?** Check the [DevLabs documentation](../../../docs/) or open an issue in the project repository.