import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, clearError } from '../store/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faEdit, 
  faSave, 
  faTimes,
  faCamera,
  faKey,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    avatar: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const errors = {};
    
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    } else if (profileData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!profileData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (profileData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profileData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Phone number is invalid';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      return;
    }
    
    try {
      await dispatch(updateProfile({
        name: profileData.name.trim(),
        email: profileData.email,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio
      })).unwrap();
      
      setIsEditing(false);
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    try {
      await dispatch(updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })).unwrap();
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
      alert('Password updated successfully!');
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || '',
      avatar: user.avatar || ''
    });
    setValidationErrors({});
    setIsEditing(false);
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
    setShowPasswordForm(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="avatar-section">
            <div className="avatar-container">
              <img 
                src={profileData.avatar || '/api/placeholder/120/120'} 
                alt="Profile Avatar"
                className="avatar"
              />
              {isEditing && (
                <label className="avatar-upload">
                  <FontAwesomeIcon icon={faCamera} />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarChange}
                    hidden
                  />
                </label>
              )}
            </div>
            <div className="user-info">
              <h2>{user.name}</h2>
              <p className="user-email">{user.email}</p>
              <p className="member-since">Member since {new Date(user.createdAt || Date.now()).getFullYear()}</p>
            </div>
          </div>

          {error && (
            <div className="error-alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-section">
              <div className="section-header">
                <h3>Personal Information</h3>
                {!isEditing ? (
                  <button 
                    type="button" 
                    className="edit-btn"
                    onClick={() => setIsEditing(true)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={handleCancel}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="save-btn"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <LoadingSpinner size="small" message="" />
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faSave} />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={validationErrors.name ? 'error' : ''}
                  />
                  {validationErrors.name && (
                    <span className="error-text">{validationErrors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={validationErrors.email ? 'error' : ''}
                  />
                  {validationErrors.email && (
                    <span className="error-text">{validationErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <FontAwesomeIcon icon={faPhone} className="input-icon" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="+1 (555) 123-4567"
                    className={validationErrors.phone ? 'error' : ''}
                  />
                  {validationErrors.phone && (
                    <span className="error-text">{validationErrors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profileData.location}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="bio">
                  About Me
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </div>
          </form>

          <div className="form-section">
            <div className="section-header">
              <h3>Security</h3>
              <button 
                type="button" 
                className="edit-btn"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                <FontAwesomeIcon icon={faKey} />
                Change Password
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">
                    Current Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={passwordErrors.currentPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <span className="error-text">{passwordErrors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">
                    New Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={passwordErrors.newPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <span className="error-text">{passwordErrors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={passwordErrors.confirmPassword ? 'error' : ''}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <span className="error-text">{passwordErrors.confirmPassword}</span>
                  )}
                </div>

                <div className="password-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={handlePasswordCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="small" message="" />
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;