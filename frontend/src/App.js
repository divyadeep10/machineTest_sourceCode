// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import authService from './services/auth';
import AgentManagement from './components/AgentManagement';
import UploadList from './components/UploadList';
import DistributedLists from './components/DistributedLists';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, allowedRoles }) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Logged in but not authorized, redirect to dashboard or an unauthorized page
    return <Navigate to="/dashboard" />; // Or a specific unauthorized access page
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin', 'agent']}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/agent-management"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AgentManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload-list"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <UploadList />
              </PrivateRoute>
            }
          />
          <Route
            path="/distributed-lists"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <DistributedLists />
              </PrivateRoute>
            }
          />
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* Catch-all for undefined routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
