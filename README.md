# 📦 Storage Management System (Backend)

A RESTful API for managing storage inventory, built with **Node.js, Express.js, and MongoDB**. Follows MVC architecture.

## 🔗 Live Demo
[https://storage-management-system-backend-4w6k.onrender.com](https://storage-management-system-backend-4w6k.onrender.com)


## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT
- **Deployment:** Render
- **Testing:** Postman

## ⚙️ Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/KawsarAlHasan/storage-management-system-backend.git
   cd storage-management-system-backend

2. **Install dependencies:**
   ```bash
   npm install

3. **Environment Setup:**
   - Create a .env file in the root directory
   - Add the following variables (use your own values):
   ```bash
    PORT = 8000
    DATABASE = mongodb+srv://<username>:<password>@cluster0.ihqt5.mongodb.net/<dbname>
    TOKEN_SECRET = your-secret-token
    EMAIL_ADD = your-email-address
    EMAIL_PASS = your-password

4. **Run the server:**
   - For development (with nodemon):
      ```bash
      npm run dev
   - For production:
     ```bash
      npm start
