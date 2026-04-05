/**
 * Products API — localStorage Edition
 * Full CRUD for products + categories, no backend needed
 * Includes size-based pricing for perfume products
 */

const PRODUCTS_KEY = 'perfume_products_db';
const CATEGORIES_KEY = 'perfume_categories_db';

// Default categories
const DEFAULT_CATEGORIES = ['Classic', 'Fresh', 'Floral', 'Woody', 'Oriental', 'Niche', 'Unisex', 'Sport'];

// Default products with sizes
const DEFAULT_PRODUCTS = [
  { id: 'P001', name: 'Chanel No. 5', category: 'Classic', sku: 'CH-N5', description: 'Timeless classic fragrance',
    sizes: [{ size: 10, price: 200 },{ size: 12, price: 250 },{ size: 15, price: 300 },{ size: 20, price: 400 },{ size: 25, price: 500 },{ size: 30, price: 600 },{ size: 50, price: 1000 },{ size: 50, price: 1200 },{ size: 80, price: 1200 },{ size: 80, price: 1500 },{ size: 100, price: 1900 }], stock: 45 },
  { id: 'P002', name: "Dior J'adore", category: 'Fresh', sku: 'DI-JA', description: 'Elegant feminine scent',
    sizes: [{ size: 10, price: 200 },{ size: 12, price: 250 },{ size: 15, price: 300 },{ size: 20, price: 400 },{ size: 25, price: 500 },{ size: 30, price: 600 },{ size: 50, price: 1000 },{ size: 80, price: 1500 },{ size: 100, price: 1900 }], stock: 32 },
  { id: 'P003', name: 'Gucci Flora', category: 'Floral', sku: 'GU-FL', description: 'Fresh floral bouquet',
    sizes: [{ size: 10, price: 200 },{ size: 15, price: 300 },{ size: 20, price: 400 },{ size: 30, price: 600 },{ size: 50, price: 1000 },{ size: 80, price: 1500 },{ size: 100, price: 1900 }], stock: 28 },
  { id: 'P004', name: "Prada L'Homme", category: 'Woody', sku: 'PR-LH', description: 'Sophisticated woody scent',
    sizes: [{ size: 10, price: 250 },{ size: 15, price: 350 },{ size: 20, price: 450 },{ size: 30, price: 700 },{ size: 50, price: 1100 },{ size: 80, price: 1600 },{ size: 100, price: 2000 }], stock: 15 },
  { id: 'P005', name: 'Calvin Klein One', category: 'Fresh', sku: 'CK-ON', description: 'Clean unisex fragrance',
    sizes: [{ size: 10, price: 150 },{ size: 15, price: 220 },{ size: 20, price: 300 },{ size: 30, price: 450 },{ size: 50, price: 750 },{ size: 80, price: 1100 },{ size: 100, price: 1400 }], stock: 50 },
  { id: 'P006', name: 'Tom Ford Oud Wood', category: 'Oriental', sku: 'TF-OW', description: 'Rich oriental wood fragrance',
    sizes: [{ size: 10, price: 300 },{ size: 15, price: 400 },{ size: 20, price: 550 },{ size: 30, price: 850 },{ size: 50, price: 1400 },{ size: 80, price: 2000 },{ size: 100, price: 2500 }], stock: 20 },
  { id: 'P007', name: 'Versace Eros', category: 'Fresh', sku: 'VR-ER', description: 'Bold masculine fragrance',
    sizes: [{ size: 10, price: 180 },{ size: 15, price: 280 },{ size: 20, price: 370 },{ size: 30, price: 550 },{ size: 50, price: 900 },{ size: 80, price: 1300 },{ size: 100, price: 1700 }], stock: 35 },
  { id: 'P008', name: 'Baccarat Rouge 540', category: 'Niche', sku: 'BR-540', description: 'Luxurious niche fragrance',
    sizes: [{ size: 10, price: 400 },{ size: 15, price: 550 },{ size: 20, price: 700 },{ size: 30, price: 1100 },{ size: 50, price: 1800 },{ size: 80, price: 2500 },{ size: 100, price: 3200 }], stock: 12 },
];

// Initialize
const initProducts = () => {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  }
};
initProducts();

// ── Products CRUD ─────────────────────────────────

export const getProducts = async (options = {}) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  return { success: true, data: products };
};

export const getProductById = async (productId) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  const product = products.find(p => p.id === productId);
  return product ? { success: true, data: product } : { success: false, error: 'Not found' };
};

export const createProduct = async (productData) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  const newProduct = {
    id: `P${Date.now()}`,
    name: productData.name || '',
    category: productData.category || 'Autre',
    sku: productData.sku || '',
    description: productData.description || '',
    sizes: productData.sizes || [{ size: 30, price: parseInt(productData.price) || 500 }],
    stock: parseInt(productData.stock) || 0,
    price: parseFloat(productData.price) || 0,
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return { success: true, data: newProduct };
};

export const updateProduct = async (productId, productData) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  const idx = products.findIndex(p => p.id === productId);
  if (idx === -1) return { success: false, error: 'Not found' };
  products[idx] = { ...products[idx], ...productData, updatedAt: new Date().toISOString() };
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return { success: true, data: products[idx] };
};

export const deleteProduct = async (productId) => {
  let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  products = products.filter(p => p.id !== productId);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return { success: true, message: 'Deleted' };
};

// ── Categories CRUD ───────────────────────────────

export const getCategories = async () => {
  const categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
  return { success: true, data: categories };
};

export const addCategory = (name) => {
  const categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
  if (!categories.includes(name)) {
    categories.push(name);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }
  return categories;
};

export const deleteCategory = (name) => {
  let categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
  categories = categories.filter(c => c !== name);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  return categories;
};

export const renameCategory = (oldName, newName) => {
  let categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY) || '[]');
  const idx = categories.indexOf(oldName);
  if (idx !== -1) categories[idx] = newName;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  // Also update products with this category
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  products.forEach(p => { if (p.category === oldName) p.category = newName; });
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return categories;
};

// ── Search & Filter ───────────────────────────────

export const searchProducts = async (query) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  const q = query.toLowerCase();
  const results = products.filter(p =>
    p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
  );
  return { success: true, data: results };
};

export const getProductsByCategory = async (category) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  return { success: true, data: products.filter(p => p.category === category) };
};

export const getPopularProducts = async (limit = 10) => {
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  return { success: true, data: products.slice(0, limit) };
};

export const bulkUpdateProducts = async () => ({ success: true });
export const bulkDeleteProducts = async () => ({ success: true });

export default { getProducts, createProduct, updateProduct, deleteProduct, getCategories, addCategory, deleteCategory, renameCategory };
