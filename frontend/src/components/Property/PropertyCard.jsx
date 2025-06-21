import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const {
    id,
    title,
    description,
    price_per_night,
    location,
    max_guests,
    image_url,
    rating = 4.5, // Default rating if not provided
    reviews_count = 0
  } = property;

  // Use image_url directly without fallback
  const imageUrl = image_url;

  return (
    <Link to={`/property/${id}`} className="property-card">
      <div className="property-image">
        <img src={imageUrl} alt={title} />
        <div className="property-rating">
          <FontAwesomeIcon icon={faStar} className="star-icon" />
          <span>{rating.toFixed(1)}</span>
          {reviews_count > 0 && (
            <span className="reviews-count">({reviews_count})</span>
          )}
        </div>
      </div>
      
      <div className="property-content">
        <div className="property-location">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
          <span>{location}</span>
        </div>
        
        <h3 className="property-title">{title}</h3>
        
        <p className="property-description">
          {description.length > 100 
            ? `${description.substring(0, 100)}...` 
            : description
          }
        </p>
        
        <div className="property-details">
          <div className="property-guests">
            <FontAwesomeIcon icon={faUsers} className="guests-icon" />
            <span>{max_guests} guest{max_guests !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="property-price">
            <span className="price">${price_per_night}</span>
            <span className="price-period">/ night</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;