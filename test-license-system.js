/**
 * Test License System
 * Simulates the generation and validation flow to ensure they match
 */

// Simulate createChecksum function
const createChecksum = (pcId, expiryTimestamp) => {
  const combined = `${pcId}|${expiryTimestamp}`;
  let checksum = 0;

  for (let i = 0; i < combined.length; i++) {
    checksum += combined.charCodeAt(i);
  }

  return (checksum % 10000).toString(16).padStart(4, '0');
};

// Simulate encodeToReadableFormat
const encodeToReadableFormat = (license) => {
  return Buffer.from(license).toString('base64');
};

// Simulate decodeFromReadableFormat
const decodeFromReadableFormat = (license) => {
  return Buffer.from(license, 'base64').toString();
};

// Simulate generateLicenseForCustomer
const generateLicenseForCustomer = (pcIdentifier, expiryDays = 365) => {
  if (!pcIdentifier || pcIdentifier.trim() === '') {
    throw new Error('PC Identifier is required');
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  
  const expiryTimestamp = expiryDate.getTime().toString(); // STRING
  const checksum = createChecksum(pcIdentifier, expiryTimestamp);
  
  const license = `${pcIdentifier}|${expiryTimestamp}|${checksum}`;
  return encodeToReadableFormat(license);
};

// Simulate validateLicense
const validateLicense = (licenseCode, currentPCId = null) => {
  try {
    const pcId = currentPCId;

    const licenseToValidate = licenseCode;

    // Decode license
    const decodedLicense = decodeFromReadableFormat(licenseToValidate);
    const parts = decodedLicense.split('|');

    if (parts.length !== 3) {
      return {
        valid: false,
        error: 'Invalid license format.',
        details: null
      };
    }

    const [licensePCId, expiryTimestampStr, checksum] = parts;

    // Verify checksum (must use the string form from license, not parsed number)
    const expectedChecksum = createChecksum(licensePCId, expiryTimestampStr);
    console.log('License PC ID:', licensePCId);
    console.log('Expiry Timestamp (from license):', expiryTimestampStr);
    console.log('Checksum (from license):', checksum);
    console.log('Expected Checksum:', expectedChecksum);
    console.log('Checksums match:', checksum === expectedChecksum);
    
    if (checksum !== expectedChecksum) {
      return {
        valid: false,
        error: 'License code is corrupted or invalid.',
        details: null
      };
    }

    // Check PC ID match
    if (licensePCId !== pcId) {
      return {
        valid: false,
        error: `License is tied to different PC.`,
        details: { currentPC: pcId, licensedPC: licensePCId }
      };
    }

    // Check expiry
    const expiryTimestamp = parseInt(expiryTimestampStr);
    const expiry = new Date(expiryTimestamp);
    const now = new Date();

    if (now > expiry) {
      return {
        valid: false,
        error: `License expired on ${expiry.toLocaleDateString()}. Please renew.`,
        details: { expiry: expiry.toISOString() }
      };
    }

    // All checks passed
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

    return {
      valid: true,
      error: null,
      details: {
        pcId: licensePCId,
        expiry: expiry.toISOString(),
        daysUntilExpiry,
        message: `License valid. Expires in ${daysUntilExpiry} days.`
      }
    };
  } catch (error) {
    console.error('Error validating license:', error);
    return {
      valid: false,
      error: 'Error validating license. Please try again.',
      details: null
    };
  }
};

// TEST
console.log('\n===== TESTING LICENSE GENERATION & VALIDATION =====\n');

const testPCId = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
const testExpiryDays = 365;

console.log(`📝 Generating license for PC ID: ${testPCId}`);
const generatedLicense = generateLicenseForCustomer(testPCId, testExpiryDays);
console.log(`Generated License Code: ${generatedLicense}\n`);

console.log(`✅ Validating license with SAME PC ID...\n`);
const validationResult = validateLicense(generatedLicense, testPCId);
console.log(`\nValidation Result:`, validationResult);

if (validationResult.valid) {
  console.log('\n✅ SUCCESS! License is valid and working!\n');
} else {
  console.log(`\n❌ FAILED: ${validationResult.error}\n`);
}
