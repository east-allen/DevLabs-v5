import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../store/slices/spotsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faMapMarkerAlt, 
  faDollarSign, 
  faUsers, 
  faBed, 
  faBath, 
  faWifi, 
  faCar, 
  faSwimmingPool, 
  faUtensils, 
  faTv, 
  faSnowflake, 
  faFire, 
  faPaw, 
  faSmokingBan, 
  faCamera,
  faPlus,
  faTimes,
  faCheck,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import './CreateProperty.css';

const CreateProperty = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.spots);
  const { user } = useSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'apartment',
    location: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    price: '',
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    images: [],
    rules: {
      checkIn: '15:00',
      checkOut: '11:00',
      smokingAllowed: false,
      petsAllowed: false,
      partiesAllowed: false
    }
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: faHome },
    { value: 'house', label: 'House', icon: faHome },
    { value: 'villa', label: 'Villa', icon: faHome },
    { value: 'condo', label: 'Condo', icon: faHome },
    { value: 'studio', label: 'Studio', icon: faHome },
    { value: 'loft', label: 'Loft', icon: faHome }
  ];

  const availableAmenities = [
    { id: 'wifi', label: 'WiFi', icon: faWifi },
    { id: 'parking', label: 'Free Parking', icon: faCar },
    { id: 'pool', label: 'Swimming Pool', icon: faSwimmingPool },
    { id: 'kitchen', label: 'Kitchen', icon: faUtensils },
    { id: 'tv', label: 'TV', icon: faTv },
    { id: 'ac', label: 'Air Conditioning', icon: faSnowflake },
    { id: 'heating', label: 'Heating', icon: faFire },
    { id: 'pets', label: 'Pet Friendly', icon: faPaw },
    { id: 'smoking', label: 'Smoking Allowed', icon: faSmokingBan }
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Workspace details' },
    { number: 2, title: 'Location', description: 'Where is it located?' },
    { number: 3, title: 'Details', description: 'Capacity and pricing' },
    { number: 4, title: 'Amenities', description: 'What do you offer?' },
    { number: 5, title: 'Photos', description: 'Show your space' },
    { number: 6, title: 'Guidelines', description: 'Usage guidelines' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length > 10) {
      alert('You can upload maximum 10 images');
      return;
    }
    
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);
    
    // Create previews
    const newPreviews = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(newPreviews).then(previews => {
      setImagePreviews(prev => [...prev, ...previews]);
    });
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.type) newErrors.type = 'Property type is required';
        break;
      case 2:
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        break;
      case 3:
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.maxGuests || formData.maxGuests <= 0) newErrors.maxGuests = 'Valid guest count is required';
        break;
      case 5:
        if (imageFiles.length === 0) newErrors.images = 'At least one image is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'rules') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'images') {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add image files
      imageFiles.forEach((file, index) => {
        submitData.append(`images`, file);
      });
      
      await dispatch(createSpot(submitData)).unwrap();
      navigate('/profile?tab=properties');
    } catch (error) {
      // Error is handled by Redux state
    }
  };

  if (!user) {
    return (
      <div className="create-property-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>Please log in to create a property listing.</p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Tell us about your workspace</h2>
            <p>Start with the basics - what kind of workspace are you listing?</p>
            
            <div className="form-group">
              <label>Workspace Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Modern Downtown Co-working Space"
                className={errors.title ? 'error' : ''}
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>
            
            <div className="form-group">
              <label>Workspace Type *</label>
              <div className="property-types">
                {propertyTypes.map(type => (
                  <div
                    key={type.value}
                    className={`property-type ${formData.type === type.value ? 'selected' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  >
                    <FontAwesomeIcon icon={type.icon} />
                    <span>{type.label}</span>
                  </div>
                ))}
              </div>
              {errors.type && <span className="error-text">{errors.type}</span>}
            </div>
            
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property, its unique features, and what makes it special..."
                rows={5}
                className={errors.description ? 'error' : ''}
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="step-content">
            <h2>Where is your workspace located?</h2>
            <p>Help members find your space with accurate location details.</p>
            
            <div className="form-group">
              <label>Location Summary *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Downtown Manhattan, New York"
                className={errors.location ? 'error' : ''}
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
            </div>
            
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street, Apt 4B"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>
              
              <div className="form-group">
                <label>State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="United States"
                  className={errors.country ? 'error' : ''}
                />
                {errors.country && <span className="error-text">{errors.country}</span>}
              </div>
              
              <div className="form-group">
                <label>ZIP/Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="step-content">
            <h2>Workspace details and pricing</h2>
            <p>Tell us about the space and set your hourly or daily rate.</p>
            
            <div className="form-row">
              <div className="form-group">
                <label>Price per day *</label>
                <div className="price-input">
                  <FontAwesomeIcon icon={faDollarSign} />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="100"
                    min="1"
                    className={errors.price ? 'error' : ''}
                  />
                </div>
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>
              
              <div className="form-group">
                <label>Maximum Occupancy *</label>
                <div className="guests-input">
                  <FontAwesomeIcon icon={faUsers} />
                  <input
                    type="number"
                    name="maxGuests"
                    value={formData.maxGuests}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    className={errors.maxGuests ? 'error' : ''}
                  />
                </div>
                {errors.maxGuests && <span className="error-text">{errors.maxGuests}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms</label>
                <div className="bedrooms-input">
                  <FontAwesomeIcon icon={faBed} />
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Bathrooms</label>
                <div className="bathrooms-input">
                  <FontAwesomeIcon icon={faBath} />
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    step="0.5"
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="step-content">
            <h2>What amenities do you offer?</h2>
            <p>Select all the amenities available at your property.</p>
            
            <div className="amenities-grid">
              {availableAmenities.map(amenity => (
                <div
                  key={amenity.id}
                  className={`amenity-item ${
                    formData.amenities.includes(amenity.id) ? 'selected' : ''
                  }`}
                  onClick={() => handleAmenityToggle(amenity.id)}
                >
                  <FontAwesomeIcon icon={amenity.icon} />
                  <span>{amenity.label}</span>
                  {formData.amenities.includes(amenity.id) && (
                    <FontAwesomeIcon icon={faCheck} className="check-icon" />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="step-content">
            <h2>Add photos of your property</h2>
            <p>High-quality photos help your listing stand out. Upload up to 10 images.</p>
            
            <div className="image-upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <label htmlFor="image-upload" className="upload-label">
                  <FontAwesomeIcon icon={faCamera} />
                  <span>Click to upload photos</span>
                  <small>JPG, PNG, GIF up to 10MB each</small>
                </label>
              </div>
              
              {errors.images && <span className="error-text">{errors.images}</span>}
              
              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                      {index === 0 && <span className="main-photo">Main Photo</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="step-content">
            <h2>Set your workspace guidelines</h2>
            <p>Help members know what to expect when using your space.</p>
            
            <div className="form-row">
              <div className="form-group">
                <label>Access Start Time</label>
                <input
                  type="time"
                  name="rules.checkIn"
                  value={formData.rules.checkIn}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label>Access End Time</label>
                <input
                  type="time"
                  name="rules.checkOut"
                  value={formData.rules.checkOut}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="rules-section">
              <div className="rule-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rules.smokingAllowed"
                    checked={formData.rules.smokingAllowed}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Smoking allowed
                </label>
              </div>
              
              <div className="rule-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rules.petsAllowed"
                    checked={formData.rules.petsAllowed}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Pets allowed
                </label>
              </div>
              
              <div className="rule-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rules.partiesAllowed"
                    checked={formData.rules.partiesAllowed}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Parties/events allowed
                </label>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="create-property-container">
      <div className="create-property-header">
        <h1>List Your Workspace</h1>
        <p>Share your space with innovators and professionals worldwide</p>
      </div>
      
      <div className="progress-bar">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`progress-step ${
              currentStep >= step.number ? 'active' : ''
            } ${currentStep === step.number ? 'current' : ''}`}
          >
            <div className="step-number">{step.number}</div>
            <div className="step-info">
              <div className="step-title">{step.title}</div>
              <div className="step-description">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      {error && (
        <div className="error-alert">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          <span>Error: {error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="create-property-form">
        {renderStepContent()}
        
        <div className="form-navigation">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="nav-btn prev-btn"
              disabled={isLoading}
            >
              Previous
            </button>
          )}
          
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="nav-btn next-btn"
              disabled={isLoading}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="nav-btn submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="small" message="" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  Create Listing
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateProperty;