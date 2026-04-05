/**
 * Pricing Service
 * Calculates final prices based on pricing type and quantity
 */

import { PRICING_TYPES } from '../constants/pricingTypes';

/**
 * Calculate price based on pricing type and data
 * @param {string} pricingType - Type of pricing (cost_markup, fixed_price, tiered)
 * @param {object} pricingData - Pricing configuration data
 * @param {number} quantity - Quantity being purchased
 * @returns {number} Final price
 */
export const calculatePrice = (pricingType, pricingData, quantity = 1) => {
  if (pricingType === PRICING_TYPES.COST_MARKUP.id) {
    const cost = pricingData.cost || 0;
    const markupPercent = pricingData.markupPercent || 0;
    return cost * (1 + markupPercent / 100);
  } else if (pricingType === PRICING_TYPES.FIXED_PRICE.id) {
    return pricingData.price || 0;
  } else if (pricingType === PRICING_TYPES.TIERED.id) {
    return calculateTieredPrice(pricingData.tiers, quantity);
  }
  return 0;
};

/**
 * Calculate tiered price based on quantity
 */
const calculateTieredPrice = (tiers, quantity) => {
  if (!Array.isArray(tiers) || tiers.length === 0) {
    return 0;
  }

  // Sort tiers by minQty
  const sortedTiers = [...tiers].sort((a, b) => a.minQty - b.minQty);

  // Find applicable tier
  for (const tier of sortedTiers) {
    const maxQty = tier.maxQty || Infinity;
    if (quantity >= tier.minQty && quantity <= maxQty) {
      return tier.price;
    }
  }

  // Return last tier price if quantity exceeds all tiers
  return sortedTiers[sortedTiers.length - 1].price;
};

/**
 * Calculate cost from pricing data
 */
export const calculateCost = (pricingType, pricingData) => {
  if (pricingType === PRICING_TYPES.COST_MARKUP.id) {
    return pricingData.cost || 0;
  }
  // For fixed price and tiered, we don't track cost separately
  return 0;
};

/**
 * Calculate profit
 */
export const calculateProfit = (pricingType, pricingData, quantity = 1) => {
  const price = calculatePrice(pricingType, pricingData, quantity);
  const cost = calculateCost(pricingType, pricingData);
  return price - cost;
};

/**
 * Get display price info for UI
 */
export const getPriceDisplayInfo = (pricingType, pricingData, quantity = 1) => {
  const price = calculatePrice(pricingType, pricingData, quantity);
  const cost = calculateCost(pricingType, pricingData);
  const profit = calculateProfit(pricingType, pricingData, quantity);
  const margin = cost > 0 ? ((profit / cost) * 100).toFixed(2) : 0;

  return {
    price,
    cost,
    profit,
    margin: `${margin}%`,
    pricingType
  };
};

/**
 * Format pricing data for display in UI
 */
export const formatPricingDataForDisplay = (pricingType, pricingData) => {
  if (pricingType === PRICING_TYPES.COST_MARKUP.id) {
    return `Cost: ${pricingData.cost} DZD + ${pricingData.markupPercent}% markup`;
  } else if (pricingType === PRICING_TYPES.FIXED_PRICE.id) {
    return `Fixed price: ${pricingData.price} DZD`;
  } else if (pricingType === PRICING_TYPES.TIERED.id) {
    return `Tiered pricing (${pricingData.tiers?.length} tiers)`;
  }
  return 'Unknown pricing type';
};

/**
 * Export module functions for use in components
 */
export default {
  calculatePrice,
  calculateCost,
  calculateProfit,
  getPriceDisplayInfo,
  formatPricingDataForDisplay
};
