import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSpots } from '../store/slices/spotsSlice';
import PropertyCard from '../components/Property/PropertyCard';
import BookingBar from '../components/Search/BookingSearchBar';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import WorkspaceGallery from '../components/WorkspaceGallery';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { spots, isLoading, error } = useSelector((state) => state.spots);
  const [featuredSpots, setFeaturedSpots] = useState([]);

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  useEffect(() => {
    // Get first 6 spots as featured
    if (spots.length > 0) {
      setFeaturedSpots(spots.slice(0, 6));
    }
  }, [spots]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Next Innovation Hub</h1>
          <p>Find inspiring workspaces and collaborative environments designed for productivity and creativity</p>
          
          {/* Booking Bar */}
          <BookingBar onBooking={(bookingData) => {
            console.log('Booking data:', bookingData);
            // Handle booking logic here
          }} />
        </div>
        <div className="hero-image">
          {/* Hero image removed */}
        </div>
      </section>

      {/* Featured Workspaces */}
        <section className="featured-workspaces">
        <div className="container">
          <h2>Featured Workspaces</h2>
          {error && (
            <div className="error-message">
              <p>Error loading spots: {error}</p>
              <button onClick={() => dispatch(fetchSpots())} className="retry-btn">
                Try Again
              </button>
            </div>
          )}
          
          {featuredSpots.length > 0 ? (
            <div className="workspaces-grid">
              {featuredSpots.map((spot) => (
                <PropertyCard key={spot.id} property={spot} />
              ))}
            </div>
          ) : (
            !isLoading && !error && (
              <div className="no-workspaces">
                <p>No workspaces available at the moment.</p>
                <Link to="/create-property" className="create-workspace-btn">
                  Be the first to list a workspace!
                </Link>
              </div>
            )
          )}

          {spots.length > 6 && (
            <div className="view-all">
              <Link to="/" className="view-all-btn">
                Explore More
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Explore Workspace Types</h2>
          <div className="categories-grid">
            <div className="category-card">
              <h3>Private Offices</h3>
              <p>Dedicated workspace for focused productivity</p>
            </div>
            <div className="category-card">
              <h3>Collaborative Spaces</h3>
              <p>Open environments for team collaboration</p>
            </div>
            <div className="category-card">
              <h3>Innovation Labs</h3>
              <p>Tech-enabled spaces for breakthrough thinking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace Gallery Section */}
      <section className="workspace-gallery-section">
        <div className="container">
          <h2>Inspiring Workspace Environments</h2>
          <p>Discover the variety of professional spaces available for your next project</p>
          <WorkspaceGallery />
        </div>
      </section>

      {/* Share Section */}
        <section className="share-section">
        <div className="container">
          <div className="share-content">
            <div className="share-text">
              <h2>Share Your Workspace</h2>
              <p>Transform your space into a productivity hub and connect with innovative professionals.</p>
              <ul>
                <li>Set flexible booking terms and competitive rates</li>
                <li>Connect with entrepreneurs and creative minds</li>
                <li>Full support throughout your hosting journey</li>
              </ul>
              <Link to="/create-property" className="share-btn">
                List Your Space
              </Link>
            </div>
            <div className="share-image">
              {/* Share image removed */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;