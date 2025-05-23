# MERN Stack Template (TypeScript + Vite + Tailwind)

A basic MERN (MongoDB, Express, React, Node.js) stack starter template featuring:

- **React** (with **Vite** for fast dev builds)
- **Tailwind CSS** for styling (with **Prettier plugin-tailwindcss** for auto-sorting class names)
- **Express.js** backend
- **MongoDB** with Mongoose
- **TypeScript** used throughout both frontend and backend

## 🔧 Features

- ⚡ Vite-powered React frontend
- 🎨 Tailwind CSS with Prettier class sorting
- 🚀 Express.js backend with centralized error handling
- 🌿 MongoDB for data persistence (with a demo `Product` model)
- 📦 Modular project structure
- 🔐 Example `.env` files included
- ✅ Sample API request utility (`api-client.ts`) on the frontend for handling `GET`, `POST`, `PUT`, and `PATCH` with error normalization

## 🛠️ Setup Instructions

1. **Install dependencies:**

   - Frontend:
     ```bash
     cd frontend
     npm install
     ```

   - Backend:
     ```bash
     cd backend
     npm install
     ```

2. **Set up environment variables:**

   - Copy the `.env.example` file in both `frontend/` and `backend/` folders and rename it to `.env`.
   - Fill in the required environment variables. Make sure to set your MongoDB connection string correctly in the backend.

3. **Seed the database:**

   - Start the backend server (`npm run dev` in the `backend/` folder), then visit:
     ```
     http://localhost:<YOUR_BACKEND_PORT>/api/seed-db
     ```
   - This will insert sample `Product` data into your MongoDB database.

4. **Start both apps in development mode:**

   - Backend:
     ```bash
     cd backend
     npm run dev
     ```

   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

5. **Visit the app:**

   - Open your browser and go to:
     ```
     http://localhost:5173
     ```
   - You should see the demo Product cards rendered using data from the database.
#   M e r n 
 
 
