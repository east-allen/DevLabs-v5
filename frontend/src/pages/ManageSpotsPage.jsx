import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentUserSpots, deleteSpot } from '../store/slices/spotsSlice';
import './ManageSpotsPage.css';

function ManageSpotsPage() {
  const dispatch = useDispatch();
  const { userSpots, loading, error } = useSelector(state => state.spots);
  const { user } = useSelector(state => state.auth);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(getCurrentUserSpots());
    }
  }, [dispatch, user]);

  const handleDelete = async (spotId) => {
    try {
      await dispatch(deleteSpot(spotId)).unwrap();
      dispatch(getCurrentUserSpots()); // Refresh the list
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete spot:', error);
    }
  };

  if (loading) {
    return (
      <div className="manage-spots-page">
        <div className="loading">Loading your properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-spots-page">
        <div className="error">Error loading properties: {error}</div>
      </div>
    );
  }

  return (
    <div className="manage-spots-page">
      <div className="manage-spots-header">
        <h1>Manage Your Properties</h1>
        <Link to="/create-property" className="btn btn-primary">
          Create New Property
        </Link>
      </div>

      {userSpots && userSpots.length === 0 ? (
        <div className="no-spots">
          <h2>You haven't created any properties yet</h2>
          <p>Start by creating your first property listing!</p>
          <Link to="/create-property" className="btn btn-primary">
            Create Your First Property
          </Link>
        </div>
      ) : (
        <div className="spots-grid">
          {userSpots?.map(spot => (
            <div key={spot.id} className="spot-card">
              <div className="spot-image">
                {spot.previewImage ? (
                  <img src={spot.previewImage} alt={spot.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              
              <div className="spot-info">
                <h3>{spot.name}</h3>
                <p className="spot-location">{spot.city}, {spot.state}</p>
                <p className="spot-price">${spot.price}/night</p>
                
                {spot.avgRating && (
                  <div className="spot-rating">
                    <span className="stars">★</span>
                    <span>{spot.avgRating}</span>
                  </div>
                )}
              </div>
              
              <div className="spot-actions">
                <Link 
                  to={`/spots/${spot.id}/edit`} 
                  className="btn btn-secondary"
                >
                  Update
                </Link>
                
                <button 
                  onClick={() => setDeleteConfirm(spot.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
              
              {deleteConfirm === spot.id && (
                <div className="delete-confirm">
                  <p>Are you sure you want to delete this property?</p>
                  <div className="confirm-actions">
                    <button 
                      onClick={() => handleDelete(spot.id)}
                      className="btn btn-danger"
                    >
                      Yes, Delete
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageSpotsPage;