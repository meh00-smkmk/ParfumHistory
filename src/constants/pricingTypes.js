/**
 * Pricing Types Definitions
 * Three pricing methods available for products
 */

export const PRICING_TYPES = {
  COST_MARKUP: {
    id: 'cost_markup',
    name: 'Cost + Markup %',
    description: 'Enter product cost, then set markup percentage',
    example: 'Cost: 500 DZD, Markup: 30% → Price: 650 DZD',
    fields: ['cost', 'markupPercent']
  },
  FIXED_PRICE: {
    id: 'fixed_price',
    name: 'Fixed Price',
    description: 'Enter exact selling price',
    example: 'Price: 1,200 DZD',
    fields: ['price']
  },
  TIERED: {
    id: 'tiered',
    name: 'Tiered Pricing',
    description: 'Different prices for different quantities',
    example: '1-5: 500 DZD, 6-10: 450 DZD, 11+: 400 DZD',
    fields: ['tiers']  // Array of {minQty, maxQty, price}
  }
};

/**
 * Get pricing type by ID
 */
export const getPricingType = (id) => {
  for (const type of Object.values(PRICING_TYPES)) {
    if (type.id === id) {
      return type;
    }
  }
  return null;
};

/**
 * Get all pricing types as options for dropdown
 */
export const getAllPricingTypeOptions = () => {
  return Object.values(PRICING_TYPES).map(type => ({
    value: type.id,
    label: type.name,
    description: type.description
  }));
};

/**
 * Validate pricing data based on type
 */
export const validatePricingData = (pricingType, data) => {
  if (pricingType === PRICING_TYPES.COST_MARKUP.id) {
    if (!data.cost || data.cost <= 0) {
      throw new Error('Cost must be greater than 0');
    }
    if (data.markupPercent === undefined || data.markupPercent < 0) {
      throw new Error('Markup percentage must be >= 0');
    }
    if (data.markupPercent > 1000) {
      throw new Error('Markup percentage seems too high (max 1000%)');
    }
  } else if (pricingType === PRICING_TYPES.FIXED_PRICE.id) {
    if (!data.price || data.price <= 0) {
      throw new Error('Price must be greater than 0');
    }
  } else if (pricingType === PRICING_TYPES.TIERED.id) {
    if (!Array.isArray(data.tiers) || data.tiers.length === 0) {
      throw new Error('At least one tier required');
    }
    for (const tier of data.tiers) {
      if (!tier.minQty || tier.minQty < 1) {
        throw new Error('Minimum quantity must be >= 1');
      }
      if (!tier.price || tier.price <= 0) {
        throw new Error('Tier price must be greater than 0');
      }
      if (tier.maxQty && tier.maxQty < tier.minQty) {
        throw new Error('Max quantity must be >= Min quantity');
      }
    }
  }
};

/**
 * Get default pricing data structure based on type
 */
export const getDefaultPricingData = (pricingType) => {
  if (pricingType === PRICING_TYPES.COST_MARKUP.id) {
    return {
      cost: 0,
      markupPercent: 30  // Default 30% markup
    };
  } else if (pricingType === PRICING_TYPES.FIXED_PRICE.id) {
    return {
      price: 0
    };
  } else if (pricingType === PRICING_TYPES.TIERED.id) {
    return {
      tiers: [
        { minQty: 1, maxQty: 5, price: 0 },
        { minQty: 6, maxQty: 10, price: 0 },
        { minQty: 11, maxQty: null, price: 0 }  // null means unlimited
      ]
    };
  }
  return {};
};

/**
 * Export pricing structure for database/API
 */
export const exportPricingData = (pricingType, data) => {
  return {
    pricingType,
    pricingData: data,
    createdAt: new Date().toISOString()
  };
};
