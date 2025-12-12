# TripNest Backend (API Server)

Live API Base URL:   https://tripnest-backend-mpjf.onrender.com 
Frontend Repo/URL:   https://trip-nest-front-end.vercel.app

This is the backend API for TripNest, a travel booking platform. It exposes REST endpoints for managing users, authentication, travel packages, bookings, and Stripe‑based payments.

---

## Features

- JWT‑based authentication with role‑based access control (User/Admin).
- User registration and login.
- CRUD operations for travel packages (admin).
- Booking APIs for users:
  - Create booking
  - Get all own bookings
  - Get single booking by ID
  - Cancel own booking
- Stripe integration for payment:
  - Create payment intent / checkout
  - Confirm payment and update booking status
  - Admin endpoint to fetch payment details
- Input validation using Zod schemas.
- MongoDB/Mongoose models for users, packages, bookings, and payments.
- Clean architecture with routes, controllers, and services.

---

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Validation:** Zod
- **Authentication:** JWT (JSON Web Tokens)
- **Payments:** Stripe API
- **Other:** dotenv, cors, helmet, morgan (or similar) for security and logging

---

## Setup & Installation

1. Clone the repository (monorepo or backend subfolder)
git clone https://github.com/asadatik/TripNest-Backend
cd your-repo/TripNest-Backend

2. Install dependencies
npm install

or
yarn install

3. Configure environment variables
cp .env.example .env

Then update values:
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:3000
4. Run database migrations/seed (if you have seed scripts)
npm run seed (optional)
5. Start the server in development
npm run dev

or
yarn dev

API will run at http://localhost:5000 (or your PORT)
text

---

## Key API Endpoints (high level)

### Auth & Users

- `POST /api/V1/user/register` – Register new user  
- `POST /api/V1/auth/login` – Login and receive JWT  
- `GET /api/auth/me` – Get current user profile (protected)

### Packages

- `GET /api/V1/packages` – Get all packages  
- `GET /api/V1/packages/:id` – Get a single package  
- `POST /api/V1/packages` – Create package (Admin only)  
- `PATCH /api/V1/packages/:id` – Update package (Admin only)  
- `DELETE /api/V1/packages/:id` – Delete package (Admin only)

### Bookings

- `POST /api/V1/bookings/create` – Create booking for logged‑in user  
- `GET /api/V1/bookings/me` – Get all bookings for current user  
- `GET /api/V1/bookings/me/:id` – Get a single booking for current user  
- `PATCH /api/V1/bookings/me/:id/cancel` – Cancel own booking

### Payments (Stripe)

- `POST /api/V1/payments/create` – Initialize Stripe payment  
- `POST /api/V1/payments/confirm` – Confirm Stripe payment and update booking  
- `GET /api/V1/payments/admin/:paymentId` – Get single payment (Admin only)

---

## Scripts

npm run dev # Start dev server with nodemon
npm run start # Start production server
npm run lint # Lint code (if configured)
npm test # Run tests (if configured)

text

---

## Folder Structure (high level)

- `src/config/` – configuration, DB connection, environment.
- `src/modules/auth/` – auth routes, controllers, services.
- `src/modules/users/` – user model and logic.
- `src/modules/packages/` – package model, routes, controllers, services.
- `src/modules/bookings/` – booking model, routes, controllers, services.
- `src/modules/payments/` – payment/Stripe integration.
- `src/middleware/` – auth and role‑checking middlewares, error handlers.
- `src/utils/` – helpers, common utilities.

---

## License

This backend is part of the TripNest project and is used for educational purposes in the PH L2 B5A8 assignment.