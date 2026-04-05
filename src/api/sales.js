/**
 * Sales/POS API Client
 * Handles all sales and point-of-sale transactions
 * Endpoints: cart operations, checkout, invoices, receipts
 */

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance for sales endpoints
const salesClient = axios.create({
  baseURL: `${API_URL}/api/sales`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include token
salesClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Get current shopping cart
 * @returns {Promise} Current cart items
 */
export const getCart = async () => {
  try {
    const response = await salesClient.get('/cart')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get cart',
    }
  }
}

/**
 * Add item to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise} Updated cart
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await salesClient.post('/cart/add', { productId, quantity })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add to cart',
    }
  }
}

/**
 * Remove item from cart
 * @param {string} cartItemId - Cart item ID
 * @returns {Promise} Updated cart
 */
export const removeFromCart = async (cartItemId) => {
  try {
    const response = await salesClient.post(`/cart/remove/${cartItemId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to remove from cart',
    }
  }
}

/**
 * Update item quantity in cart
 * @param {string} cartItemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise} Updated cart
 */
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    const response = await salesClient.put(`/cart/update/${cartItemId}`, {
      quantity,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update item',
    }
  }
}

/**
 * Apply discount/coupon to cart
 * @param {string} couponCode - Coupon code
 * @returns {Promise} Updated cart with discount
 */
export const applyCoupon = async (couponCode) => {
  try {
    const response = await salesClient.post('/cart/apply-coupon', {
      couponCode,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Invalid coupon code',
    }
  }
}

/**
 * Clear shopping cart
 * @returns {Promise} Empty cart confirmation
 */
export const clearCart = async () => {
  try {
    const response = await salesClient.post('/cart/clear')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to clear cart',
    }
  }
}

/**
 * Process checkout
 * @param {object} checkoutData - Checkout data (clientId, paymentMethod, notes)
 * @returns {Promise} Sale confirmation and receipt
 */
export const checkout = async (checkoutData) => {
  try {
    const response = await salesClient.post('/checkout', checkoutData)
    return { success: true, data: response.data, saleId: response.data.id }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Checkout failed',
    }
  }
}

/**
 * Get all sales transactions
 * @param {object} options - Filter options (page, limit, dateFrom, dateTo, clientId)
 * @returns {Promise} List of sales
 */
export const getSales = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.page) params.append('page', options.page)
    if (options.limit) params.append('limit', options.limit)
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)
    if (options.clientId) params.append('clientId', options.clientId)

    const response = await salesClient.get(`/?${params.toString()}`)
    return { success: true, data: response.data, total: response.data.total }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get sales',
    }
  }
}

/**
 * Get sale details by ID
 * @param {string} saleId - Sale ID
 * @returns {Promise} Sale details and items
 */
export const getSaleById = async (saleId) => {
  try {
    const response = await salesClient.get(`/${saleId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Sale not found',
    }
  }
}

/**
 * Get receipt for sale
 * @param {string} saleId - Sale ID
 * @returns {Promise} Receipt data
 */
export const getReceipt = async (saleId) => {
  try {
    const response = await salesClient.get(`/${saleId}/receipt`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get receipt',
    }
  }
}

/**
 * Process refund
 * @param {string} saleId - Sale ID to refund
 * @param {object} refundData - Refund data (items, reason)
 * @returns {Promise} Refund confirmation
 */
export const refundSale = async (saleId, refundData) => {
  try {
    const response = await salesClient.post(`/${saleId}/refund`, refundData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Refund failed',
    }
  }
}

/**
 * Get sales summary/report
 * @param {object} options - Report options (dateFrom, dateTo, groupBy)
 * @returns {Promise} Sales summary data
 */
export const getSalesSummary = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)
    if (options.groupBy) params.append('groupBy', options.groupBy)

    const response = await salesClient.get(`/summary?${params.toString()}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get summary',
    }
  }
}

/**
 * Get payment methods
 * @returns {Promise} Available payment methods
 */
export const getPaymentMethods = async () => {
  try {
    const response = await salesClient.get('/payment-methods')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get payment methods',
    }
  }
}

/**
 * Validate inventory before checkout
 * @param {array} items - Array of {productId, quantity}
 * @returns {Promise} Validation result
 */
export const validateInventory = async (items) => {
  try {
    const response = await salesClient.post('/validate-inventory', { items })
    return { success: true, valid: response.data.valid, items: response.data.items }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Validation failed',
    }
  }
}

export default salesClient
