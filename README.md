# DevLabs - Developer Workspace Platform

A full-stack workspace booking platform with:

- User authentication (JWT)
- Workspace management (CRUD)
- Reservation system
- Review functionality

## Tech Stack

| Backend      | Frontend        |
| ------------ | --------------- |
| Express.js   | React 18        |
| PostgreSQL   | Vite            |
| Sequelize    | Redux           |
| JWT + bcrypt | React Router v6 |
| CORS/CSRF    | CSS3            |

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
   # Backend runs on http://localhost:8000
   # (or your configured PORT, defaults to 8000 in backend/bin/www)
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
