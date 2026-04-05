/**
 * PC Identifier Service
 * Generates unique PC identifier for licensing
 * Uses browser/system fingerprinting to create unique ID
 */

/**
 * Generate a unique PC identifier
 * Combines multiple browser/system identifiers to create a fingerprint
 */
export const generatePCIdentifier = () => {
  try {
    const fingerprints = [];

    // 1. User Agent (browser info)
    fingerprints.push(navigator.userAgent);

    // 2. Platform
    fingerprints.push(navigator.platform);

    // 3. Language
    fingerprints.push(navigator.language);

    // 4. Screen resolution
    fingerprints.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);

    // 5. Timezone offset
    fingerprints.push(new Date().getTimezoneOffset().toString());

    // 6. LocalStorage available
    fingerprints.push(isLocalStorageAvailable() ? '1' : '0');

    // 7. SessionStorage available
    fingerprints.push(isSessionStorageAvailable() ? '1' : '0');

    // 8. Cookie enabled
    fingerprints.push(navigator.cookieEnabled ? '1' : '0');

    // 9. Hardware concurrency (number of CPUs)
    if (navigator.hardwareConcurrency) {
      fingerprints.push(navigator.hardwareConcurrency.toString());
    }

    // 10. Device memory
    if (navigator.deviceMemory) {
      fingerprints.push(navigator.deviceMemory.toString());
    }

    // 11. Max touch points
    if (navigator.maxTouchPoints) {
      fingerprints.push(navigator.maxTouchPoints.toString());
    }

    // Combine all fingerprints
    const combined = fingerprints.join('|');

    // Create hash (simple hash function)
    const hash = simpleHash(combined);

    return hash;
  } catch (error) {
    console.error('Error generating PC identifier:', error);
    return 'UNKNOWN_' + Date.now();
  }
};

/**
 * Simple hash function
 * Creates a consistent hash from string input
 */
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

/**
 * Get or create PC identifier
 * Stores identifier in localStorage for consistency
 */
export const getPCIdentifier = () => {
  const storedId = localStorage.getItem('_pc_id');

  if (storedId) {
    return storedId;
  }

  const newId = generatePCIdentifier();
  localStorage.setItem('_pc_id', newId);
  return newId;
};

/**
 * Get PC identifier info (for display/debugging)
 */
export const getPCIdentifierInfo = () => {
  return {
    identifier: getPCIdentifier(),
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    generatedAt: localStorage.getItem('_pc_id_generated_at') || new Date().toISOString()
  };
};

/**
 * Reset PC identifier (admin only)
 */
export const resetPCIdentifier = () => {
  localStorage.removeItem('_pc_id');
  localStorage.removeItem('_pc_id_generated_at');
  return getPCIdentifier();
};

/**
 * Check if localStorage is available
 */
const isLocalStorageAvailable = () => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check if sessionStorage is available
 */
const isSessionStorageAvailable = () => {
  try {
    const test = '__test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Export module
 */
export default {
  generatePCIdentifier,
  getPCIdentifier,
  getPCIdentifierInfo,
  resetPCIdentifier
};
