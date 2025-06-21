import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotById } from '../store/slices/spotsSlice';
import { createBooking } from '../store/slices/bookingSlice';
import { fetchReviewsBySpotId, createReview, deleteReview } from '../store/slices/reviewsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faMapMarkerAlt, 
  faUsers, 
  faBed, 
  faBath, 
  faWifi, 
  faParking, 
  faSwimmingPool, 
  faDumbbell,
  faUtensils,
  faTv,
  faSnowflake,
  faFire,
  faPaw,
  faSmokingBan,
  faCar,
  faGamepad,
  faHotTub,
  faMountain,
  faTree,
  faWater,
  faBalanceScale,
  faLeaf,
  faChevronLeft,
  faChevronRight,
  faHeart,
  faShare,
  faPlus,
  faTimes,
  faTrash,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import './PropertyDetails.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedProperty, loading, error } = useSelector(state => state.spots);
  const { loading: bookingLoading } = useSelector(state => state.bookings);
  const { reviews, loading: reviewsLoading } = useSelector(state => state.reviews);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    review: '',
    stars: 5
  });
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchSpotById(id));
      dispatch(fetchReviewsBySpotId(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut && selectedProperty) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (nights > 0) {
        setNumberOfNights(nights);
        setTotalPrice(nights * selectedProperty.price);
      } else {
        setNumberOfNights(0);
        setTotalPrice(0);
      }
    }
  }, [bookingData.checkIn, bookingData.checkOut, selectedProperty]);

  const handleImageNavigation = (direction) => {
    if (!selectedProperty?.images) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === selectedProperty.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProperty.images.length - 1 : prev - 1
      );
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    if (new Date(bookingData.checkIn) >= new Date(bookingData.checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }
    
    try {
      await dispatch(createBooking({
        spotId: selectedProperty.id,
        startDate: bookingData.checkIn,
        endDate: bookingData.checkOut,
        guests: bookingData.guests,
        totalPrice
      })).unwrap();
      
      alert('Booking created successfully!');
      navigate('/bookings');
    } catch (error) {
      alert('Failed to create booking. Please try again.');
    }
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': faWifi,
      'Pool': faSwimmingPool,
      'Gym': faDumbbell,
      'Parking': faParking,
      'Kitchen': faUtensils,
      'Air Conditioning': faSnowflake,
      'Pet Friendly': faPaw,
      'Balcony': faBalanceScale,
      'Garden': faLeaf,
      'Hot Tub': faHotTub
    };
    return iconMap[amenity] || faLeaf;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProperty.title,
        text: selectedProperty.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      await dispatch(createReview({ spotId: id, reviewData })).unwrap();
      setShowReviewModal(false);
      setReviewData({ review: '', stars: 5 });
      // Refresh reviews
      dispatch(fetchReviewsBySpotId(id));
    } catch (error) {
      console.error('Failed to create review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await dispatch(deleteReview(reviewId)).unwrap();
        dispatch(fetchReviewsBySpotId(id));
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesomeIcon
        key={index}
        icon={faStar}
        className={`star ${index < rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
        onClick={interactive && onStarClick ? () => onStarClick(index + 1) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <div className="property-details-container">
        <LoadingSpinner size="large" message="Loading property details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-details-container">
        <div className="error-message">
          <h2>Error loading property</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <div className="property-details-container">
        <div className="error-message">
          <h2>Property not found</h2>
          <p>The property you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="back-btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const userHasReviewed = reviews.some(review => review.userId === user?.id);

  return (
    <div className="property-details-container">
      <div className="property-header">
        <div className="property-title-section">
          <h1>{selectedProperty.title}</h1>
          <div className="property-meta">
            <div className="rating">
              <FontAwesomeIcon icon={faStar} />
              <span>{selectedProperty.rating}</span>
              <span className="review-count">({selectedProperty.reviewCount} reviews)</span>
            </div>
            <div className="location">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{selectedProperty.location}</span>
            </div>
          </div>
        </div>
        
        <div className="property-actions">
          <button 
            className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <button className="share-btn" onClick={handleShare}>
            <FontAwesomeIcon icon={faShare} />
            Share
          </button>
        </div>
      </div>

      <div className="property-images">
        <div className="main-image">
          <img 
            src={selectedProperty.images?.[currentImageIndex] || '/api/placeholder/800/500'} 
            alt={selectedProperty.title}
          />
          {selectedProperty.images?.length > 1 && (
            <>
              <button 
                className="image-nav prev"
                onClick={() => handleImageNavigation('prev')}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              <button 
                className="image-nav next"
                onClick={() => handleImageNavigation('next')}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </>
          )}
        </div>
        
        {selectedProperty.images?.length > 1 && (
          <div className="image-thumbnails">
            {selectedProperty.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${selectedProperty.title} ${index + 1}`}
                className={index === currentImageIndex ? 'active' : ''}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="property-content">
        <div className="property-info">
          <div className="property-details">
            <div className="property-stats">
              <div className="stat">
                <FontAwesomeIcon icon={faUsers} />
                <span>{selectedProperty.maxGuests} guests</span>
              </div>
              <div className="stat">
                <FontAwesomeIcon icon={faBed} />
                <span>{selectedProperty.bedrooms} bedrooms</span>
              </div>
              <div className="stat">
                <FontAwesomeIcon icon={faBath} />
                <span>{selectedProperty.bathrooms} bathrooms</span>
              </div>
            </div>
            
            <div className="property-description">
              <h2>About this place</h2>
              <p>{selectedProperty.description}</p>
            </div>
            
            {selectedProperty.amenities?.length > 0 && (
              <div className="property-amenities">
                <h2>Amenities</h2>
                <div className="amenities-grid">
                  {selectedProperty.amenities.map((amenity, index) => (
                    <div key={index} className="amenity">
                      <FontAwesomeIcon icon={getAmenityIcon(amenity)} />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="reviews-section">
              <div className="reviews-header">
                <h2>
                  <FontAwesomeIcon icon={faStar} className="star filled" />
                  {selectedProperty.avgRating ? selectedProperty.avgRating.toFixed(1) : 'No rating'} • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </h2>
                {isAuthenticated && !userHasReviewed && (
                  <button 
                    className="add-review-btn"
                    onClick={() => setShowReviewModal(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Review
                  </button>
                )}
              </div>
              
              {reviewsLoading ? (
                <LoadingSpinner size="small" message="Loading reviews..." />
              ) : (
                <div className="reviews-list">
                  {reviews.length === 0 ? (
                    <p className="no-reviews">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="review-item">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <img 
                              src={review.User?.profileImage || '/api/placeholder/40/40'} 
                              alt={review.User?.firstName}
                              className="reviewer-avatar"
                            />
                            <div>
                              <h4>{review.User?.firstName} {review.User?.lastName}</h4>
                              <div className="review-rating">
                                {renderStars(review.stars)}
                              </div>
                            </div>
                          </div>
                          <div className="review-actions">
                            <span className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            {user?.id === review.userId && (
                              <button 
                                className="delete-review-btn"
                                onClick={() => handleDeleteReview(review.id)}
                                title="Delete review"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="review-text">{review.review}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="host-info">
              <h2>Meet your host</h2>
              <div className="host-card">
                <img 
                  src={selectedProperty.host?.avatar || '/api/placeholder/60/60'} 
                  alt={selectedProperty.host?.name}
                  className="host-avatar"
                />
                <div className="host-details">
                  <h3>{selectedProperty.host?.name}</h3>
                  <p>Host since {selectedProperty.host?.joinDate}</p>
                  <div className="host-stats">
                    <span>{selectedProperty.host?.reviewCount} reviews</span>
                    <span>•</span>
                    <span>{selectedProperty.host?.rating} rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="booking-section">
          <div className="booking-card">
            <div className="price-info">
              <span className="price">${selectedProperty.price}</span>
              <span className="period">per night</span>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="date-inputs">
                <div className="input-group">
                  <label>Check-in</label>
                  <input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData(prev => ({ ...prev, checkIn: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Check-out</label>
                  <input
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData(prev => ({ ...prev, checkOut: e.target.value }))}
                    min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label>Guests</label>
                <select
                  value={bookingData.guests}
                  onChange={(e) => setBookingData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                >
                  {Array.from({ length: selectedProperty.maxGuests }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} guest{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              {numberOfNights > 0 && (
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>${selectedProperty.price} × {numberOfNights} nights</span>
                    <span>${selectedProperty.price * numberOfNights}</span>
                  </div>
                  <div className="price-row">
                    <span>Service fee</span>
                    <span>${Math.round(totalPrice * 0.1)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>${totalPrice + Math.round(totalPrice * 0.1)}</span>
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                className="book-btn"
                disabled={bookingLoading || !bookingData.checkIn || !bookingData.checkOut}
              >
                {bookingLoading ? (
                  <LoadingSpinner size="small" message="" />
                ) : (
                  isAuthenticated ? 'Book Now' : 'Login to Book'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add a Review</h3>
              <button 
                className="close-modal-btn"
                onClick={() => setShowReviewModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="rating-input">
                <label>Rating</label>
                <div className="stars-input">
                  {renderStars(reviewData.stars, true, (rating) => 
                    setReviewData(prev => ({ ...prev, stars: rating }))
                  )}
                </div>
              </div>
              
              <div className="review-text-input">
                <label htmlFor="review-text">Your Review</label>
                <textarea
                  id="review-text"
                  value={reviewData.review}
                  onChange={(e) => setReviewData(prev => ({ ...prev, review: e.target.value }))}
                  placeholder="Share your experience..."
                  rows={4}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-review-btn"
                  disabled={!reviewData.review.trim()}
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;