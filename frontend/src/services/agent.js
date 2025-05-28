// client/src/services/agent.js
import axios from 'axios';
import authService from './auth';

const API_URL = 'http://localhost:5000/api/agents/';

const getAuthHeaders = () => {
  const user = authService.getCurrentUser();
  if (user && user.token) {
    return {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  } else {
    return {};
  }
};

const getAllAgents = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

const createAgent = async (agentData) => {
  try {
    const response = await axios.post(API_URL, agentData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

const updateAgent = async (id, agentData) => {
  try {
    const response = await axios.put(API_URL + id, agentData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

const deleteAgent = async (id) => {
  try {
    const response = await axios.delete(API_URL + id, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

const agentService = {
  getAllAgents,
  createAgent,
  updateAgent,
  deleteAgent,
};

export default agentService;
