/**
 * Accounting API Client
 * Handles all financial and accounting operations
 * Endpoints: revenue tracking, expenses, reports, financial summaries
 */

import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Create axios instance for accounting endpoints
const accountingClient = axios.create({
  baseURL: `${API_URL}/api/accounting`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include token
accountingClient.interceptors.request.use(
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
 * Get revenue for time period
 * @param {object} options - Date range (dateFrom, dateTo, groupBy: daily/weekly/monthly)
 * @returns {Promise} Revenue data
 */
export const getRevenue = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)
    if (options.groupBy) params.append('groupBy', options.groupBy)

    const response = await accountingClient.get(`/revenue?${params.toString()}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get revenue',
    }
  }
}

/**
 * Get expenses for time period
 * @param {object} options - Filter options (dateFrom, dateTo, category, groupBy)
 * @returns {Promise} Expense data
 */
export const getExpenses = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)
    if (options.category) params.append('category', options.category)
    if (options.groupBy) params.append('groupBy', options.groupBy)

    const response = await accountingClient.get(`/expenses?${params.toString()}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get expenses',
    }
  }
}

/**
 * Record a new expense
 * @param {object} expenseData - Expense data (amount, category, description, date, reference)
 * @returns {Promise} Created expense
 */
export const recordExpense = async (expenseData) => {
  try {
    const response = await accountingClient.post('/expenses', expenseData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to record expense',
    }
  }
}

/**
 * Get financial summary
 * @param {object} options - Date range (dateFrom, dateTo)
 * @returns {Promise} Financial summary (revenue, expenses, profit, margin)
 */
export const getFinancialSummary = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)

    const response = await accountingClient.get(
      `/summary?${params.toString()}`
    )
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get summary',
    }
  }
}

/**
 * Get profit and loss statement
 * @param {object} options - Date range (dateFrom, dateTo)
 * @returns {Promise} P&L statement
 */
export const getProfitAndLoss = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)

    const response = await accountingClient.get(
      `/profit-loss?${params.toString()}`
    )
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get P&L',
    }
  }
}

/**
 * Get revenue by product
 * @param {object} options - Filter options (dateFrom, dateTo, limit)
 * @returns {Promise} Revenue breakdown by product
 */
export const getRevenueByProduct = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)
    if (options.limit) params.append('limit', options.limit)

    const response = await accountingClient.get(
      `/revenue-by-product?${params.toString()}`
    )
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get revenue by product',
    }
  }
}

/**
 * Get revenue by client
 * @param {object} options - Filter options (dateFrom, dateTo, limit)
 * @returns {Promise} Revenue breakdown by client
 */
export const getRevenueByClient = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)
    if (options.limit) params.append('limit', options.limit)

    const response = await accountingClient.get(
      `/revenue-by-client?${params.toString()}`
    )
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get revenue by client',
    }
  }
}

/**
 * Get expense categories
 * @returns {Promise} Available expense categories
 */
export const getExpenseCategories = async () => {
  try {
    const response = await accountingClient.get('/expense-categories')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get categories',
    }
  }
}

/**
 * Get accounting report
 * @param {string} reportType - Type of report (summary, detailed, comparative)
 * @param {object} options - Report options (dateFrom, dateTo, format)
 * @returns {Promise} Report data
 */
export const getAccountingReport = async (reportType, options = {}) => {
  try {
    const params = new URLSearchParams()
    params.append('type', reportType)
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)
    if (options.format) params.append('format', options.format)

    const response = await accountingClient.get(`/reports?${params.toString()}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get report',
    }
  }
}

/**
 * Export accounting report
 * @param {object} options - Export options (reportType, dateFrom, dateTo, format)
 * @returns {Promise} Export file
 */
export const exportReport = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.reportType) params.append('reportType', options.reportType)
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)
    if (options.format) params.append('format', options.format || 'csv')

    const response = await accountingClient.get(`/export?${params.toString()}`, {
      responseType: 'blob',
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Export failed',
    }
  }
}

/**
 * Get key financial metrics (KPIs)
 * @param {object} options - Date range (dateFrom, dateTo)
 * @returns {Promise} Financial KPIs
 */
export const getFinancialKPIs = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)

    const response = await accountingClient.get(`/kpis?${params.toString()}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get KPIs',
    }
  }
}

/**
 * Get budget vs actual
 * @param {object} options - Date range (dateFrom, dateTo)
 * @returns {Promise} Budget analysis
 */
export const getBudgetVsActual = async (options = {}) => {
  try {
    const params = new URLSearchParams()
    if (options.dateFrom) params.append('dateFrom', options.dateFrom)
    if (options.dateTo) params.append('dateTo', options.dateTo)

    const response = await accountingClient.get(
      `/budget-vs-actual?${params.toString()}`
    )
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get budget analysis',
    }
  }
}

export default accountingClient
