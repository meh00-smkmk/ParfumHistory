/**
 * Expense Service
 * Full CRUD for expenses persisted in localStorage
 * Categories: Loyer, Salaires, Fournitures, Transport, Matières premières, Autre
 */

const EXPENSES_KEY = 'perfume_expenses';

const DEFAULT_CATEGORIES = [
  'Loyer',
  'Salaires',
  'Fournitures',
  'Transport',
  'Matières premières',
  'Electricité',
  'Eau',
  'Internet',
  'Marketing',
  'Maintenance',
  'Autre',
];

/**
 * Get all expenses
 */
export const getAllExpenses = () => {
  try {
    const data = localStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading expenses:', error);
    return [];
  }
};

/**
 * Save expense (create or update)
 */
export const saveExpense = (expense) => {
  const expenses = getAllExpenses();
  
  if (expense.id) {
    // Update existing
    const idx = expenses.findIndex(e => e.id === expense.id);
    if (idx !== -1) {
      expenses[idx] = { ...expenses[idx], ...expense, updatedAt: new Date().toISOString() };
    }
  } else {
    // Create new
    const newExpense = {
      id: `EXP-${Date.now()}`,
      category: expense.category || 'Autre',
      description: expense.description || '',
      amount: parseFloat(expense.amount) || 0,
      date: expense.date || new Date().toISOString().split('T')[0],
      status: expense.status || 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expenses.unshift(newExpense);
  }
  
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return expenses;
};

/**
 * Delete expense by ID
 */
export const deleteExpense = (id) => {
  const expenses = getAllExpenses().filter(e => e.id !== id);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return expenses;
};

/**
 * Get expenses by date range
 */
export const getExpensesByDateRange = (startDate, endDate) => {
  const expenses = getAllExpenses();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return expenses.filter(e => {
    const expDate = new Date(e.date).getTime();
    return expDate >= start && expDate <= end;
  });
};

/**
 * Get total expenses
 */
export const getTotalExpenses = (expenseList = null) => {
  const expenses = expenseList || getAllExpenses();
  return expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
};

/**
 * Get expenses grouped by category
 */
export const getExpensesByCategory = (expenseList = null) => {
  const expenses = expenseList || getAllExpenses();
  const grouped = {};
  expenses.forEach(e => {
    if (!grouped[e.category]) grouped[e.category] = 0;
    grouped[e.category] += e.amount || 0;
  });
  return Object.entries(grouped).map(([category, amount]) => ({ category, amount }));
};

/**
 * Get default categories
 */
export const getCategories = () => DEFAULT_CATEGORIES;

export default {
  getAllExpenses,
  saveExpense,
  deleteExpense,
  getExpensesByDateRange,
  getTotalExpenses,
  getExpensesByCategory,
  getCategories,
};
