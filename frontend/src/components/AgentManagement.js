// client/src/components/AgentManagement.js
import React, { useState, useEffect } from 'react';
import agentService from '../services/agent';

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentAgentId, setCurrentAgentId] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const data = await agentService.getAllAgents();
      setAgents(data);
    } catch (error) {
      setMessage(error);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setMobile('');
    setPassword('');
    setConfirmPassword('');
    setMessage('');
    setEditMode(false);
    setCurrentAgentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const agentData = { name, email, mobile, password };

    try {
      if (editMode) {
        await agentService.updateAgent(currentAgentId, agentData);
        setMessage('Agent updated successfully!');
      } else {
        await agentService.createAgent(agentData);
        setMessage('Agent created successfully!');
      }
      fetchAgents();
      resetForm();
    } catch (error) {
      setMessage(error);
    }
  };

  const handleEdit = (agent) => {
    setEditMode(true);
    setCurrentAgentId(agent._id);
    setName(agent.name);
    setEmail(agent.email);
    setMobile(agent.mobile);
    setPassword(''); // Passwords are not pre-filled for security
    setConfirmPassword('');
    setMessage('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await agentService.deleteAgent(id);
        setMessage('Agent deleted successfully!');
        fetchAgents();
      } catch (error) {
        setMessage(error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Agent Management</h2>

      {message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
          {message}
        </div>
      )}

      {/* Agent Creation/Edit Form */}
      <div className="bg-white p-8 rounded-xl shadow-md mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">
          {editMode ? 'Edit Agent' : 'Add New Agent'}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-gray-700 text-sm font-semibold mb-2">
              Mobile Number (with country code)
            </label>
            <input
              type="text"
              id="mobile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Password {editMode && '(Leave blank to keep current)'}
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!editMode} // Required only for new agent creation
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!editMode} // Required only for new agent creation
            />
          </div>
          <div className="md:col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-300 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
            >
              {editMode ? 'Update Agent' : 'Add Agent'}
            </button>
          </div>
        </form>
      </div>

      {/* Agents List */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Current Agents</h3>
        {agents.length === 0 ? (
          <p className="text-gray-600">No agents added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {agent.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(agent)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(agent._id)}
                        className="text-red-600 hover:text-red-900 transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentManagement;
