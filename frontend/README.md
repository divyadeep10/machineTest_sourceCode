# MERN Stack Lead Distribution & Management Application

This project is a web application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It's designed to facilitate the management of sales agents, allow administrators to upload customer lists (leads) via CSV/XLSX files, and intelligently distribute these leads among agents for follow-up. Agents can then log in to view and manage their assigned tasks, updating their status as they progress.

## Objective

The primary objective of this application is to demonstrate a robust MERN stack implementation with user authentication (JWT), role-based access control, file upload and parsing, data distribution logic, and CRUD operations.

## Features Implemented

The application successfully implements the following features as per the requirements:

1.  **User Authentication & Authorization:**
    * Admin user login with email and password.
    * Secure authentication using JSON Web Tokens (JWT).
    * Redirection to the dashboard on successful login; error messages on failure.
    * Role-based access control: Admin users have full access, while Agents can only view and manage their assigned tasks.

2.  **Agent Creation & Management:**
    * Admin users can create new agent accounts with `Name`, `Email`, `Mobile Number` (with country code), and `Password`.
    * This functionality is accessible via the Admin Dashboard.

3.  **CSV/XLSX File Upload & Lead Distribution:**
    * Admin users can upload `.csv`, `.xlsx`, or `.xls` files containing lead data.
    * File upload validation ensures only accepted file types are processed.
    * Data format validation checks for required columns: `FirstName`, `Phone`, `Notes` (case-insensitive).
    * **Intelligent Lead Distribution:** Leads are distributed equally among all currently available agents.
        * When a new list is uploaded, all existing tasks are cleared, and new tasks are created from the uploaded file.
        * The tasks are distributed in a round-robin fashion among all active agents in the system.
    * All distributed tasks are saved in the MongoDB database, assigned to their respective agents.

4.  **Task Management (Agent View):**
    * Agents can log in and view a list of tasks (leads) assigned specifically to them.
    * Agents can update the `Status` of their assigned tasks from `pending` to `in-progress` or `completed` via a dropdown on their dashboard.

5.  **Distributed Lists Overview (Admin View):**
    * Admin users can view all distributed lists, showing which tasks are assigned to which agent.

## Technical Requirements

* **Database:** MongoDB
* **Backend:** Node.js with Express.js
* **Frontend:** React.js
* **Authentication:** JSON Web Tokens (JWT)
* **File Uploads:** Multer, csv-parser, ExcelJS
* **Styling:** Tailwind CSS
* **Database ORM:** Mongoose
* **Error Handling:** Robust error handling and validation implemented throughout the application.
* **Code Quality:** Clean, readable, and modular code structure.
* **Configuration:** Environment variables managed via `.env` files.

## Project Structure

```
machine/
├── frontend/                     # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components (AgentManagement, Dashboard, Login, UploadList, DistributedLists)
│   │   ├── services/           # Frontend API service calls (auth.js, agent.js, list.js)
│   │   ├── App.js
│   │   ├── index.css           # Tailwind CSS directives
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   ├── postcss.config.js       # PostCSS configuration for Tailwind CSS
│   └── tailwind.config.js      # Tailwind CSS configuration
├── backend/                     # Backend (Node.js/Express)
│   ├── config/                 # Database connection
│   ├── middleware/             # Authentication middleware
│   ├── models/                 # Mongoose schemas (User, Task)
│   ├── routes/                 # API routes (authRoutes, agentRoutes, listRoutes)
│   ├── .env.example            # Example environment variables
│   ├── package.json
│   ├── server.js               # Main server file
│   └── ...
├── .gitignore
├── README.md                   # This file
└── package.json                # Root package.json (optional, for global scripts or workspace)
```

## Setup and Running Instructions

