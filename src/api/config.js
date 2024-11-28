// globalConfig.js
import axios from 'axios';

const config = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 10000,
    endpoints: {
      emploi: '/emploi',
      filieres: '/filieres',
      groups: '/groups',
      competences: '/competences',
      secteur: '/secteur',
      attendance: '/attendance',
      quizzes: '/quizzes',
      schedule: '/schedule',
      absentStudents: '/absentStudents',
      courses: '/courses',
      stagiaires: '/stagiaires',
      documents: '/documents',
      demandes: '/demandes',
      modules: '/modules',
      formateur: '/formateur',
      scheduler: '/scheduler',
    },
  },
};

// Configure axios instance
const axiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service
export const apiService = {
  get: async (endpoint, params = {}) => {
    try {
      const response = await axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error.message);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error.message);
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error.message);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error.message);
      throw error;
    }
  },
};

export default config;
