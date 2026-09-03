# 🎓 UniShop

**UniShop** is a university-focused online marketplace built with the **MERN stack**, designed to help students buy, sell, exchange, and discover products and services within their university community.

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
* MongoDB
* Mongoose
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
│   ├── models/
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

UniShop uses MongoDB with Mongoose for data management.

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

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

> Never commit your `.env` file or expose secret keys in the repository.

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
* Build a scalable MERN application

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

## 📄 License

This project is currently available for educational and development purposes.

A formal license can be added as the project evolves.

---

## 👨‍💻 Author

**Saqlain Naqvi**

Built with ❤️ using the MERN stack.

---

⭐ If you find UniShop useful, consider giving the repository a star!
