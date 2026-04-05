/**
 * Category Service
 * Manages product categories with CRUD operations
 * Data persisted in localStorage
 */

const CATEGORIES_KEY = 'perfume_categories';

// Default categories for new installations
const DEFAULT_CATEGORIES = [
  'Eau de Parfum',
  'Eau de Toilette',
  'Eau de Cologne',
  'Body Spray',
  'Roll-on',
  'Perfume Oil',
  'Attar'
];

/**
 * Get all categories from localStorage
 */
export const getAllCategories = () => {
  try {
    const data = localStorage.getItem(CATEGORIES_KEY);
    if (!data) {
      // Initialize with defaults
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting categories:', error);
    return DEFAULT_CATEGORIES;
  }
};

/**
 * Add a new category
 */
export const addCategory = (name) => {
  if (!name || name.trim() === '') {
    throw new Error('Category name cannot be empty');
  }

  const categories = getAllCategories();
  const trimmed = name.trim();

  // Check for duplicates
  if (categories.some(cat => cat.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error('Category already exists');
  }

  categories.push(trimmed);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  return categories;
};

/**
 * Edit an existing category
 */
export const editCategory = (oldName, newName) => {
  if (!newName || newName.trim() === '') {
    throw new Error('Category name cannot be empty');
  }

  const categories = getAllCategories();
  const index = categories.findIndex(cat => cat === oldName);

  if (index === -1) {
    throw new Error('Category not found');
  }

  const trimmed = newName.trim();

  // Check for duplicates (excluding the one being edited)
  if (categories.some((cat, i) => i !== index && cat.toLowerCase() === trimmed.toLowerCase())) {
    throw new Error('Category already exists');
  }

  categories[index] = trimmed;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  return categories;
};

/**
 * Delete a category
 */
export const deleteCategory = (name) => {
  const categories = getAllCategories();
  const filtered = categories.filter(cat => cat !== name);

  if (filtered.length === categories.length) {
    throw new Error('Category not found');
  }

  if (filtered.length === 0) {
    throw new Error('Cannot delete all categories. At least one category required.');
  }

  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
  return filtered;
};

/**
 * Get category options for dropdown/select
 */
export const getCategoryOptions = () => {
  return getAllCategories().map(cat => ({
    value: cat,
    label: cat
  }));
};

/**
 * Validate if a category exists
 */
export const validateCategory = (name) => {
  return getAllCategories().some(cat => cat === name);
};

/**
 * Reset categories to defaults
 */
export const resetCategories = () => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
};
