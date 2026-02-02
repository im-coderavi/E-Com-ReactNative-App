# 🛍️ Full-Stack E-Commerce Application

A complete e-commerce solution with mobile app, admin dashboard, and REST API backend. Built with React Native (Expo), React, Node.js, Express, and MongoDB.

![E-Commerce App](./admin/public/screenshot-for-readme.png)

## ✨ Features

### 📱 Mobile App (React Native + Expo)
- **No Authentication Required** - Browse and shop without creating an account
- **Product Browsing** - View all products with images, prices, and details
- **Shopping Cart** - Add/remove items, update quantities (stored locally)
- **Wishlist** - Save favorite products for later
- **Address Management** - Add, edit, and delete delivery addresses
- **Order History** - Track your orders locally
- **Product Reviews** - Rate and review products
- **Offline Support** - All data stored locally using AsyncStorage
- **Persistent Data** - Cart, wishlist, addresses survive app restarts

### 🎛️ Admin Dashboard (React + Vite)
- **Custom Authentication** - Secure admin login
- **Product Management** - Create, read, update, delete products
- **Order Management** - View and manage customer orders
- **Customer Management** - View customer information
- **Analytics Dashboard** - Live statistics and insights
- **Image Upload** - Cloudinary integration for product images
- **Responsive Design** - Works on desktop and mobile

### 🔧 Backend API (Node.js + Express)
- **RESTful API** - Clean and organized endpoints
- **MongoDB Database** - Scalable data storage
- **Custom Authentication** - JWT-based auth system
- **Role-Based Access** - Admin and user roles
- **Image Handling** - Cloudinary integration
- **Payment Processing** - Stripe integration (ready to use)
- **Background Jobs** - Inngest for async tasks
- **Error Tracking** - Sentry integration

---

## 🏗️ Tech Stack

### Mobile App
- **React Native** - Cross-platform mobile development
- **Expo** - Development and build tooling
- **TanStack Query** - Data fetching and caching
- **AsyncStorage** - Local data persistence
- **Axios** - HTTP client
- **NativeWind** - Tailwind CSS for React Native

### Admin Dashboard
- **React** - UI library
- **Vite** - Build tool
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Stripe** - Payment processing
- **Inngest** - Background jobs
- **Sentry** - Error tracking

---

## 📦 Project Structure

```
ecom-app/
├── mobile/          # React Native mobile app
├── admin/           # React admin dashboard
├── backend/         # Node.js API server
└── README.md        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Expo Go** app (for mobile testing)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ecom-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:

```env
NODE_ENV=development
PORT=3000

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/ecomm_db

# Cloudinary (for image uploads)
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name

# Admin Credentials
ADMIN_EMAIL=admin@example.com

# Frontend URL
CLIENT_URL=http://localhost:5174

# Stripe (optional - for payments)
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Inngest (optional - for background jobs)
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Sentry (optional - for error tracking)
SENTRY_DSN=your_sentry_dsn
```

**Seed the database with demo products:**

```bash
npm run seed:products
```

**Start the backend server:**

```bash
npm run dev
```

Backend will run on `http://localhost:3000`

### 3. Admin Dashboard Setup

```bash
cd admin
npm install
```

Create `.env` file in `admin/` directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SENTRY_DSN=your_sentry_dsn
```

**Start the admin dashboard:**

```bash
npm run dev
```

Admin dashboard will run on `http://localhost:5174`

**Default Admin Credentials:**
- Email: `avishekgiri31@gmail.com`
- Password: `Sinu@2025`

### 4. Mobile App Setup

```bash
cd mobile
npm install
```

Create `.env` file in `mobile/` directory:

```env
SENTRY_AUTH_TOKEN=your_sentry_dsn
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Update API URL:**

Open `mobile/lib/api.ts` and update the `API_URL`:

```typescript
// For local development (same network)
const API_URL = "http://YOUR_LOCAL_IP:3000/api";

// Example:
const API_URL = "http://192.168.1.100:3000/api";
```

**Find your local IP:**
- **Windows**: Run `ipconfig` in terminal
- **Mac/Linux**: Run `ifconfig` in terminal

**Start the mobile app:**

```bash
npx expo start
```

**Test on your phone:**
1. Install **Expo Go** app from App Store/Play Store
2. Scan the QR code from terminal
3. App will load on your phone

---

## 🎯 Usage

### Admin Dashboard

1. Navigate to `http://localhost:5174`
2. Login with admin credentials
3. **Dashboard** - View analytics and statistics
4. **Products** - Add, edit, or delete products
5. **Orders** - View and manage orders
6. **Customers** - View customer information

### Mobile App

1. Open Expo Go and scan QR code
2. **Browse Products** - View all available products
3. **Add to Cart** - Tap the + button on any product
4. **Wishlist** - Tap the heart icon to save favorites
5. **Cart** - View and manage cart items
6. **Profile** - Add addresses and view orders
7. **Checkout** - Complete purchase (addresses stored locally)

---

## 🔑 Key Features Explained

### Local Storage (No Authentication Required)

The mobile app uses **AsyncStorage** to store all data locally:

- **Cart** - Persists across app restarts
- **Wishlist** - Saved on device
- **Addresses** - Stored locally
- **Orders** - Tracked locally

This means users can shop without creating an account!

### Admin Authentication

The admin dashboard uses **custom JWT authentication**:

- Secure login with email/password
- Protected routes
- Role-based access control

### Product Management

- Upload multiple product images
- Set prices, stock, categories
- Rich product descriptions
- Automatic image optimization via Cloudinary

### Payment Integration

Stripe is integrated and ready to use:

- Secure payment processing
- Webhook support for order confirmation
- Test mode for development

---

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/admin/products` - Create product (admin only)
- `PUT /api/admin/products/:id` - Update product (admin only)
- `DELETE /api/admin/products/:id` - Delete product (admin only)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics (admin only)
- `GET /api/admin/customers` - Get all customers (admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/admin/orders` - Get all orders (admin only)

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/products/:id/reviews` - Get product reviews

---

## 🛠️ Development

### Running in Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Admin:**
```bash
cd admin
npm run dev
```

**Terminal 3 - Mobile:**
```bash
cd mobile
npx expo start
```

### Database Seeding

Seed the database with demo products:

```bash
cd backend
npm run seed:products
```

This creates sample products in your database for testing.

---

## 🚢 Deployment

### Backend Deployment

The backend can be deployed to:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**
- **AWS**

Make sure to set all environment variables in your hosting platform.

### Admin Dashboard Deployment

The admin dashboard can be deployed to:
- **Vercel**
- **Netlify**
- **GitHub Pages**

Build the admin dashboard:

```bash
cd admin
npm run build
```

### Mobile App Deployment

Build the mobile app using Expo:

```bash
cd mobile
eas build --platform android
eas build --platform ios
```

---

## 🤝 Contributing

This is a personal project. Feel free to fork and customize for your own use!

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 👨‍💻 Author

**Avishek Giri**
- B.Tech CSE Final Year Student
- Greater Kolkata College of Engineering and Management
- Full Stack Web Developer (MERN Stack)

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by real-world e-commerce applications
- Designed for learning and portfolio purposes

---

## 📞 Support

For issues or questions, please open an issue in the GitHub repository.

---

**Happy Coding! 🚀**
