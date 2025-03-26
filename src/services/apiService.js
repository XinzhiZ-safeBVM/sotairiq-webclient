import axios from 'axios';
import authService from './authService';

// Environment variables
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev';

// Sample data path
const SAMPLE_DATA_PATH = '/example_data/sample_session_combine_plain.txt';

/**
 * Make a public API request (no authentication)
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @returns {Promise} - API response
 */
async function fetchPublicData(endpoint, params = {}) {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}${endpoint || '/apiu/a'}`, { params });
    return response.data;
  } catch (error) {
    console.error('Public API error:', error);
    throw error;
  }
}

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @returns {Promise} - API response
 */
async function fetchProtectedData(endpoint, params = {}) {
  const idToken = authService.getToken();
  
  if (!idToken) {
    throw new Error('No authentication token available');
  }
  
  try {
    const response = await axios.get(`${API_GATEWAY_URL}${endpoint || '/api'}`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      },
      params
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token expired, try to refresh
      const newToken = await authService.refreshToken();
      if (newToken) {
        // Retry the request with the new token
        return fetchProtectedData(endpoint, params);
      } else {
        // Refresh failed, logout
        authService.logout();
        // You might want to redirect to login page here
        throw new Error('Authentication expired. Please login again.');
      }
    }
    console.error('Protected API error:', error);
    throw error;
  }
}

/**
 * Make an admin API request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Request parameters
 * @returns {Promise} - API response
 */
async function fetchAdminData(endpoint, params = {}) {
  const idToken = authService.getToken();
  
  if (!idToken) {
    throw new Error('No authentication token available');
  }
  
  try {
    const response = await axios.get(`${API_GATEWAY_URL}${endpoint || '/apia'}`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      },
      params
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      // Token expired, try to refresh
      const newToken = await authService.refreshToken();
      if (newToken) {
        // Retry the request with the new token
        return fetchAdminData(endpoint, params);
      } else {
        // Refresh failed, logout
        authService.logout();
        throw new Error('Authentication expired. Please login again.');
      }
    }
    console.error('Admin API error:', error);
    throw error;
  }
}

// parseDynamoDBItem function removed as we're now using standard JSON format

/**
 * Parse Python tuple string format to JavaScript array
 * @param {string} tupleString - String representation of Python tuples
 * @returns {Array} - Array of objects
 */
/**
 * Parse string representation of arrays to JavaScript array of objects
 * @param {string} dataString - String representation of arrays
 * @returns {Array} - Array of objects
 */
function parseTupleString(dataString) {
  if (!dataString) return [];
  
  try {
    // Parse the string as JSON array
    const parsedData = JSON.parse(dataString);
    
    // Check if the parsed data is an array
    if (!Array.isArray(parsedData)) {
      console.error('Parsed data is not an array');
      return [];
    }
    
    // First array contains headers
    const headers = parsedData[0];
    
    // Process data rows
    const result = [];
    for (let i = 1; i < parsedData.length; i++) {
      const values = parsedData[i];
      
      // Skip the last element if it's an empty string
      if (i === parsedData.length - 1 && values === "") {
        continue;
      }
      
      // Create object with header keys and values
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j];
      }
      
      result.push(obj);
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing data string:', error);
    return [];
  }
}

/**
 * Load sample session data from file
 * @returns {Promise<Array>} - Array of session data
 */
async function loadSampleSessions() {
  try {
    const response = await axios.get(SAMPLE_DATA_PATH);
    const data = response.data;
    
    // Process the data based on its format
    let sessions = [];
    
    if (typeof data === 'string') {
      // Parse the string as JSON
      try {
        sessions = JSON.parse(data);
      } catch (jsonError) {
        console.error('Error parsing JSON data:', jsonError);
        return [];
      }
    } else if (Array.isArray(data)) {
      // Data is already an array
      sessions = data;
    } else {
      // Single item
      sessions = [data];
    }
    
    // Process each session to parse the breaths and summary data
    return sessions.map(item => {
      const parsedItem = { ...item };
      
      // Parse the breaths and summary data
      if (parsedItem.breaths) {
        parsedItem.breathsData = parseTupleString(parsedItem.breaths);
      }
      
      if (parsedItem.summary) {
        parsedItem.summaryData = parseTupleString(parsedItem.summary);
      }
      
      return parsedItem;
    });
  } catch (error) {
    console.error('Error loading sample data:', error);
    return [];
  }
}

/**
 * Get session data by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Session data
 */
async function getSessionById(sessionId) {
  const sessions = await loadSampleSessions();
  return sessions.find(session => session.id === sessionId) || null;
}

export default {
  fetchPublicData,
  fetchProtectedData,
  fetchAdminData,
  loadSampleSessions,
  getSessionById
};