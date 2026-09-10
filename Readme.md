# 🎓 UniShop

**UniShop** is a university-focused online marketplace built with **React, Express, Node.js, and SQLite using Prisma ORM**, designed to help students buy, sell, exchange, and discover products and services within their university community.

From used textbooks and calculators to electronics, clothing, hostel items, and student services, UniShop provides a secure platform for campus-to-campus transactions.

---

## 🚀 Features

### 👤 Authentication & User Management

* Student registration and login
* JWT-based authentication
* University email verification
* Secure password hashing with bcrypt
* User profiles
* Protected routes

### 🛍️ Marketplace

* Browse student listings
* Create, edit, and delete listings
* Product images
* Product categories
* Product condition
* Price information
* Campus/location information
* Mark products as sold

### 🔎 Search & Filtering

* Search products by title
* Filter by category
* Filter by price range
* Filter by condition
* Sort listings
* Browse recently added products

### ❤️ Wishlist

* Save products for later
* Remove products from wishlist
* View saved listings

### 💬 Student Messaging

* Contact sellers
* Private conversations
* Real-time messaging
* Message notifications

### 🚩 Reporting System

* Report suspicious listings
* Report inappropriate content
* Admin review system

### 🛡️ Admin Dashboard

* Manage students
* Manage listings
* Manage categories
* Review reports
* Remove inappropriate listings
* Monitor marketplace activity

---

## 🧑‍💻 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* Context API

### Backend

* Node.js
* Express.js
* SQLite (local database file)
* Prisma ORM 7
* JWT
* bcrypt

### Additional Technologies

* Socket.IO
* Cloudinary
* Multer
* Nodemailer

---

## 🏗️ Project Architecture

```text
UniShop/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── admin/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── prisma/         # Schema and versioned SQLite migrations
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── socket/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📦 Core Models

UniShop uses SQLite through Prisma ORM. The schema is in `server/prisma/schema.prisma`.

`User`, `Product`, and `Report` are relational tables. `WishlistItem` links users to products with a unique composite key. Product images are stored as a JSON array of Cloudinary URLs. Foreign keys cascade deletions so removing a listing or user also removes related reports and wishlist entries.

The API continues returning `_id` strings and populated seller/reporter data for the existing React client. Passwords are hashed with bcrypt before Prisma writes them, and request validation replaces the former model validation. Search matches substrings in product titles and descriptions; it does not use a MongoDB text index.

This version starts with a fresh SQLite database. Existing MongoDB records are not imported automatically. Keep any existing MongoDB database or exports until a separate data import is completed.

### User

```text
User
├── name
├── email
├── password
├── university
├── profileImage
├── role
├── isVerified
├── createdAt
└── updatedAt
```

### Product

```text
Product
├── title
├── description
├── price
├── images
├── category
├── condition
├── seller
├── location
├── status
├── views
├── createdAt
└── updatedAt
```

### Message

```text
Message
├── sender
├── receiver
├── conversation
├── message
├── read
└── createdAt
```

### Report

```text
Report
├── reporter
├── product
├── reason
├── description
├── status
└── createdAt
```

---

## 📂 Main Marketplace Categories

UniShop can support categories such as:

* 📚 Books & Notes
* 💻 Electronics
* 👕 Fashion
* 🎒 Accessories
* 🏠 Hostel & Room
* 🎮 Gaming
* 🧮 Study Equipment
* 🚲 Transport
* 🛠️ Services
* 📦 Other

---

## 🔐 Authentication Flow

```text
Student
   │
   ▼
Register
   │
   ▼
University Email Verification
   │
   ▼
Login
   │
   ▼
JWT Authentication
   │
   ▼
Protected Routes
   │
   ▼
Student Dashboard
```

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/forgot-password
POST /api/auth/reset-password
GET  /api/auth/me
```

### Products

```http
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
PATCH  /api/products/:id/sold
```

### Users

```http
GET    /api/users/:id
PUT    /api/users/:id
GET    /api/users/:id/listings
```

### Wishlist

```http
GET    /api/wishlist
POST   /api/wishlist/:productId
DELETE /api/wishlist/:productId
```

### Messages

```http
GET  /api/messages
GET  /api/messages/:conversationId
POST /api/messages
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/unishop.git
cd unishop
```

### 2. Install Dependencies

