import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import LoginModal from '../Auth/LoginModal';
import SignUpModal from '../Auth/SignupModal';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
    setIsMenuOpen(false);
  };

  const closeSignUpModal = () => {
    setIsSignUpModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
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
            <span className="devlabs-wordmark">
              <span className="dev-text">Dev</span>
              <span className="labs-text">Labs</span>
            </span>
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
                  <div className="user-menu" ref={userMenuRef}>
                    <button className="user-button" onClick={toggleUserMenu}>
                      <FontAwesomeIcon icon={faUser} />
                      <span>{user?.firstName || 'User'}</span>
                    </button>
                    {isUserMenuOpen && (
                      <div className="user-dropdown">
                        <div className="user-info">
                          <p>Hello, {user?.firstName}</p>
                          <p>{user?.email}</p>
                        </div>
                        <Link to="/profile" className="dropdown-link" onClick={() => setIsUserMenuOpen(false)}>
                          Profile
                        </Link>
                        <Link to="/bookings" className="dropdown-link" onClick={() => setIsUserMenuOpen(false)}>
                          My Reservations
                        </Link>
                        <Link to="/create-property" className="dropdown-link" onClick={() => setIsUserMenuOpen(false)}>
                          List Your Space
                        </Link>
                        <button onClick={handleLogout} className="dropdown-link logout-btn">
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button onClick={openLoginModal} className="nav-link">
                    Login
                  </button>
                  <button onClick={openSignUpModal} className="nav-link signup-link">
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <button className="mobile-menu-toggle" onClick={toggleMenu}>
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>
          </div>
        </div>
      </nav>
      {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />}
      {isSignUpModalOpen && <SignUpModal closeModal={closeSignUpModal} />}
    </>
  );
};

export default Navbar;