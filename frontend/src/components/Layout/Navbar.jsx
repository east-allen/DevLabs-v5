import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src="/favicon.png" 
            alt="DevLabs Favicon" 
            className="navbar-favicon"
            style={{
              height: '22px',
              width: '22px',
              objectFit: 'contain',
              marginRight: '8px'
            }}
          />
          <img 
            src="/devlabs-logo.jpg" 
            alt="DevLabs" 
            className="navbar-wordmark"
            style={{
              height: '34px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </Link>

        <div className="navbar-menu">
          <div className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/bookings" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  My Reservations
                </Link>
                <Link to="/create-property" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  List Your Space
                </Link>
                <div className="user-menu">
                  <button className="user-button">
                    <FontAwesomeIcon icon={faUser} />
                    <span>{user?.name || 'User'}</span>
                  </button>
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                      Profile
                    </Link>
                    <Link to="/bookings" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                      My Reservations
                    </Link>
                    <Link to="/create-property" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                      List Your Space
                    </Link>
                    <button onClick={handleLogout} className="dropdown-link logout-btn">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="nav-link signup-link" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;