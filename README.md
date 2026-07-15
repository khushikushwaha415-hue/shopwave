# ShopWave — Full-Stack E-Commerce Platform

A full-stack e-commerce web application with product browsing, cart management, Stripe payment integration, order tracking, reviews, and an admin dashboard for managing products and orders.

**Live demo:** https://shopwave-git-main-khushi-projects.vercel.app/
**Backend API:** https://shopwave-84gd.onrender.com

> Note: The backend is hosted on Render's free tier, so the first request after inactivity may take 30–60 seconds to respond while the server spins up.

## Features

- **User authentication** — JWT-based signup/login with role-based access (user/admin), password confirmation and show/hide toggle on signup
- **Product catalog** — Browse, search, and filter products by category, with a hero banner and featured products section on the homepage
- **Product details** — Full product view with related products (same category) and a customer reviews section (star ratings + comments)
- **Wishlist** — Save favorite products locally, persisted across sessions
- **Shopping cart** — Add, update quantity, and remove items; quick add-to-cart directly from product cards
- **Checkout & payments** — Secure payment processing with Stripe (test mode)
- **Order history** — Users can view their past orders and payment status
- **Admin dashboard** — Admins can create, edit, and delete products, and manage order status across all customers
- **Toast notifications** — Non-blocking feedback for actions like adding to cart, wishlist updates, and review submissions
- **Responsive design** — Footer with site links, profile dropdown in navbar, and subtle page transition animations

## Tech stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Stripe.js
**Backend:** Node.js, Express, MongoDB (Mongoose)
**Payments:** Stripe API
**Auth:** JWT, bcrypt
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Getting started locally

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Stripe account (test mode keys)

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173

Run the backend:

```bash
npm run dev
```

### Frontend setup

```bash
cd backend/frontend
npm install
```

Create a `.env` file in `backend/frontend/` with:
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

Run the frontend:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## Testing payments

This project uses Stripe's test mode. Use the following test card to simulate a successful payment:
Card number: 4242 4242 4242 4242
Expiry: any future date
CVC: any 3 digits
ZIP: any 5 digits

## API overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT | Public |
| GET | `/api/products` | List/search/filter products | Public |
| GET | `/api/products/:id` | Get a single product | Public |
| POST | `/api/products` | Create a product | Admin |
| PUT | `/api/products/:id` | Update a product | Admin |
| DELETE | `/api/products/:id` | Delete a product | Admin |
| GET | `/api/reviews/:productId` | Get reviews and average rating for a product | Public |
| POST | `/api/reviews/:productId` | Submit a review for a product | Authenticated |
| GET | `/api/cart` | Get current user's cart | Authenticated |
| POST | `/api/cart` | Add item to cart | Authenticated |
| PUT | `/api/cart/:productId` | Update item quantity | Authenticated |
| DELETE | `/api/cart/:productId` | Remove item from cart | Authenticated |
| POST | `/api/orders/create-payment-intent` | Create a Stripe payment intent | Authenticated |
| POST | `/api/orders` | Place an order after payment | Authenticated |
| GET | `/api/orders/myorders` | Get logged-in user's orders | Authenticated |
| GET | `/api/orders` | Get all orders | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

## Author

Built by Khushi