import React from 'react';
import FeaturedWorkspaces from '../components/Workspace/FeaturedWorkspaces';
import './FeaturedWorkspacesDemo.css';

const FeaturedWorkspacesDemo = () => {
  const handleRetry = async () => {
    console.log('Retry function called');
    // Simulate API retry logic
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Retry completed');
        resolve();
      }, 2000);
    });
  };

  return (
    <div className="featured-workspaces-demo">
      <div className="demo-container">
        <h1>Featured Workspaces Error Component</h1>
        <p>This component displays error states with the same color scheme as the navbar.</p>
        
        <div className="demo-section">
          <h2>Error State with Retry Button</h2>
          <FeaturedWorkspaces onRetry={handleRetry} />
        </div>
        
        <div className="demo-info">
          <h3>Features:</h3>
          <ul>
            <li>Matches navbar color scheme</li>
            <li>Error state with clear messaging</li>
            <li>Interactive retry button with loading state</li>
            <li>Accessible design with proper focus states</li>
            <li>Responsive layout</li>
            <li>Smooth animations and hover effects</li>
            <li>High contrast and reduced motion support</li>
          </ul>
          
          <h3>Color Scheme:</h3>
          <ul>
            <li>Container: Glass morphism with backdrop blur</li>
            <li>Error background: Semi-transparent red with blur</li>
            <li>Button: Metallic gradient (steel to gunmetal)</li>
            <li>Text: Platinum metallic colors</li>
            <li>Icons: Error red and metallic accents</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeaturedWorkspacesDemo;