/**
 * Ticket Types Definition
 * Defines different types of tickets that can be printed in the system
 * Receipt, Invoice, Label, Refund
 */

export const TICKET_TYPES = {
  RECEIPT: {
    id: 'receipt',
    name: 'Sales Receipt',
    header: 'SALES RECEIPT',
    icon: '🧾',
    description: 'Customer receipt for point-of-sale transaction',
    showItems: true,
    showTotals: true,
    showPaymentMethod: true,
    showCustomer: false,
    paperWidth: 80, // thermal printer width in mm
    copies: 1,
  },

  INVOICE: {
    id: 'invoice',
    name: 'Invoice',
    header: 'INVOICE',
    icon: '📄',
    description: 'Detailed invoice for records and accounting',
    showItems: true,
    showTotals: true,
    showPaymentMethod: true,
    showCustomer: true,
    paperWidth: 210, // A4 width in mm
    copies: 2,
  },

  LABEL: {
    id: 'label',
    name: 'Product Label',
    header: 'PRODUCT LABEL',
    icon: '🏷️',
    description: 'Sticker label with product details and price',
    showItems: true,
    showPrice: true,
    showBarcode: true,
    paperWidth: 60, // label width in mm
    copies: 1,
  },

  REFUND: {
    id: 'refund',
    name: 'Refund Authorization',
    header: 'REFUND AUTHORIZATION',
    icon: '↩️',
    description: 'Document for refund and return transactions',
    showItems: true,
    showReason: true,
    showCustomer: true,
    paperWidth: 80,
    copies: 2,
  },
}

/**
 * Get ticket type by ID
 */
export const getTicketType = (typeId) => {
  return Object.values(TICKET_TYPES).find((t) => t.id === typeId) || TICKET_TYPES.RECEIPT
}

/**
 * Get all ticket types as array
 */
export const getAllTicketTypes = () => {
  return Object.values(TICKET_TYPES)
}

/**
 * Get ticket type options for select dropdown
 */
export const getTicketTypeOptions = () => {
  return Object.values(TICKET_TYPES).map((t) => ({
    value: t.id,
    label: `${t.icon} ${t.name}`,
    description: t.description,
  }))
}

export default TICKET_TYPES
