/**
 * DEVELOPER ONLY - License Code Generator
 * 
 * This is an INTERNAL tool for the app maker/developer ONLY
 * It should NEVER be shipped with the app or given to users
 * 
 * USE CASE:
 * 1. Customer asks for a license
 * 2. They provide their PC Identifier (from the License Screen)
 * 3. You run this tool with their PC ID
 * 4. You get a license code
 * 5. You send them the code via secure email
 * 6. They paste it into the app
 * 
 * In production, this would be a secure backend endpoint:
 * POST /api/admin/generate-license
 * - Requires admin authentication token
 * - Only accessible by app maker
 * - Logs all generated licenses
 * - Rate limited
 */

/**
 * Generate a license code for a customer PC
 * DEVELOPER USE ONLY
 * 
 * @param {string} pcIdentifier - The PC ID from customer's License Screen
 * @param {number} expiryDays - How many days until license expires (default: 365)
 * @returns {string} License code to send to customer
 */
export const generateLicenseForCustomer = (pcIdentifier, expiryDays = 365) => {
  if (!pcIdentifier || pcIdentifier.trim() === '') {
    throw new Error('PC Identifier is required');
  }

  if (expiryDays < 1 || expiryDays > 36500) {
    throw new Error('Expiry days must be between 1 and 36500');
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  
  const expiryTimestamp = expiryDate.getTime().toString(); // Convert to string for consistency
  const checksum = createChecksum(pcIdentifier, expiryTimestamp);
  
  // Format: PC_ID|EXPIRY|CHECKSUM
  const license = `${pcIdentifier}|${expiryTimestamp}|${checksum}`;
  return encodeToReadableFormat(license);
};

/**
 * Batch generate licenses for multiple customers
 * DEVELOPER USE ONLY
 */
export const generateLicensesBatch = (customerPCIds, expiryDays = 365) => {
  if (!Array.isArray(customerPCIds)) {
    throw new Error('customerPCIds must be an array');
  }

  const licenses = {};
  for (const pcId of customerPCIds) {
    try {
      licenses[pcId] = generateLicenseForCustomer(pcId, expiryDays);
    } catch (e) {
      licenses[pcId] = `ERROR: ${e.message}`;
    }
  }

  return licenses;
};

/**
 * Create checksum for license validation
 */
const createChecksum = (pcId, expiryTimestamp) => {
  const combined = `${pcId}|${expiryTimestamp}`;
  let checksum = 0;

  for (let i = 0; i < combined.length; i++) {
    checksum += combined.charCodeAt(i);
  }

  return (checksum % 10000).toString(16).padStart(4, '0');
};

/**
 * Encode license to readable format (base64)
 */
const encodeToReadableFormat = (license) => {
  try {
    // Use browser's btoa (base64 encode)
    return btoa(unescape(encodeURIComponent(license)));
  } catch (e) {
    console.error('Encoding error:', e);
    return null;
  }
};

/**
 * Example usage (DEVELOPER ONLY):
 * 
 * import { generateLicenseForCustomer } from '@/utils/licenseGenerator';
 * 
 * // Customer gives you this PC Identifier from their License Screen:
 * const customerPCId = "a1b2c3d4e5f6g7h8i9j0";
 * 
 * // You generate a license for them (valid for 1 year):
 * const licenseCode = generateLicenseForCustomer(customerPCId, 365);
 * 
 * // You send them this code via secure email
 * console.log("License code for customer:", licenseCode);
 * 
 * // They paste this code into the app's License Screen
 * // The app validates and unlocks
 */

// Removed redundant exports
export default {
  generateLicenseForCustomer,
  generateLicensesBatch
};
