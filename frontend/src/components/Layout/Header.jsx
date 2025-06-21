import React from 'react';
import './Header.css';

const Header = ({ onLogin, onSignUp }) => {
  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    }
  };

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
    }
  };

  return (
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-3">
        <img 
          alt="DevLabs Icon" 
          loading="lazy" 
          width="32" 
          height="32" 
          decoding="async" 
          data-nimg="1" 
          className="rounded-full shadow-lg" 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Photoroom_20250619_201954-x1Dnz3eqks5ega4wIxPoVqzH8GYrPQ.png" 
          style={{color: 'transparent'}}
        />
        <span className="devlabs-wordmark">
          <span className="dev-text">Dev</span>
          <span className="labs-text">Labs</span>
        </span>
      </div>
      
      <nav className="hidden md:flex items-center space-x-8">
        <a href="#" className="nav-link hover:text-brand-metal">Home</a>
        <a href="#" className="nav-link hover:text-brand-metal">Workspaces</a>
        <a href="#" className="nav-link hover:text-brand-metal">About</a>
        <a href="#" className="nav-link hover:text-brand-metal">Contact</a>
      </nav>
      
      <div className="flex items-center space-x-4">
        <button className="btn-3d" onClick={handleLogin}>
          Login
        </button>
        <button className="btn-3d btn-gradient" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Header;