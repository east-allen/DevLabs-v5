import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../store/slices/authSlice';
import { User, LogOut, Settings, Home, Plus, User as UserIcon, Briefcase, HelpCircle } from 'lucide-react';
import './UserMenu.css';

const UserMenu = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Close menu when pressing Escape key
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setIsOpen(false);
      navigate('/');
      if (onClose) onClose();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
    if (onClose) onClose();
  };

  if (!user) return null;

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="user-menu-button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <img 
            src={user.avatarUrl} 
            alt={`${user.firstName} ${user.lastName}`}
            className="user-avatar"
          />
        ) : (
          <UserIcon className="user-icon" />
        )}
      </button>

      {isOpen && (
        <div className="user-menu-dropdown" role="menu" aria-orientation="vertical">
          <div className="user-info">
            <h3 className="user-name" title={`${user.firstName} ${user.lastName}`}>
              {user.firstName} {user.lastName}
            </h3>
            <p className="user-email" title={user.email}>
              {user.email}
            </p>
          </div>
          
          <div className="menu-section">
            <button 
              onClick={() => handleNavigation('/create-listing')}
              className="menu-item"
              role="menuitem"
            >
              <Plus className="menu-item-icon" />
              Create New Listing
            </button>
          </div>
          
          <div className="menu-section">
            <button 
              onClick={() => handleNavigation('/profile')}
              className="menu-item"
              role="menuitem"
            >
              <User className="menu-item-icon" />
              Your Profile
            </button>
            
            <button 
              onClick={() => handleNavigation('/my-spots')}
              className="menu-item"
              role="menuitem"
            >
              <Briefcase className="menu-item-icon" />
              My Spots
            </button>
            
            <button 
              onClick={() => handleNavigation('/settings')}
              className="menu-item"
              role="menuitem"
            >
              <Settings className="menu-item-icon" />
              Settings
            </button>
            
            <button 
              onClick={() => handleNavigation('/help')}
              className="menu-item"
              role="menuitem"
            >
              <HelpCircle className="menu-item-icon" />
              Help & Support
            </button>
          </div>
          
          <div className="menu-section">
            <button
              onClick={handleLogout}
              className="menu-item destructive"
              role="menuitem"
            >
              <LogOut className="menu-item-icon" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
