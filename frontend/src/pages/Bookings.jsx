import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserBookings, cancelBooking, updateBooking } from '../store/slices/bookingSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faUsers, 
  faStar, 
  faEdit, 
  faTrash, 
  faEye,
  faFilter,
  faSort,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import './Bookings.css';

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading, error } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);
  
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [sortBy, setSortBy] = useState('date_desc'); // date_desc, date_asc, price_desc, price_asc
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bookingToEdit, setBookingToEdit] = useState(null);
  const [editData, setEditData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  useEffect(() => {
    if (user) {
      dispatch(fetchUserBookings());
    }
  }, [dispatch, user]);

  const getBookingStatus = (booking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    if (booking.status === 'cancelled') return 'cancelled';
    if (now > checkOut) return 'completed';
    if (now >= checkIn && now <= checkOut) return 'active';
    return 'upcoming';
  };

  const filterBookings = (bookings) => {
    return bookings.filter(booking => {
      const status = getBookingStatus(booking);
      
      switch (filter) {
        case 'upcoming':
          return status === 'upcoming' || status === 'active';
        case 'past':
          return status === 'completed';
        case 'cancelled':
          return status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const sortBookings = (bookings) => {
    return [...bookings].sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.checkIn) - new Date(b.checkIn);
        case 'date_desc':
          return new Date(b.checkIn) - new Date(a.checkIn);
        case 'price_asc':
          return a.totalPrice - b.totalPrice;
        case 'price_desc':
          return b.totalPrice - a.totalPrice;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  };

  const filteredAndSortedBookings = sortBookings(filterBookings(bookings));

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    
    try {
      await dispatch(cancelBooking(bookingToCancel.id)).unwrap();
      setShowCancelModal(false);
      setBookingToCancel(null);
    } catch (error) {
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleEditBooking = async (e) => {
    e.preventDefault();
    
    if (!bookingToEdit) return;
    
    if (new Date(editData.checkIn) >= new Date(editData.checkOut)) {
      alert('Check-out date must be after check-in date');
      return;
    }
    
    try {
      await dispatch(updateBooking({
        id: bookingToEdit.id,
        checkIn: editData.checkIn,
        checkOut: editData.checkOut,
        guests: editData.guests
      })).unwrap();
      
      setShowEditModal(false);
      setBookingToEdit(null);
      setEditData({ checkIn: '', checkOut: '', guests: 1 });
    } catch (error) {
      alert('Failed to update booking. Please try again.');
    }
  };

  const openEditModal = (booking) => {
    setBookingToEdit(booking);
    setEditData({
      checkIn: booking.checkIn.split('T')[0],
      checkOut: booking.checkOut.split('T')[0],
      guests: booking.guests
    });
    setShowEditModal(true);
  };

  const canCancelBooking = (booking) => {
    const status = getBookingStatus(booking);
    const checkIn = new Date(booking.checkIn);
    const now = new Date();
    const daysDiff = (checkIn - now) / (1000 * 60 * 60 * 24);
    
    return status === 'upcoming' && daysDiff > 1; // Can cancel if more than 1 day before check-in
  };

  const canEditBooking = (booking) => {
    const status = getBookingStatus(booking);
    const checkIn = new Date(booking.checkIn);
    const now = new Date();
    const daysDiff = (checkIn - now) / (1000 * 60 * 60 * 24);
    
    return status === 'upcoming' && daysDiff > 2; // Can edit if more than 2 days before check-in
  };

  const getStatusColor = (booking) => {
    const status = getBookingStatus(booking);
    
    switch (status) {
      case 'upcoming': return '#4CAF50';
      case 'active': return '#FF9800';
      case 'completed': return '#9E9E9E';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (booking) => {
    const status = getBookingStatus(booking);
    
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  if (!user) {
    return (
      <div className="bookings-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>Please log in to view your bookings.</p>
          <Link to="/login" className="login-link">Go to Login</Link>
        </div>
      </div>
    );
  }

  if (isLoading && bookings.length === 0) {
    return (
      <div className="bookings-container">
        <LoadingSpinner size="large" message="Loading your bookings..." />
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <div className="header-content">
          <h1>My Reservations</h1>
          <p>Manage your workspace bookings</p>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <p>Error loading bookings: {error}</p>
          <button 
            onClick={() => dispatch(fetchUserBookings())}
            className="retry-btn"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="bookings-controls">
        <div className="filter-controls">
          <FontAwesomeIcon icon={faFilter} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Reservations</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="sort-controls">
          <FontAwesomeIcon icon={faSort} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="price_desc">Highest Price</option>
            <option value="price_asc">Lowest Price</option>
          </select>
        </div>
      </div>

      {filteredAndSortedBookings.length === 0 ? (
        <div className="no-bookings">
          <h3>No reservations found</h3>
          <p>
            {filter === 'all' 
              ? "You haven't made any workspace reservations yet." 
              : `No ${filter} reservations found.`
            }
          </p>
          <Link to="/" className="browse-btn">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="bookings-grid">
          {filteredAndSortedBookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-image">
                <img 
                  src={booking.property?.images?.[0] || '/api/placeholder/300/200'} 
                  alt={booking.property?.title}
                />
                <div 
                  className="booking-status"
                  style={{ backgroundColor: getStatusColor(booking) }}
                >
                  {getStatusText(booking)}
                </div>
              </div>
              
              <div className="booking-content">
                <div className="booking-header">
                  <h3>{booking.property?.title}</h3>
                  <div className="booking-rating">
                    <FontAwesomeIcon icon={faStar} />
                    <span>{booking.property?.rating}</span>
                  </div>
                </div>
                
                <div className="booking-location">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{booking.property?.location}</span>
                </div>
                
                <div className="booking-details">
                  <div className="booking-dates">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    <span>
                      {new Date(booking.checkIn).toLocaleDateString()} - {' '}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="booking-guests">
                    <FontAwesomeIcon icon={faUsers} />
                    <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div className="booking-price">
                  <span className="total-price">${booking.totalPrice}</span>
                  <span className="price-label">Total</span>
                </div>
                
                <div className="booking-actions">
                  <Link 
                    to={`/property/${booking.property?.id}`}
                    className="action-btn view-btn"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View Property
                  </Link>
                  
                  {canEditBooking(booking) && (
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => openEditModal(booking)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      Edit
                    </button>
                  )}
                  
                  {canCancelBooking(booking) && (
                    <button 
                      className="action-btn cancel-btn"
                      onClick={() => {
                        setBookingToCancel(booking);
                        setShowCancelModal(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Cancel Booking</h3>
              <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
            </div>
            <div className="modal-content">
              <p>Are you sure you want to cancel this booking?</p>
              <div className="booking-summary">
                <strong>{bookingToCancel?.property?.title}</strong>
                <span>
                  {new Date(bookingToCancel?.checkIn).toLocaleDateString()} - {' '}
                  {new Date(bookingToCancel?.checkOut).toLocaleDateString()}
                </span>
              </div>
              <p className="warning-text">
                This action cannot be undone. You may be subject to cancellation fees.
              </p>
            </div>
            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={() => {
                  setShowCancelModal(false);
                  setBookingToCancel(null);
                }}
              >
                Keep Booking
              </button>
              <button 
                className="modal-btn confirm"
                onClick={handleCancelBooking}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" message="" />
                ) : (
                  'Cancel Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Booking Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Booking</h3>
            </div>
            <form onSubmit={handleEditBooking} className="modal-content">
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  value={editData.checkIn}
                  onChange={(e) => setEditData(prev => ({ ...prev, checkIn: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  value={editData.checkOut}
                  onChange={(e) => setEditData(prev => ({ ...prev, checkOut: e.target.value }))}
                  min={editData.checkIn || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Guests</label>
                <select
                  value={editData.guests}
                  onChange={(e) => setEditData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                >
                  {Array.from({ length: bookingToEdit?.property?.maxGuests || 8 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} guest{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <div className="modal-actions">
              <button 
                type="button"
                className="modal-btn cancel"
                onClick={() => {
                  setShowEditModal(false);
                  setBookingToEdit(null);
                  setEditData({ checkIn: '', checkOut: '', guests: 1 });
                }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="modal-btn confirm"
                onClick={handleEditBooking}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" message="" />
                ) : (
                  'Update Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;