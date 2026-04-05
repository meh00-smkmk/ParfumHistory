/**
 * Currency Formatter Utility
 * Handles conversion and formatting of prices in USD and DZD (Algerian Dinar)
 * 
 * Exchange Rate: 1 USD ≈ 135 DZD (approximate, update as needed)
 */

// Exchange rate configuration (can be updated)
const EXCHANGE_RATES = {
  USD: 1,
  DZD: 135, // 1 USD = 135 DZD (approximate)
}

// Currency symbols
const CURRENCY_SYMBOLS = {
  USD: '$',
  DZD: 'د.ج', // Arabic symbol for Algerian Dinar
}

// Currency names
const CURRENCY_NAMES = {
  USD: 'US Dollar',
  DZD: 'Algerian Dinar',
}

/**
 * Get the default currency from localStorage
 * Default: DZD (Algerian Dinar)
 */
export const getDefaultCurrency = () => {
  return localStorage.getItem('selectedCurrency') || 'DZD'
}

/**
 * Set the currency in localStorage
 */
export const setSelectedCurrency = (currency) => {
  if (currency === 'USD' || currency === 'DZD') {
    localStorage.setItem('selectedCurrency', currency)
    return true
  }
  return false
}

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount in source currency
 * @param {string} fromCurrency - Source currency (USD or DZD)
 * @param {string} toCurrency - Target currency (USD or DZD)
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency = 'USD', toCurrency = 'DZD') => {
  if (!amount || isNaN(amount)) return 0
  
  // Normalize to USD first, then convert to target
  const amountInUSD = amount / EXCHANGE_RATES[fromCurrency]
  const convertedAmount = amountInUSD * EXCHANGE_RATES[toCurrency]
  
  return convertedAmount
}

/**
 * Format price for display
 * @param {number} amount - Amount in base currency (USD)
 * @param {string} currency - Target currency (USD or DZD)
 * @param {boolean} includeSymbol - Include currency symbol
 * @returns {string} Formatted price
 */
export const formatPrice = (amount, currency = 'DZD', includeSymbol = true) => {
  if (!amount || isNaN(amount)) return `${includeSymbol ? CURRENCY_SYMBOLS[currency] : ''} 0.00`
  
  // Convert from USD to target currency if needed
  const convertedAmount = currency === 'USD' ? amount : convertCurrency(amount, 'USD', currency)
  
  // Format number with proper locale
  const locale = currency === 'DZD' ? 'ar-DZ' : 'en-US'
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(convertedAmount)
  
  // Add symbol if requested
  if (includeSymbol) {
    // For DZD, symbol goes after the number (Arabic format)
    if (currency === 'DZD') {
      return `${formatted} ${CURRENCY_SYMBOLS[currency]}`
    } else {
      // For USD, symbol goes before the number
      return `${CURRENCY_SYMBOLS[currency]}${formatted}`
    }
  }
  
  return formatted
}

/**
 * Format currency for display with name
 * @param {number} amount - Amount in base currency (USD)
 * @param {string} currency - Target currency (USD or DZD)
 * @returns {string} Formatted price with currency name
 */
export const formatPriceWithCurrency = (amount, currency = 'DZD') => {
  const formatted = formatPrice(amount, currency, true)
  const name = CURRENCY_NAMES[currency]
  return `${formatted} (${name})`
}

/**
 * Get all available currencies
 */
export const getAvailableCurrencies = () => [
  { code: 'USD', symbol: CURRENCY_SYMBOLS.USD, name: CURRENCY_NAMES.USD },
  { code: 'DZD', symbol: CURRENCY_SYMBOLS.DZD, name: CURRENCY_NAMES.DZD },
]

/**
 * Convert USD amount to any currency and format
 * Utility function for quick conversions
 */
export const toLocalCurrency = (amountInUSD) => {
  const currentCurrency = getDefaultCurrency()
  return formatPrice(amountInUSD, currentCurrency, true)
}

/**
 * Convert and format a price without symbol
 * Useful for calculations and internal use
 */
export const toLocalCurrencyNumeric = (amountInUSD) => {
  const currentCurrency = getDefaultCurrency()
  const converted = currentCurrency === 'USD' ? amountInUSD : convertCurrency(amountInUSD, 'USD', currentCurrency)
  return parseFloat(converted.toFixed(2))
}

export default {
  getDefaultCurrency,
  setSelectedCurrency,
  convertCurrency,
  formatPrice,
  formatPriceWithCurrency,
  getAvailableCurrencies,
  toLocalCurrency,
  toLocalCurrencyNumeric,
}
