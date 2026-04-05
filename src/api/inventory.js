/**
 * Inventory API — localStorage Edition
 * Stock levels based on the products database
 */

const PRODUCTS_KEY = 'perfume_products_db';

const getProductsData = () => JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
const saveProductsData = (data) => localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));

export const getInventory = async (options = {}) => {
  const products = getProductsData();
  const items = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    stock: p.stock || 0,
    minLevel: p.minLevel || 10,
    sku: p.sku,
  }));
  return { success: true, data: items };
};

export const getStockLevel = async (productId) => {
  const products = getProductsData();
  const p = products.find(x => x.id === productId);
  return p ? { success: true, data: { stock: p.stock || 0 } } : { success: false, error: 'Not found' };
};

export const adjustStock = async (productId, quantity, reason = 'adjustment') => {
  const products = getProductsData();
  const idx = products.findIndex(x => x.id === productId);
  if (idx === -1) return { success: false, error: 'Not found' };
  products[idx].stock = (products[idx].stock || 0) + quantity;
  if (products[idx].stock < 0) products[idx].stock = 0;
  saveProductsData(products);
  return { success: true, data: { stock: products[idx].stock } };
};

export const getLowStockAlerts = async (threshold = 10) => {
  const products = getProductsData();
  const low = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= (p.minLevel || threshold));
  return { success: true, data: low.map(p => ({ id: p.id, name: p.name, category: p.category, stock: p.stock || 0, minLevel: p.minLevel || 10 })) };
};

export const getOutOfStockProducts = async () => {
  const products = getProductsData();
  const out = products.filter(p => (p.stock || 0) <= 0);
  return { success: true, data: out.map(p => ({ id: p.id, name: p.name, category: p.category, stock: 0, minLevel: p.minLevel || 10 })) };
};

export const getStockMovements = async () => ({ success: true, data: [] });
export const bulkAdjustStock = async () => ({ success: true });
export const setMinimumStockLevel = async (productId, minLevel) => {
  const products = getProductsData();
  const idx = products.findIndex(x => x.id === productId);
  if (idx === -1) return { success: false };
  products[idx].minLevel = minLevel;
  saveProductsData(products);
  return { success: true };
};
export const getInventorySummary = async () => {
  const products = getProductsData();
  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  return { success: true, data: { totalProducts: products.length, totalStock } };
};
export const exportInventory = async () => ({ success: false, error: 'Not available' });
export const reconcileInventory = async () => ({ success: true });

export default { getInventory, adjustStock, getLowStockAlerts, getOutOfStockProducts };
