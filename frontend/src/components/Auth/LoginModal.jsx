import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../UI/LoadingSpinner';
import './AuthModal.css';

const LoginModal = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    credential: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (formData.credential.length < 4) {
      errors.credential = 'Username must be at least 4 characters';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await dispatch(loginUser(formData)).unwrap();
      closeModal();
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  const DEMO_CREDENTIAL = 'devone_userone';
  const DEMO_PASSWORD = 'password';

  const handleDemoLogin = async () => {
    try {
      await dispatch(loginUser({ credential: DEMO_CREDENTIAL, password: DEMO_PASSWORD })).unwrap();
      closeModal();
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isButtonDisabled = formData.credential.length < 4 || formData.password.length < 6 || isLoading;

  return (
    <div className="auth-modal">
      <div className="auth-modal-content">
        <button className="close-button" onClick={closeModal}>&times;</button>
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to your account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-alert">
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="credential">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            </label>
            <input
              type="text"
              id="credential"
              name="credential"
              value={formData.credential}
              onChange={handleInputChange}
              placeholder="Enter your username or email"
              className={validationErrors.credential ? 'error' : ''}
              disabled={isLoading}
            />
            {validationErrors.credential && (
              <span className="error-text">{validationErrors.credential}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={validationErrors.password ? 'error' : ''}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {validationErrors.password && (
              <span className="error-text">{validationErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isButtonDisabled}
          >
            {isLoading ? (
              <LoadingSpinner size="small" message="" />
            ) : (
              'Sign In'
            )}
          </button>
          <button
            type="button"
            className="auth-submit-btn demo-btn"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small" message="" />
            ) : (
              'Log in as Demo User'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
