/**
 * Sales History Service
 * Stores completed sales in localStorage for offline-first operation
 * Provides query, filter, and export functionality
 */

const SALES_HISTORY_KEY = 'perfume_sales_history';

/**
 * Get all sales from history
 */
export const getAllSales = () => {
  try {
    const data = localStorage.getItem(SALES_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading sales history:', error);
    return [];
  }
};

/**
 * Save a completed sale to history
 */
export const saveSale = (receipt) => {
  try {
    const sales = getAllSales();
    const sale = {
      id: receipt.receiptId || `RCP-${Date.now()}`,
      timestamp: receipt.timestamp || new Date().toISOString(),
      items: receipt.items.map(item => ({
        name: item.name,
        size: item.size || null,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: receipt.subtotal,
      loyaltyDiscount: receipt.loyaltyDiscount || 0,
      total: receipt.total,
      paymentMethod: receipt.paymentMethod,
      customerPhone: receipt.customerPhone || 'N/A',
      sellerEmail: receipt.sellerEmail || 'N/A',
    };
    sales.unshift(sale); // newest first
    localStorage.setItem(SALES_HISTORY_KEY, JSON.stringify(sales));
    return sale;
  } catch (error) {
    console.error('Error saving sale:', error);
    return null;
  }
};

/**
 * Get sales filtered by date range
 */
export const getSalesByDateRange = (startDate, endDate) => {
  const sales = getAllSales();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return sales.filter(sale => {
    const saleTime = new Date(sale.timestamp).getTime();
    return saleTime >= start && saleTime <= end;
  });
};

/**
 * Get today's sales
 */
export const getTodaySales = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getSalesByDateRange(today, tomorrow);
};

/**
 * Get sales summary stats
 */
export const getSalesStats = (salesList = null) => {
  const sales = salesList || getAllSales();
  const totalRevenue = sales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalItems = sales.reduce((sum, s) => sum + s.items.reduce((iSum, i) => iSum + (i.quantity || 1), 0), 0);
  return {
    totalSales: sales.length,
    totalRevenue,
    totalItems,
    averageOrderValue: sales.length > 0 ? totalRevenue / sales.length : 0,
  };
};

/**
 * Search sales by receipt ID or customer phone
 */
export const searchSales = (query) => {
  if (!query || query.trim() === '') return getAllSales();
  const q = query.toLowerCase();
  return getAllSales().filter(sale =>
    sale.id.toLowerCase().includes(q) ||
    (sale.customerPhone && sale.customerPhone.toLowerCase().includes(q)) ||
    sale.items.some(item => item.name.toLowerCase().includes(q))
  );
};

/**
 * Delete a sale by ID (admin only)
 */
export const deleteSale = (saleId) => {
  const sales = getAllSales().filter(s => s.id !== saleId);
  localStorage.setItem(SALES_HISTORY_KEY, JSON.stringify(sales));
};

/**
 * Clear all sales history (admin only)
 */
export const clearAllSales = () => {
  localStorage.setItem(SALES_HISTORY_KEY, JSON.stringify([]));
};

export default {
  getAllSales,
  saveSale,
  getSalesByDateRange,
  getTodaySales,
  getSalesStats,
  searchSales,
  deleteSale,
  clearAllSales,
};