Use Node.js 22.12+ (Node.js 24 LTS is recommended). Run the commands below from the application directory containing `client/` and `server/`. In this workspace, that is the nested `unishop/` directory. On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

## 🔑 Environment Variables

Copy `server/.env.example` to `server/.env` and replace `JWT_SECRET` with a long random secret. Prisma Client is generated automatically during the backend dependency installation.

```env
PORT=5000

DATABASE_URL="file:./prisma/dev.db"

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

JWT_EXPIRES_IN=30d
```

> Never commit your `.env` file or expose secret keys in the repository.

`DATABASE_URL` is a local SQLite file URL, resolved relative to `server/` by both the application and Prisma CLI. The default is `server/prisma/dev.db`. No database server, Supabase account, or hosted database credentials are needed. Cloudinary credentials are still required for image uploads.

Initialize the database from `server/`:

```bash
npm run db:deploy
```

This creates the local database if needed and applies the committed migrations without resetting existing data. The database and its journal files are ignored by Git; commit schema and migration files instead.

Useful database commands (run inside `server/`):

| Command | Purpose |
| --- | --- |
| `npm run db:generate` | Regenerate Prisma Client after schema changes |
| `npm run db:migrate -- --name describe_change` | Create and apply a development migration |
| `npm run db:deploy` | Apply committed migrations to a new or existing database |
| `npm run db:studio` | Inspect and edit local data with Prisma Studio |
| `npm test` | Run API integration tests against a separate temporary SQLite database |

To bootstrap the first admin in a new database, register an account, open Prisma Studio, and set that user's `isAdmin` field to `true`. Log out and log in again to refresh the frontend session. Further admins can be created from the admin dashboard.

The SQLite setup follows the [Prisma SQLite documentation](https://www.prisma.io/docs/v7/prisma-orm/quickstart/sqlite). The existing JavaScript backend uses the `prisma-client-js` generator with the SQLite driver adapter.

---

## ▶️ Running the Project

### Start Backend

```bash
cd server
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

## 🗺️ Development Roadmap

### Phase 1 — MVP

* [x] Project setup
* [ ] User authentication
* [ ] Student registration
* [ ] Product CRUD
* [ ] Marketplace
* [ ] Product details
* [ ] Search
* [ ] Categories
* [ ] Seller profiles
* [ ] Student dashboard

### Phase 2 — Marketplace Improvements

* [ ] Image uploads
* [ ] Wishlist
* [ ] Advanced filtering
* [ ] Product views
* [ ] Mark as sold
* [ ] Reporting system

### Phase 3 — Communication

* [ ] Private messaging
* [ ] Real-time chat
* [ ] Notifications
* [ ] Message read status

### Phase 4 — Administration

* [ ] Admin dashboard
* [ ] User management
* [ ] Listing management
* [ ] Report management
* [ ] Category management
* [ ] Marketplace analytics

### Phase 5 — Future

* [ ] Multiple university support
* [ ] Online payments
* [ ] Student ratings & reviews
* [ ] AI-powered recommendations
* [ ] Personalized marketplace feed
* [ ] Mobile application

---

## 🛡️ Security

UniShop follows common web application security practices, including:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Role-based authorization
* Environment variables for secrets
* Input validation
* Error handling
* Secure image upload handling

---

## 🎯 Project Goals

The primary goals of UniShop are to:

* Create a dedicated marketplace for university students
* Make buying and selling within campus communities easier
* Encourage student-to-student commerce
* Provide a safer alternative to public marketplaces
* Practice real-world full-stack development
* Build a maintainable full-stack application

---

## 🔮 Future Vision

UniShop is designed with scalability in mind.

The initial version can serve a single university, while the architecture can eventually support multiple universities.

```text
                    UniShop
                       │
          ┌────────────┼────────────┐
          │            │            │
         UCP          FAST         LUMS
          │            │            │
       Students     Students     Students
```

The long-term goal is to transform UniShop into a **multi-university student marketplace** where students across different universities can safely buy, sell, and connect.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Commit your changes

```bash
git commit -m "Add your feature"
```

4. Push the branch

```bash
git push origin feature/your-feature
```

5. Open a Pull Request

---



## 👨‍💻 Author

**Saqlain Naqvi**

Built with ❤️ using React, Express, SQLite, Prisma, and Node.js.

---

⭐ If you find UniShop useful, consider giving the repository a star!
