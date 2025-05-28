// client/src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.js';
import AgentManagement from './AgentManagement.js';
import UploadList from './UploadList.js';
import DistributedLists from './DistributedLists.js';
import listService from '../services/list.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('agentManagement'); // Default tab for admin
  const [myTasks, setMyTasks] = useState([]);
  const [message, setMessage] = useState('');

  // Memoized fetchMyTasks to prevent unnecessary re-creations
  const fetchMyTasks = useCallback(async () => {
    try {
      const tasks = await listService.getMyTasks();
      setMyTasks(tasks);
    } catch (error) {
      setMessage(error);
      console.error('Error fetching my tasks:', error);
    }
  }, []); // No dependencies needed for useCallback as it only calls listService.getMyTasks

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
    } else {
      setCurrentUser(user);
      if (user.role === 'agent') {
        setActiveTab('myTasks'); // Default tab for agent
        fetchMyTasks(); // Call fetchMyTasks when component mounts for agents
      }
    }
  }, [navigate, fetchMyTasks]); // Add fetchMyTasks to dependencies

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    window.location.reload();
  };

  // Function to handle status update from the dropdown
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await listService.updateTaskStatus(taskId, newStatus);
      setMessage('Task status updated successfully!');
      fetchMyTasks(); // Re-fetch tasks to update the UI
    } catch (error) {
      setMessage(error);
      console.error('Error updating task status:', error);
    }
  };

  if (!currentUser) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {currentUser.name} ({currentUser.role})
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 shadow-sm"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-gray-800 text-white p-6 shadow-lg">
          <ul className="space-y-4">
            {currentUser.role === 'admin' && (
              <>
                <li>
                  <button
                    onClick={() => setActiveTab('agentManagement')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 ${
                      activeTab === 'agentManagement' ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                  >
                    Agent Management
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('uploadList')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 ${
                      activeTab === 'uploadList' ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                  >
                    Upload & Distribute Lists
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('distributedLists')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 ${
                      activeTab === 'distributedLists' ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                  >
                    View Distributed Lists
                  </button>
                </li>
              </>
            )}
            {currentUser.role === 'agent' && (
              <li>
                <button
                  onClick={() => setActiveTab('myTasks')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition duration-200 ${
                    activeTab === 'myTasks' ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                >
                  My Assigned Tasks
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          {message && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
              {message}
            </div>
          )}
          {currentUser.role === 'admin' ? (
            <>
              {activeTab === 'agentManagement' && <AgentManagement />}
              {activeTab === 'uploadList' && <UploadList />}
              {activeTab === 'distributedLists' && <DistributedLists />}
            </>
          ) : (
            // Agent's view: My Assigned Tasks
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">My Assigned Tasks</h2>
              {myTasks.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-xl shadow-md p-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          First Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Notes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {myTasks.map((task) => (
                        <tr key={task._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {task.firstName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.notes}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                task.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : task.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task._id, e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In-Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600">No tasks assigned to you yet.</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;