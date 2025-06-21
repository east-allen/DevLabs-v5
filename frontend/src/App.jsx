import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAPI } from './utils/api';
import { getCurrentUser } from './store/slices/authSlice';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Logo from './components/Logo';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import CreateProperty from './pages/CreateProperty';

import FeaturedWorkspacesDemo from './pages/FeaturedWorkspacesDemo';
import HeaderDemo from './pages/HeaderDemo';
import ProtectedRoute from './components/Auth/ProtectedRoute';

import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      // Initialize API and CSRF token
      await initializeAPI();
      
      // Check if user data exists and get current user
      const userData = localStorage.getItem('user');
      if (userData) {
        dispatch(getCurrentUser());
      }
    };
    
    initializeApp();
  }, [dispatch]);

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/property/:id" element={<PropertyDetails />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-property"
            element={
              <ProtectedRoute>
                <CreateProperty />
              </ProtectedRoute>
            }
          />

            <Route path="/featured-workspaces-demo" element={<FeaturedWorkspacesDemo />} />
            <Route path="/header-demo" element={<HeaderDemo />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
