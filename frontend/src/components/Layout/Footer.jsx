import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src="/favicon.png" 
                alt="DevLabs Favicon" 
                className="footer-favicon"
                style={{
                  height: '20px',
                  width: '20px',
                  objectFit: 'contain',
                  marginRight: '8px'
                }}
              />
              <img 
                src="/devlabs-logo.jpg" 
                alt="DevLabs" 
                className="footer-wordmark"
                style={{
                  height: '28px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p>Empowering innovation through collaborative workspaces. Connect, create, and transform ideas into reality in inspiring environments designed for productivity.</p>
            <div className="social-links">
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="social-link">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="#">Help Center</Link></li>
              <li><Link to="#">Workspace Guidelines</Link></li>
              <li><Link to="#">Booking Policies</Link></li>
              <li><Link to="#">Contact Support</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li><Link to="#">Innovation Network</Link></li>
              <li><Link to="#">Accessibility</Link></li>
              <li><Link to="#">Member Referrals</Link></li>
              <li><Link to="#">Corporate Plans</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Space Providers</h4>
            <ul>
              <li><Link to="/create-property">List Your Workspace</Link></li>
              <li><Link to="#">Workspace Optimization</Link></li>
              <li><Link to="#">Best Practices</Link></li>
              <li><Link to="#">Provider Resources</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>About</h4>
            <ul>
              <li><Link to="#">Newsroom</Link></li>
              <li><Link to="#">Learn About New Features</Link></li>
              <li><Link to="#">Letter from Our Founders</Link></li>
              <li><Link to="#">Careers</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 DevLabs Innovation Workspace Platform. All rights reserved.</p>
            <div className="footer-links">
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Service</Link>
              <Link to="#">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;