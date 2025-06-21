import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import EnhancedHeader from './EnhancedHeader';
import './EnhancedHeader.css';

// Storybook configuration
export default {
  title: 'Components/Layout/EnhancedHeader',
  component: EnhancedHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A modern, accessible header component with responsive design and comprehensive features.'
      }
    }
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
          <Story />
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            <p>This is demo content to show the header in context.</p>
            <p>Resize the viewport to test responsive behavior.</p>
          </div>
        </div>
      </BrowserRouter>
    )
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Header size variant'
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'compact', 'transparent'],
      description: 'Header style variant'
    },
    logoSrc: {
      control: { type: 'text' },
      description: 'Custom logo source URL'
    },
    logoAlt: {
      control: { type: 'text' },
      description: 'Logo alt text for accessibility'
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes'
    },
    showNavigation: {
      control: { type: 'boolean' },
      description: 'Whether to show navigation menu'
    },
    onLogoClick: {
      action: 'logo-clicked',
      description: 'Callback when logo is clicked'
    }
  }
};

// Default story
export const Default = {
  args: {
    size: 'md',
    variant: 'default',
    showNavigation: true
  }
};

// Size variants
export const SmallSize = {
  args: {
    size: 'sm',
    variant: 'default',
    showNavigation: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with small logo size, suitable for compact layouts.'
      }
    }
  }
};

export const LargeSize = {
  args: {
    size: 'lg',
    variant: 'default',
    showNavigation: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with large logo size, suitable for prominent branding.'
      }
    }
  }
};

// Style variants
export const Compact = {
  args: {
    size: 'md',
    variant: 'compact',
    showNavigation: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact header variant with reduced padding for space-efficient layouts.'
      }
    }
  }
};

export const Transparent = {
  args: {
    size: 'md',
    variant: 'transparent',
    showNavigation: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Transparent header variant with backdrop blur effect, ideal for hero sections.'
      }
    }
  }
};

// Navigation variants
export const WithoutNavigation = {
  args: {
    size: 'md',
    variant: 'default',
    showNavigation: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Header without navigation menu, showing only logo and action buttons.'
      }
    }
  }
};

// Custom logo
export const CustomLogo = {
  args: {
    size: 'md',
    variant: 'default',
    showNavigation: true,
    logoSrc: 'https://via.placeholder.com/120x40/3b82f6/ffffff?text=CUSTOM',
    logoAlt: 'Custom Logo Example'
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with custom logo source and alt text.'
      }
    }
  }
};

// Error handling
export const LogoError = {
  args: {
    size: 'md',
    variant: 'default',
    showNavigation: true,
    logoSrc: 'https://invalid-url-that-will-fail.com/logo.png',
    logoAlt: 'Logo that will fail to load'
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling when logo fails to load. The component will automatically fall back to the default logo.'
      }
    }
  }
};

// Interactive example
export const Interactive = {
  args: {
    size: 'md',
    variant: 'default',
    showNavigation: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive header example. Try clicking the logo and using the mobile menu toggle.'
      }
    }
  },
  render: (args) => {
    const [clickCount, setClickCount] = React.useState(0);
    
    const handleLogoClick = () => {
      setClickCount(prev => prev + 1);
      args.onLogoClick?.();
    };
    
    return (
      <>
        <EnhancedHeader {...args} onLogoClick={handleLogoClick} />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Logo clicked: {clickCount} times</p>
          <p>Try resizing the window to see the mobile menu in action!</p>
        </div>
      </>
    );
  }
};

// Dark theme example
export const DarkTheme = {
  args: {
    size: 'md',
    variant: 'default',
    showNavigation: true,
    className: 'dark-theme-header'
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div 
          data-theme="dark" 
          style={{ 
            minHeight: '100vh', 
            backgroundColor: '#111827',
            color: '#f9fafb'
          }}
        >
          <Story />
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Dark theme example with custom styling.</p>
            <p>The header automatically adapts to the dark theme.</p>
          </div>
        </div>
      </BrowserRouter>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Header with dark theme styling. Uses CSS custom properties for seamless theme switching.'
      }
    }
  }
};

// Mobile viewport simulation
export const MobileView = {
  args: {
    size: 'md',
    variant: 'default',
    showNavigation: true
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Header optimized for mobile viewports. Shows the hamburger menu and responsive layout.'
      }
    }
  }
};

// Accessibility testing
export const AccessibilityTest = {
  args: {
    size: 'md',
    variant: 'default',
    showNavigation: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Header with full accessibility features. Test with keyboard navigation and screen readers.'
      }
    }
  },
  render: (args) => (
    <>
      <EnhancedHeader {...args} />
      <div style={{ padding: '2rem' }}>
        <h2>Accessibility Testing</h2>
        <ul>
          <li>Tab through all interactive elements</li>
          <li>Use Enter/Space to activate buttons</li>
          <li>Test with screen reader</li>
          <li>Verify ARIA labels and roles</li>
          <li>Check focus indicators</li>
        </ul>
        <p>All interactive elements should be keyboard accessible and properly labeled.</p>
      </div>
    </>
  )
};

// Performance testing
export const PerformanceTest = {
  args: {
    size: 'md',
    variant: 'default',
    showNavigation: true
  },
  render: (args) => {
    const [renderCount, setRenderCount] = React.useState(0);
    const [forceUpdate, setForceUpdate] = React.useState(0);
    
    React.useEffect(() => {
      setRenderCount(prev => prev + 1);
    });
    
    return (
      <>
        <EnhancedHeader {...args} />
        <div style={{ padding: '2rem' }}>
          <h2>Performance Testing</h2>
          <p>Render count: {renderCount}</p>
          <button 
            onClick={() => setForceUpdate(prev => prev + 1)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Force Re-render ({forceUpdate})
          </button>
          <p>The header should not re-render unnecessarily due to React.memo optimization.</p>
        </div>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance testing example. The header uses React.memo to prevent unnecessary re-renders.'
      }
    }
  }
};

// All variants showcase
export const AllVariants = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ margin: '0 0 1rem 1rem' }}>Default</h3>
        <EnhancedHeader size="md" variant="default" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 1rem' }}>Compact</h3>
        <EnhancedHeader size="md" variant="compact" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 1rem' }}>Transparent</h3>
        <EnhancedHeader size="md" variant="transparent" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 1rem' }}>Small Size</h3>
        <EnhancedHeader size="sm" variant="default" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 1rem' }}>Large Size</h3>
        <EnhancedHeader size="lg" variant="default" />
      </div>
      <div>
        <h3 style={{ margin: '0 0 1rem 1rem' }}>Without Navigation</h3>
        <EnhancedHeader size="md" variant="default" showNavigation={false} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Showcase of all header variants and sizes for easy comparison.'
      }
    }
  }
};