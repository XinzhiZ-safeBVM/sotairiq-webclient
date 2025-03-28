import axios from 'axios';

// Environment variables
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const COGNITO_ENDPOINT = import.meta.env.VITE_COGNITO_ENDPOINT;
const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';

/**
 * Login with AWS Cognito
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise} - Authentication result
 */
async function login(username, password) {
  try {
    console.log('Attempting login with:', { username, clientId: COGNITO_CLIENT_ID, endpoint: COGNITO_ENDPOINT });
    
    const response = await axios.post(
      COGNITO_ENDPOINT,
      {
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password
        },
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: COGNITO_CLIENT_ID
      },
      {
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
          'Content-Type': 'application/x-amz-json-1.1'
        }
      }
    );
    
    console.log('Login response:', response.data);
    
    // Store tokens securely
    const { IdToken, RefreshToken, AccessToken } = response.data.AuthenticationResult;
    
    // Store tokens and username in localStorage
    localStorage.setItem('idToken', IdToken);
    localStorage.setItem('refreshToken', RefreshToken);
    localStorage.setItem('accessToken', AccessToken);
    localStorage.setItem('username', username);
    
    return {
      success: true,
      username: username,
      tokens: {
        idToken: IdToken,
        refreshToken: RefreshToken,
        accessToken: AccessToken
      }
    };
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message || error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Authentication failed'
    };
  }
}

/**
 * Refresh the authentication token
 * @returns {Promise<string|null>} - New ID token or null if refresh failed
 */
async function refreshToken() {
  const refreshTokenValue = localStorage.getItem('refreshToken');
  
  if (!refreshTokenValue) {
    return null;
  }
  
  try {
    const response = await axios.post(
      COGNITO_ENDPOINT,
      {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: COGNITO_CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN: refreshTokenValue
        }
      },
      {
        headers: {
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
          'Content-Type': 'application/x-amz-json-1.1'
        }
      }
    );

    const { IdToken } = response.data.AuthenticationResult;
    localStorage.setItem('idToken', IdToken);
    return IdToken;
  } catch (error) {
    console.error('Token refresh failed:', error.response?.data || error.message || error);
    return null;
  }
}

/**
 * Logout user by removing tokens and user info
 */
function logout() {
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('username');
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has a valid token
 */
function isAuthenticated() {
  return !!localStorage.getItem('idToken');
}

/**
 * Get the current authentication token
 * @returns {string|null} - ID token or null if not authenticated
 */
function getToken() {
  return localStorage.getItem('idToken');
}

/**
 * Get the current username
 * @returns {string|null} - Username or null if not authenticated
 */
function getUsername() {
  return localStorage.getItem('username');
}

export default {
  login,
  logout,
  refreshToken,
  isAuthenticated,
  getToken,
  getUsername
};