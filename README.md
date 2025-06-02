# RESTours - Tour Company Management System

A full-featured **RESTful API** for managing tours, users, reviews, and authentication – built using **TypeScript**, **Express.js**, and **MongoDB**.

---

## 🚀 Features

- JWT-based **Authentication** & **Authorization**
- Role-based **Access Control**
- Secure **Password Reset** via Email
- **CRUD Operations** for Tours, Users, and Reviews
- Nested **Review Routes**
- Advanced **Filtering**, **Sorting**, **Pagination**, and **Field Limiting**
- Custom **Error Handling** and async error wrappers
- Modular **MVC Architecture**
- Built-in **TypeScript** support with custom types

---

## 🛠 Tech Stack

- **TypeScript**
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **Nodemailer** for sending emails
- Custom utilities: API features, global error handling, and more

---

## 🧪 Getting Started

### 1. Clone the repository

```
git clone https://github.com/zlatanovics1/RESTtours-ts.git
cd RESTtours-ts
```

### 2. Install dependencies
```
npm install
```

### 3. Create your .env file
Add your environment variables:

```
PORT=3000
DATABASE=mongodb+srv://<your-db-uri>
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

### 4. Run the server
```
npm run dev
```

## 📬 API Endpoints

Base URL: http://localhost:3000/api/v1

### Tours

GET /tours

GET /tours/:id

POST /tours

PATCH /tours/:id

DELETE /tours/:id

### Users

POST /signup

POST /login

PATCH /updateMe

DELETE /deleteMe

POST /forgotPassword

PATCH /resetPassword/:token

### Reviews

GET /reviews

POST /tours/:tourId/reviews


## 📌 Notes
Uses catchAsyncError to wrap all async functions.

Factory functions are used for DRY CRUD logic.

Strict typing ensures type safety across all layers.

Errors are centralized via AppError and error.controller.ts.
