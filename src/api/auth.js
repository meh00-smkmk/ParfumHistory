/**
 * Authentication API Client
 * Handles all authentication-related API calls
 * Endpoints: login, logout, register, refresh token, get current user
 */

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Mock users for demo mode
const MOCK_USERS = {
  'demo@perfumierpro.com': {
    id: 1,
    name: 'Demo User',
    email: 'demo@perfumierpro.com',
    password: 'demo@123',
    role: 'manager'
  },
  'seller@perfumierpro.com': {
    id: 2,
    name: 'Vendeur',
    email: 'seller@perfumierpro.com',
    password: 'seller@123',
    role: 'seller'
  }
}

// Create axios instance for auth endpoints
const authClient = axios.create({
  baseURL: `${API_URL}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include token
authClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle token refresh
authClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await authClient.post('/refresh-token')
        const { token } = response.data
        localStorage.setItem('authToken', token)
        originalRequest.headers.Authorization = `Bearer ${token}`
        return authClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('authToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

/**
 * User login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Login response with token
 */
export const login = async (email, password) => {
  try {
    // Check mock users first (demo mode)
    const mockUser = MOCK_USERS[email]
    if (mockUser && mockUser.password === password) {
      const token = 'demo-token-12345'
      const user = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role
      }
      localStorage.setItem('authToken', token)
      return { success: true, token, user }
    }

    // Try real backend if mock doesn't match
    try {
      const response = await authClient.post('/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('authToken', token)
      return { success: true, token, user }
    } catch (apiError) {
      // Backend failed, fall back to mock error
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed',
    }
  }
}

/**
 * User registration
 * @param {object} userData - User data (email, password, name, role)
 * @returns {Promise} Registration response
 */
export const register = async (userData) => {
  try {
    const response = await authClient.post('/register', userData)
    return { success: true, user: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed',
    }
  }
}

/**
 * User logout
 * @returns {Promise} Logout confirmation
 */
export const logout = async () => {
  try {
    await authClient.post('/logout')
    localStorage.removeItem('authToken')
    return { success: true }
  } catch (error) {
    localStorage.removeItem('authToken')
    return { success: true }
  }
}

/**
 * Get current user
 * @returns {Promise} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await authClient.get('/me')
    return { success: true, user: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get user',
    }
  }
}

/**
 * Refresh authentication token
 * @returns {Promise} New token
 */
export const refreshToken = async () => {
  try {
    const response = await authClient.post('/refresh-token')
    const { token } = response.data
    localStorage.setItem('authToken', token)
    return { success: true, token }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Token refresh failed',
    }
  }
}

/**
 * Verify token validity
 * @returns {Promise} Token validity status
 */
export const verifyToken = async () => {
  try {
    const response = await authClient.post('/verify-token')
    return { success: true, valid: response.data.valid }
  } catch (error) {
    return { success: false, valid: false }
  }
}

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} Reset request confirmation
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await authClient.post('/forgot-password', { email })
    return { success: true, message: response.data.message }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Reset request failed',
    }
  }
}

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} Reset confirmation
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await authClient.post('/reset-password', {
      token,
      newPassword,
    })
    return { success: true, message: response.data.message }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Password reset failed',
    }
  }
}

export default authClient