Follow these steps to get the application up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js & npm:** Download and install from [nodejs.org](https://nodejs.org/). (Node.js 14+ recommended)
* **MongoDB:** Download and install from [mongodb.com](https://www.mongodb.com/try/download/community). Ensure your MongoDB server is running.
* A code editor (e.g., VS Code).

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone <repository_url> # Replace <repository_url> with your actual repo URL
cd mern-admin-app           # Navigate into the project root directory
```

### 2. Backend Setup (`server` directory)

Navigate into the `server` directory and install the necessary dependencies:

```bash
cd server
npm install
```

#### Environment Variables (`.env` file)

Create a file named `.env` in the `server/` directory. Copy the content from `.env.example` and fill in your details:

```
# server/.env
MONGO_URI=mongodb://127.0.0.1:27017/mern_admin_app # Or your MongoDB Atlas URI
JWT_SECRET=your_jwt_secret_key_here                # Use a strong, random string
JWT_EXPIRE=1h                                      # Token expiration time
PORT=5000                                          # Port for the backend server
```
*Replace `your_jwt_secret_key_here` with a complex, unique string.*

#### Running the Backend Server

Start the backend server:

```bash
npm run dev
# OR if you don't have nodemon installed globally, you can use:
# npm start
```

The server should now be running on `http://localhost:5000` (or the `PORT` you specified).

### 3. Frontend Setup (`client` directory)

Open a **new terminal window/tab**. Navigate into the `client` directory and install the necessary dependencies:

```bash
cd ../client # Go back to the project root, then into the client directory
npm install
```

#### Tailwind CSS and PostCSS Configuration

Ensure your `client/postcss.config.js` file is correctly configured for Tailwind CSS. Create this file if it doesn't exist, at the same level as `tailwind.config.js` and `package.json` in the `client/` directory.

Also, ensure you have `@tailwindcss/postcss` installed:
```bash
npm install -D @tailwindcss/postcss
```

**`client/postcss.config.js` content:**
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

#### Running the Frontend Development Server

Start the React development server:

```bash
npm start
```

This will typically open your application in your browser at `http://localhost:3000`.

## Key Dependencies (Detailed)

### Backend (`server/package.json`)

**Dependencies:**
* `bcryptjs`: ^2.4.3 - For hashing passwords.
* `cors`: ^2.8.5 - For enabling Cross-Origin Resource Sharing.
* `csv-parser`: ^3.0.0 - For parsing CSV files.
* `dotenv`: ^16.4.5 - For loading environment variables.
* `exceljs`: ^4.4.0 - For parsing XLSX files.
* `express`: ^4.19.2 - Web framework for Node.js.
* `jsonwebtoken`: ^9.0.2 - For creating and verifying JWTs.
* `mongoose`: ^8.4.1 - MongoDB object modeling for Node.js.
* `multer`: ^1.4.5-lts.1 - For handling `multipart/form-data` (file uploads).
* `express-async-handler`: ^1.2.0 - Simple middleware for handling exceptions inside of async express routes.

**Dev Dependencies:**
* `nodemon`: ^3.1.3 - Automatically restarts the node application when file changes are detected.

### Frontend (`client/package.json`)

**Dependencies:**
* `@testing-library/jest-dom`: ^5.17.0 - Custom Jest matchers for asserting on DOM nodes.
* `@testing-library/react`: ^13.4.0 - React testing utilities.
* `@testing-library/user-event`: ^13.5.0 - For simulating user interactions in tests.
* `axios`: ^1.7.2 - Promise-based HTTP client for the browser and node.js.
* `react`: ^18.3.1 - The core React library.
* `react-dom`: ^18.3.1 - React package for working with the DOM.
* `react-router-dom`: ^6.23.1 - Declarative routing for React.
* `react-scripts`: ^5.0.1 - Configuration and scripts for Create React App.
* `web-vitals`: ^2.1.4 - For measuring web vitals.

**Dev Dependencies:**
* `tailwindcss`: ^3.4.4 - A utility-first CSS framework.
* `@tailwindcss/postcss`: ^4.0.0 - PostCSS plugin for Tailwind CSS. (Crucial for build process)

## Initial Admin User Creation

Before you can log in, you need to create an initial admin user. Since there's no public registration for admins, you can do this directly via a tool like Postman, Insomnia, or `curl` after the backend server is running.

**Endpoint:** `POST http://localhost:5000/api/users/register`

**Request Body (JSON):**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "adminpassword",
  "role": "admin"
}
```

**Example using `curl` (from your terminal):**
```bash
curl -X POST \
  http://localhost:5000/api/users/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "adminpassword",
    "role": "admin"
  }'
```
You should receive a JWT token and user details in the response upon successful registration.

## Usage Guide

### 1. Login

* Open your browser to `http://localhost:3000`.
* Enter `admin@example.com` and `adminpassword` (or the credentials you used for registration) to log in as an Admin.
* Alternatively, log in with an agent's credentials (e.g., `agent@example.com`, `password123`) to access the agent dashboard.

### 2. Admin Dashboard Functionality

After logging in as an Admin:

* **Agent Management:**
    * Click on "Agent Management" in the sidebar.
    * Use the form to add new agents by providing their Name, Email, Mobile Number, and Password.
    * View a list of all registered agents.
* **Upload & Distribute Lists:**
    * Click on "Upload & Distribute Lists" in the sidebar.
    * Use the file input to select a CSV, XLSX, or XLS file.
    * Ensure your file has `FirstName`, `Phone`, and `Notes` columns (case-insensitive).
    * Click "Upload & Distribute". The system will clear previous tasks and distribute the new leads among all available agents.
* **View Distributed Lists:**
    * Click on "View Distributed Lists" in the sidebar.
    * See a comprehensive overview of all tasks, grouped by the agent they are assigned to.

### 3. Agent Dashboard Functionality

After logging in as an Agent:

* **My Assigned Tasks:**
    * You will be automatically redirected to your "My Assigned Tasks" view.
    * View a table listing all leads (tasks) assigned specifically to your agent account.
    * **Update Task Status:** For each task, there is a dropdown in the "Actions" column. You can change the status of a task to `Pending`, `In-Progress`, or `Completed`. The changes will be saved to the database.



