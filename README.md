# MERN Stack Lead Distribution & Management Application

This MERN (MongoDB, Express.js, React.js, Node.js) stack application manages sales agents and distributes customer leads. Admins upload CSV/XLSX files, and leads are intelligently assigned to agents. Agents can then log in to view and update the status of their assigned tasks.

---

## Features

- **User Authentication & Authorization**: Admin and Agent logins with JWT. Role-based access control.
- **Agent Management**: Admins can create and manage agent accounts.
- **Lead Upload & Distribution**: Admins upload CSV/XLSX files with `FirstName`, `Phone`, `Notes`. Leads are equally distributed among agents in a round-robin fashion.
- **Task Management**: Agents view and update their task status (`pending`, `in-progress`, `completed`).

---

## 🛠️ Setup and Running Instructions

### 🔧 Prerequisites

Ensure you have **Node.js (with npm)** and **MongoDB** installed and running.

---

### 1. Clone the Repository

```bash
git clone https://github.com/divyadeep10/machineTest_sourceCode.git
cd machineTest_sourceCode
```

---

### 2. Backend Setup (backend directory)

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

#### 📄 Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
# backend/.env
MONGO_URI=mongodb+srv://divyadeepsundriyal:LbTvaOGYifolFv6W@cluster0.wfzcfss.mongodb.net/Machine?retryWrites=true&w=majoritymern_admin_app
JWT_SECRET=1234 
JWT_EXPIRE=1h
PORT=5000
```

#### ▶️ Run Backend

```bash
node server.js
```

The backend will run on [http://localhost:5000](http://localhost:5000).

---

### 3. Frontend Setup (frontend directory)

Open a new terminal. Navigate to the frontend folder and install dependencies:

```bash
cd frontend
npm install
```

#### ⚙️ Frontend API URL Configuration

In `frontend/src/services/auth.js` and `frontend/src/services/list.js`, update the `API_URL`:

```javascript
const API_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000/api/';
```

For **Vercel deployment**, set `REACT_APP_BACKEND_API_URL` in your Vercel frontend project settings.

#### ▶️ Run Frontend

```bash
npm start
```

The frontend will open in your browser, typically at [http://localhost:3000](http://localhost:3000).

---

## 🔐 Initial User Credentials (For Testing)

You'll need to create these users in your database via the backend API. Ensure your backend server is running first.

### 👑 Admin Login:
- **Email**: `admin1@example.com`
- **Password**: `123`

### 👤 Agent Logins:
- **Email**: `agent1@example.com` | **Password**: `123`  
- **Email**: `agent2@example.com` | **Password**: `123`

---

### 🧾 Register Users via API (Example for Admin)

```bash
curl -X POST \
  http://localhost:5000/api/users/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Admin User",
    "email": "admin1@example.com",
    "password": "123",
    "role": "admin"
  }'
```

Repeat for `agent1@example.com` and `agent2@example.com` by changing `name`, `email`, and `role` to `"agent"`.

---

## Source Code

Link - https://github.com/divyadeep10/machineTest_sourceCode

## 🌐 Deployment & Usage

### 🔗 Live Frontend

Access the deployed frontend application here:  
👉 [https://machinetest-frontend.vercel.app/login](https://machinetest-frontend.vercel.app/login)

---

### 📁 Sample CSV File

Download a sample CSV for lead upload:  
📎 [sample1.csv](https://github.com/divyadeep10/machineTest_sourceCode/blob/main/sample1.csv)
