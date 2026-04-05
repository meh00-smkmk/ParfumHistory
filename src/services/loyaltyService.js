/**
 * Loyalty Service
 * Manages customer loyalty - tracks purchases and calculates discounts
 * Based on percentage discount system for repeat customers
 */

const LOYALTY_KEY = 'perfume_loyalty_customers';

/**
 * Initialize loyalty system
 */
export const initializeLoyalty = () => {
  if (!localStorage.getItem(LOYALTY_KEY)) {
    localStorage.setItem(LOYALTY_KEY, JSON.stringify({}));
  }
};

/**
 * Get all customers
 */
export const getAllCustomers = () => {
  try {
    const data = localStorage.getItem(LOYALTY_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error getting customers:', error);
    return {};
  }
};

/**
 * Get customer profile by phone
 */
export const getCustomer = (phone) => {
  if (!phone || phone.trim() === '') {
    return null;
  }

  const normalized = normalizePhone(phone);
  const customers = getAllCustomers();
  return customers[normalized] || null;
};

/**
 * Record a purchase for a customer
 */
export const recordPurchase = (phone, amount) => {
  if (!phone || phone.trim() === '') {
    return null;
  }

  const normalized = normalizePhone(phone);
  const customers = getAllCustomers();

  if (!customers[normalized]) {
    customers[normalized] = {
      phone: normalized,
      totalSpent: 0,
      purchaseCount: 0,
      lastPurchase: null,
      createdAt: new Date().toISOString()
    };
  }

  customers[normalized].totalSpent += amount;
  customers[normalized].purchaseCount += 1;
  customers[normalized].lastPurchase = new Date().toISOString();

  localStorage.setItem(LOYALTY_KEY, JSON.stringify(customers));
  return customers[normalized];
};

/**
 * Calculate discount percentage based on total spent
 * Progressive discount tiers:
 * - 0 - 50,000 DZD: 0% (no discount, first customer)
 * - 50,001 - 150,000 DZD: 5% discount
 * - 150,001 - 300,000 DZD: 10% discount
 * - 300,001+: 15% discount
 */
export const calculateDiscount = (phone) => {
  if (!phone || phone.trim() === '') {
    return 0;
  }

  const customer = getCustomer(phone);
  if (!customer) {
    return 0;
  }

  const total = customer.totalSpent || 0;

  if (total <= 50000) {
    return 0;
  } else if (total <= 150000) {
    return 5;
  } else if (total <= 300000) {
    return 10;
  } else {
    return 15;
  }
};

/**
 * Get loyalty tier name
 */
export const getLoyaltyTierName = (phone) => {
  const discount = calculateDiscount(phone);

  if (discount === 0) {
    return 'New Customer';
  } else if (discount === 5) {
    return 'Silver';
  } else if (discount === 10) {
    return 'Gold';
  } else if (discount === 15) {
    return 'Platinum';
  }
  return 'Unknown';
};

/**
 * Get loyalty tier thresholds for display
 */
export const getLoyaltyTiers = () => {
  return [
    { name: 'New Customer', minSpent: 0, maxSpent: 50000, discount: 0 },
    { name: 'Silver', minSpent: 50001, maxSpent: 150000, discount: 5 },
    { name: 'Gold', minSpent: 150001, maxSpent: 300000, discount: 10 },
    { name: 'Platinum', minSpent: 300001, maxSpent: Infinity, discount: 15 }
  ];
};

/**
 * Apply discount to amount
 */
export const applyDiscount = (phone, amount) => {
  const discountPercent = calculateDiscount(phone);
  const discountAmount = (amount * discountPercent) / 100;
  return {
    original: amount,
    discountPercent,
    discountAmount,
    final: amount - discountAmount
  };
};

/**
 * Get customer summary for display
 */
export const getCustomerSummary = (phone) => {
  const customer = getCustomer(phone);

  if (!customer) {
    return {
      isNew: true,
      tier: 'New Customer',
      totalSpent: 0,
      purchaseCount: 0,
      discount: 0,
      progressToNextTier: 50000
    };
  }

  const discount = calculateDiscount(phone);
  const tier = getLoyaltyTierName(phone);

  let progressToNextTier = 0;
  if (customer.totalSpent < 50000) {
    progressToNextTier = 50000 - customer.totalSpent;
  } else if (customer.totalSpent < 150000) {
    progressToNextTier = 150000 - customer.totalSpent;
  } else if (customer.totalSpent < 300000) {
    progressToNextTier = 300000 - customer.totalSpent;
  }

  return {
    isNew: false,
    phone: customer.phone,
    tier,
    totalSpent: customer.totalSpent,
    purchaseCount: customer.purchaseCount,
    discount,
    progressToNextTier,
    lastPurchase: customer.lastPurchase
  };
};

/**
 * Search customers
 */
export const searchCustomers = (query) => {
  const customers = getAllCustomers();
  return Object.values(customers).filter(customer =>
    customer.phone.includes(query.toLowerCase())
  );
};

/**
 * Delete customer data
 */
export const deleteCustomer = (phone) => {
  const normalized = normalizePhone(phone);
  const customers = getAllCustomers();
  delete customers[normalized];
  localStorage.setItem(LOYALTY_KEY, JSON.stringify(customers));
};

/**
 * Normalize phone number (remove spaces, dashes, etc.)
 */
const normalizePhone = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Get statistics
 */
export const getStatistics = () => {
  const customers = getAllCustomers();
  const customerList = Object.values(customers);

  const totalCustomers = customerList.length;
  const totalRevenue = customerList.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const repeatCustomers = customerList.filter(c => (c.purchaseCount || 0) > 1).length;
  const averageOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return {
    totalCustomers,
    repeatCustomers,
    newCustomers: totalCustomers - repeatCustomers,
    totalRevenue,
    averageOrderValue: averageOrderValue.toFixed(2),
    repurchaseRate: totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(2) : 0
  };
};

// Initialize on load
initializeLoyalty();
