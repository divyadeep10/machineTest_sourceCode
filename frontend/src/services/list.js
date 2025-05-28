// client/src/services/list.js
import axios from 'axios';
import authService from './auth.js'; // Ensure .js extension is handled by your build system or add it

const API_URL = 'http://localhost:5000/api/lists/';

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

const uploadList = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: getAuthHeaders().headers.Authorization,
      },
    };

    const response = await axios.post(API_URL + 'upload', formData, config);
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

const getDistributedLists = async () => {
  try {
    const response = await axios.get(API_URL + 'distributed', getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

const getMyTasks = async () => {
  try {
    const response = await axios.get(API_URL + 'my-tasks', getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};

// New function to update task status
const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axios.put(API_URL + `tasks/${taskId}/status`, { status }, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response.data.message || error.message;
  }
};


const listService = {
  uploadList,
  getDistributedLists,
  getMyTasks,
  updateTaskStatus, // Add the new function to the exported service
};

export default listService;