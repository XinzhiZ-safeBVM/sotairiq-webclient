import axios from 'axios';
import authService from './authService';

// Environment variables
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/dev';


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



/**
 * Generic function to get session data by a specific key and value
 * @param {string} keyType - Type of key (id, username, trainee)
 * @param {string} keyValue - Value of the key
 * @returns {Promise} - Raw session data from API
 */
async function getSessionByKey(keyType, keyValue) {
  if (!keyValue) {
    throw new Error(`${keyType} value is required`);
  }
  
  try {
    const response = await fetchProtectedData(`/api/session/${keyType}/${keyValue}`);
    return response;
  } catch (error) {
    console.error(`Error fetching session by ${keyType}:`, error);
    throw error;
  }
}

/**
 * Parse breaths data from string format to structured objects
 * @param {Object} sessionData - Session data containing breaths
 * @returns {Object} - Session data with parsed breaths
 */
function parseBreathsData(sessionData) {
  if (!sessionData || !sessionData.breaths || typeof sessionData.breaths !== 'string') {
    return sessionData;
  }
  
  try {
    // Parse the breaths data which is in a nested array format
    const breathsData = JSON.parse(sessionData.breaths);
    
    // Extract the header row and data rows
    const headers = breathsData[0];
    const dataRows = breathsData.slice(1, -1); // Exclude the last empty string element
    
    // Convert the data rows to objects using the headers as keys
    const parsedBreaths = dataRows.map(row => {
      const breathObj = {};
      headers.forEach((header, index) => {
        breathObj[header] = row[index];
      });
      return breathObj;
    });
    
    // Create a new object to avoid mutating the original
    return {
      ...sessionData,
      breathsData: parsedBreaths
    };
  } catch (parseError) {
    console.error('Error parsing breaths data:', parseError);
    return sessionData;
  }
}

/**
 * Parse summary data from string format to structured objects
 * @param {Object} sessionData - Session data containing summary
 * @returns {Object} - Session data with parsed summary
 */
function parseSummaryData(sessionData) {
  if (!sessionData || !sessionData.summary || typeof sessionData.summary !== 'string') {
    return sessionData;
  }
  
  try {
    // Parse the summary data which is in a nested array format
    const summaryData = JSON.parse(sessionData.summary);
    
    // Extract the header row and data rows
    const headers = summaryData[0];
    const dataRows = summaryData.slice(1, -1); // Exclude the last empty string element
    
    // For summary, we typically have just one data row
    if (dataRows.length === 1) {
      const summaryObj = {};
      headers.forEach((header, index) => {
        summaryObj[header] = dataRows[0][index];
      });
      
      // Create a new object to avoid mutating the original
      return {
        ...sessionData,
        summaryData: summaryObj
      };
    } else {
      // Handle multiple summary rows if they exist
      const parsedSummary = dataRows.map(row => {
        const summaryObj = {};
        headers.forEach((header, index) => {
          summaryObj[header] = row[index];
        });
        return summaryObj;
      });
      
      return {
        ...sessionData,
        summaryData: parsedSummary
      };
    }
  } catch (parseError) {
    console.error('Error parsing summary data:', parseError);
    return sessionData;
  }
}

/**
 * Parse all structured data in a session
 * @param {Object} sessionData - Raw session data
 * @returns {Object} - Session data with all parsed components
 */
function parseSessionData(sessionData) {
  // First parse the breaths data
  const withBreaths = parseBreathsData(sessionData);
  
  // Then parse the summary data
  return parseSummaryData(withBreaths);
}

/**
 * Get session data by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise} - Raw session data
 */
async function getSessionById(sessionId) {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  
  try {
    return await getSessionByKey('id', sessionId);
  } catch (error) {
    console.error('Error fetching session by ID:', error);
    throw error;
  }
}

/**
 * Get sessions by username
 * @param {string} username - Username to fetch sessions for (defaults to current user)
 * @returns {Promise} - Array of session data
 */
async function getSessionsByUsername(username = null) {
  // If no username provided, use the current user's username
  const currentUsername = username || authService.getUsername();
  
  if (!currentUsername) {
    throw new Error('Username is required');
  }
  
  try {
    return await getSessionByKey('username', currentUsername);
  } catch (error) {
    console.error('Error fetching sessions by username:', error);
    throw error;
  }
}

/**
 * Get sessions by trainee name
 * @param {string} traineeName - Trainee name to fetch sessions for
 * @returns {Promise} - Array of session data
 */
async function getSessionsByTrainee(traineeName) {
  if (!traineeName) {
    throw new Error('Trainee name is required');
  }
  
  try {
    return await getSessionByKey('trainee', traineeName);
  } catch (error) {
    console.error('Error fetching sessions by trainee:', error);
    throw error;
  }
}

export default {
  fetchPublicData,
  fetchProtectedData,
  fetchAdminData,
  getSessionByKey,
  parseBreathsData,
  parseSummaryData,
  parseSessionData,
  getSessionById,
  getSessionsByUsername,
  getSessionsByTrainee
};