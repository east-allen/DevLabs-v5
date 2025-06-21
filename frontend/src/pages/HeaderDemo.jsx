import React from 'react';
import Header from '../components/Layout/Header';
import './HeaderDemo.css';

const HeaderDemo = () => {
  const handleLogin = () => {
    console.log('Login clicked');
    alert('Login functionality would be implemented here');
  };

  const handleSignUp = () => {
    console.log('Sign Up clicked');
    alert('Sign Up functionality would be implemented here');
  };

  return (
    <div className="header-demo">
      <div className="demo-container">
        <h1>Header Component</h1>
        <p>This header component uses the same color scheme as the navbar for consistency.</p>
        
        <div className="demo-section">
          <h2>Header with Navbar Colors</h2>
          <div className="header-wrapper">
            <Header onLogin={handleLogin} onSignUp={handleSignUp} />
          </div>
        </div>
        
        <div className="demo-info">
          <h3>Features:</h3>
          <ul>
            <li>Matches navbar color scheme perfectly</li>
            <li>Responsive design with mobile breakpoints</li>
            <li>3D metallic button styling</li>
            <li>Interactive navigation links</li>
            <li>Accessible focus states</li>
            <li>Smooth hover animations</li>
            <li>DevLabs branding with logo and wordmark</li>
            <li>High contrast and reduced motion support</li>
          </ul>
          
          <h3>Design Elements:</h3>
          <ul>
            <li>Background: Dark with backdrop blur</li>
            <li>Logo: Rounded with shadow effects</li>
            <li>Wordmark: Platinum gradient with gold accent</li>
            <li>Navigation: Hover effects with gold underlines</li>
            <li>Login Button: Steel to gunmetal gradient</li>
            <li>Sign Up Button: Gold to copper gradient</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeaderDemo;