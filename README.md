# 🍱 Osaka Food Ordering System

Fullstack food ordering platform built for multi-store management and online ordering.

This project simulates a real-world food delivery system where users can browse stores, order food, and admins can manage products, stores, and orders.

---

## 🚀 Tech Stack

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication
* Multer (Image Upload)
* RESTful API Architecture

### Frontend

* React / Next.js
* Axios
* TailwindCSS / CSS

---

## 📦 Features

### 👤 User

* Register & Login (JWT Authentication)
* Browse stores & products
* Add to cart
* Place orders
* View order history
* Leave reviews

### 🛠️ Admin

* Manage stores
* Manage products
* Manage orders
* Upload product/store images
* Role-based authorization

---

## 🗂️ Project Structure

```
osaka-food
 ├ backend
 │   ├ controllers
 │   ├ routes
 │   ├ middleware
 │   ├ config
 │   ├ uploads
 │   ├ server.js
 │   └ .env.example
 │
 ├ frontend
 │   ├ components
 │   ├ pages
 │   └ services
 │
 ├ README.md
 └ .gitignore
```

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Example `.env`:

```
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=osaka_food

JWT_SECRET=your_secret_key
```

---

## 📡 API Base URL

```
http://localhost:5000/api
```

---

## 🎯 Project Purpose

This project is built for:

* Practicing fullstack development
* Learning backend architecture
* Building real-world REST APIs
* Preparing for backend internship

---

## 👨‍💻 Author

**Duong Minh Dat**

Backend Developer Intern Candidate
