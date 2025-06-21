# DevLabs - Developer Workspace Platform

A full-stack workspace booking platform built with React, Express.js, and PostgreSQL. DevLabs provides a complete innovation workspace platform with user authentication, workspace management, reservation system, and review functionality.

## 🚀 Live Demo

- **Backend API**: Ready for deployment to Render.com
- **Frontend**: Ready for deployment to Render.com

## 🛠 Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL (Render)
- **ORM**: Sequelize
- **Authentication**: JWT + bcrypt
- **Security**: CORS, CSRF, Helmet

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux
- **Routing**: React Router v6
- **Styling**: CSS3

## 📋 Features

### ✅ Implemented Features
- **User Authentication**: Registration, login, logout with JWT
- **Workspace Management**: CRUD operations for workspace listings
- **Reservation System**: Date-based workspace bookings with validation
- **Review System**: Workspace reviews with ratings and images
- **Image Management**: Support for workspace and review images
- **Security**: CSRF protection, password hashing, input validation

### 🏗 Database Schema

![Database Schema](./images/devlabs_dbdiagram.png)

**Tables:**
- **Users**: Authentication and profile data
- **Spots**: Workspace listings with location and details
- **Bookings**: Workspace reservations with date validation
- **Reviews**: User reviews with ratings (1-5 stars)
- **SpotImages**: Workspace image management
- **ReviewImages**: Review image attachments

## 🚀 Deployment Instructions

### Backend Deployment (Render.com)

1. **Create PostgreSQL Database**:
   - Go to Render.com dashboard
   - Create new PostgreSQL database
   - Copy connection details

2. **Deploy Backend Service**:
   - Connect GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Set environment variables (see .env.example)

3. **Environment Variables**:
   ```bash
   DB_USERNAME=your_render_db_username
   DB_PASSWORD=your_render_db_password
   DB_DATABASE=your_render_db_name
   DB_HOST=your_render_db_host
   DATABASE_URL=postgresql://username:password@host/database
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRES_IN=604800
   PORT=8001
   NODE_ENV=production
   ```

4. **Run Database Setup** (after deployment):
   ```bash
   # Migrations and seeders run automatically on deployment
   # Or manually via Render shell:
   npm run sequelize db:migrate
   npm run sequelize db:seed:all
   ```

### Frontend Deployment (Render.com)

1. **Create Static Site**:
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Set root directory: `frontend`

2. **Environment Variables**:
   ```bash
   VITE_API_URL=https://your-backend-service.onrender.com
   ```

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL (local or remote)
- Git

### Backend Setup

1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd DevLabs-Demo/backend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**:
   ```bash
   # Create database
   npm run sequelize db:create
   
   # Run migrations
   npm run sequelize db:migrate
   
   # Seed demo data
   npm run sequelize db:seed:all
   ```

4. **Start Development Server**:
   ```bash
   npm start
   # Backend runs on http://localhost:8001
   ```

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

## 📁 Project Structure

```
DevLabs-Demo/
├── backend/
│   ├── config/
│   │   └── database.js       # Database configuration
│   ├── db/
│   │   ├── migrations/       # Database schema migrations
│   │   ├── models/           # Sequelize models
│   │   └── seeders/          # Demo data seeders
│   ├── routes/
│   │   ├── api/              # API route handlers
│   │   │   ├── session.js    # Authentication routes
│   │   │   ├── users.js      # User management
│   │   │   ├── spots.js      # Property routes
│   │   │   ├── bookings.js   # Booking routes
│   │   │   └── reviews.js    # Review routes
│   │   └── index.js          # Route configuration
│   ├── utils/                # Helper functions
│   ├── app.js                # Express application setup
│   └── package.json          # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page-level components
│   │   ├── store/            # Redux store configuration
│   │   ├── context/          # React context providers
│   │   └── App.js            # Main application component
│   ├── dist/                 # Production build output
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
├── .gitignore                # Git ignore rules
├── .env.example              # Environment template
└── README.md                 # This file
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt for password security
- **CSRF Protection**: Cross-site request forgery prevention
- **CORS Configuration**: Properly configured for production
- **Input Validation**: Server-side validation for all endpoints
- **SQL Injection Prevention**: Sequelize ORM protection
- **Environment Variables**: Sensitive data stored securely

## 📡 API Documentation

### Authentication Endpoints

#### Login User
- **POST** `/api/session`
- **Body**: `{ "credential": "email_or_username", "password": "password" }`
- **Success**: Returns user object and JWT token

#### Register User
- **POST** `/api/users`
- **Body**: `{ "firstName": "John", "lastName": "Doe", "email": "john@example.com", "username": "johndoe", "password": "password" }`

#### Logout User
- **DELETE** `/api/session`
- **Auth Required**: Yes

#### Get Current User
- **GET** `/api/session`
- **Auth Required**: Yes

### Spots (Properties) Endpoints

#### Get All Spots
- **GET** `/api/spots`
- **Query Params**: `page`, `size`, `minLat`, `maxLat`, `minLng`, `maxLng`, `minPrice`, `maxPrice`

#### Get Spot Details
- **GET** `/api/spots/:spotId`
- **Returns**: Spot details with images, owner info, and average rating

#### Create Spot
- **POST** `/api/spots`
- **Auth Required**: Yes
- **Body**: Spot details (address, city, state, country, lat, lng, name, description, price)

#### Update Spot
- **PUT** `/api/spots/:spotId`
- **Auth Required**: Yes (Owner only)

#### Delete Spot
- **DELETE** `/api/spots/:spotId`
- **Auth Required**: Yes (Owner only)

### Bookings Endpoints

#### Get User Bookings
- **GET** `/api/bookings/current`
- **Auth Required**: Yes

#### Create Booking
- **POST** `/api/spots/:spotId/bookings`
- **Auth Required**: Yes
- **Body**: `{ "startDate": "2024-01-01", "endDate": "2024-01-07" }`

#### Update Booking
- **PUT** `/api/bookings/:bookingId`
- **Auth Required**: Yes (Booking owner only)

#### Delete Booking
- **DELETE** `/api/bookings/:bookingId`
- **Auth Required**: Yes (Booking owner only)

### Reviews Endpoints

#### Get Spot Reviews
- **GET** `/api/spots/:spotId/reviews`

#### Create Review
- **POST** `/api/spots/:spotId/reviews`
- **Auth Required**: Yes
- **Body**: `{ "review": "Great place!", "stars": 5 }`

#### Update Review
- **PUT** `/api/reviews/:reviewId`
- **Auth Required**: Yes (Review owner only)

#### Delete Review
- **DELETE** `/api/reviews/:reviewId`
- **Auth Required**: Yes (Review owner only)

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the DevLabs development team

## 🏆 Deployment Status

- ✅ **Backend**: Production-ready with PostgreSQL integration
- ✅ **Database**: Migrations and seeders configured
- ✅ **Security**: JWT authentication and CSRF protection implemented
- ✅ **API**: All CRUD endpoints functional
- ⚠️ **Frontend**: Build ready (deployment pending path resolution)

---

**Built with ❤️ by the DevLabs Team**

## ⚠️ DISCLAIMER
**This project is NOT an official submission to any organization, institution, or entity until explicitly stated otherwise by the author with zero ambiguity. This is a personal development project for demonstration and learning purposes only.**