/**
 * License Generation System Test Script
 * Tests the entire admin key generation workflow
 * 
 * This script runs in Node.js to verify:
 * 1. License generation logic
 * 2. License validation logic
 * 3. Checksum calculation consistency
 * 4. Base64 encoding/decoding
 */

// ============================================
// LICENSES GENERATOR LOGIC (from licenseGenerator.js)
// ============================================

const generateLicenseForCustomer = (pcIdentifier, expiryDays = 365) => {
  if (!pcIdentifier || pcIdentifier.trim() === '') {
    throw new Error('PC Identifier is required');
  }

  if (expiryDays < 1 || expiryDays > 36500) {
    throw new Error('Expiry days must be between 1 and 36500');
  }

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  
  const expiryTimestamp = expiryDate.getTime().toString(); // Convert to string for consistency
  const checksum = createChecksumForGeneration(pcIdentifier, expiryTimestamp);
  
  // Format: PC_ID|EXPIRY|CHECKSUM
  const license = `${pcIdentifier}|${expiryTimestamp}|${checksum}`;
  return encodeToReadableFormat(license);
};

const generateLicensesBatch = (customerPCIds, expiryDays = 365) => {
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

const createChecksumForGeneration = (pcId, expiryTimestamp) => {
  const combined = `${pcId}|${expiryTimestamp}`;
  let checksum = 0;

  for (let i = 0; i < combined.length; i++) {
    checksum += combined.charCodeAt(i);
  }

  return (checksum % 10000).toString(16).padStart(4, '0');
};

const encodeToReadableFormat = (license) => {
  try {
    return Buffer.from(license, 'utf-8').toString('base64');
  } catch (e) {
    console.error('Encoding error:', e);
    return null;
  }
};

// ============================================
// LICENSE VALIDATOR LOGIC (from licenseValidator.js)
// ============================================

const validateLicense = (licenseCode, currentPCId = null) => {
  try {
    const pcId = currentPCId || 'test-pc-id';

    // Check if license is stored
    if (!licenseCode) {
      return {
        valid: false,
        error: 'No license found. Please enter a license code.',
        details: null
      };
    }

    // Decode license
    const decodedLicense = decodeFromReadableFormat(licenseCode);
    
    if (!decodedLicense) {
      return {
        valid: false,
        error: 'License code format is invalid. Please check and try again.',
        details: null
      };
    }
    
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
    const expectedChecksum = createChecksumForValidation(licensePCId, expiryTimestampStr);
    
    console.log(`\n[CHECKSUM DEBUG]`);
    console.log(`  Provided checksum: ${checksum}`);
    console.log(`  Expected checksum: ${expectedChecksum}`);
    console.log(`  Match: ${checksum === expectedChecksum}`);
    
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
        error: `License is tied to different PC. This PC: ${pcId.substring(0, 8)}... Licensed PC: ${licensePCId.substring(0, 8)}...`,
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

const createChecksumForValidation = (pcId, expiryTimestamp) => {
  const combined = `${pcId}|${expiryTimestamp}`;
  let checksum = 0;

  for (let i = 0; i < combined.length; i++) {
    checksum += combined.charCodeAt(i);
  }

  return (checksum % 10000).toString(16).padStart(4, '0');
};

const decodeFromReadableFormat = (license) => {
  try {
    return Buffer.from(license, 'base64').toString('utf-8');
  } catch (e) {
    console.error('Decoding error:', e);
    return null;
  }
};

// ============================================
// TEST SUITE
// ============================================

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     LICENSE GENERATION SYSTEM - COMPREHENSIVE TEST         ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// TEST 1: Generate a simple license
console.log('TEST 1: Generate License Code');
console.log('───────────────────────────────────────────────────────────');

const testPCId = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
const expiryDays = 365;

let generatedCode = null;
try {
  generatedCode = generateLicenseForCustomer(testPCId, expiryDays);
  console.log(`✅ License generated successfully`);
  console.log(`   PC ID: ${testPCId}`);
  console.log(`   Expiry: ${expiryDays} days`);
  console.log(`   Code: ${generatedCode.substring(0, 50)}...`);
  console.log(`   Code Length: ${generatedCode.length} characters`);
} catch (e) {
  console.log(`❌ Error: ${e.message}`);
}

// TEST 2: Validate the generated license
console.log('\n\nTEST 2: Validate Generated License');
console.log('───────────────────────────────────────────────────────────');

if (generatedCode) {
  const result = validateLicense(generatedCode, testPCId);
  
  if (result.valid) {
    console.log(`✅ License validation PASSED`);
    console.log(`   Message: ${result.details.message}`);
    console.log(`   Days until expiry: ${result.details.daysUntilExpiry}`);
  } else {
    console.log(`❌ License validation FAILED`);
    console.log(`   Error: ${result.error}`);
  }
}

// TEST 3: Batch generation
console.log('\n\nTEST 3: Batch License Generation');
console.log('───────────────────────────────────────────────────────────');

const batchPCIds = [
  'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7',
  'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8'
];

try {
  const batchResults = generateLicensesBatch(batchPCIds, 365);
  console.log(`✅ Batch generation completed`);
  console.log(`   Generated licenses: ${Object.keys(batchResults).length}`);
  
  Object.entries(batchResults).forEach(([pcId, code], index) => {
    console.log(`\n   License ${index + 1}:`);
    console.log(`   - PC ID: ${pcId.substring(0, 16)}...`);
    console.log(`   - Code: ${code.substring(0, 40)}...`);
  });
} catch (e) {
  console.log(`❌ Error: ${e.message}`);
}

// TEST 4: Checksum consistency
console.log('\n\nTEST 4: Checksum Consistency Check');
console.log('───────────────────────────────────────────────────────────');

const testPCId2 = 'test123';
const testTimestamp = '1701475200000'; // Example timestamp

const checksum1 = createChecksumForGeneration(testPCId2, testTimestamp);
const checksum2 = createChecksumForValidation(testPCId2, testTimestamp);

console.log(`PC ID: ${testPCId2}`);
console.log(`Timestamp: ${testTimestamp}`);
console.log(`Generator checksum: ${checksum1}`);
console.log(`Validator checksum: ${checksum2}`);

if (checksum1 === checksum2) {
  console.log(`✅ Checksums match perfectly`);
} else {
  console.log(`❌ CHECKSUM MISMATCH! This is the bug!`);
}

// TEST 5: Invalid license detection
console.log('\n\nTEST 5: Invalid License Detection');
console.log('───────────────────────────────────────────────────────────');

const invalidLicenses = [
  { code: 'invalid123', name: 'Garbage text' },
  { code: Buffer.from('pc|timestamp|wrongchecksum').toString('base64'), name: 'Wrong checksum' },
  { code: Buffer.from('differentpc|1701475200000|0000').toString('base64'), name: 'Different PC' }
];

invalidLicenses.forEach((test, index) => {
  const result = validateLicense(test.code, testPCId);
  console.log(`\n   Test ${index + 1}: ${test.name}`);
  console.log(`   Result: ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
  if (!result.valid) {
    console.log(`   Reason: ${result.error}`);
  }
});

// TEST 6: Encoding/Decoding round-trip
console.log('\n\nTEST 6: Base64 Encoding/Decoding Round-Trip');
console.log('───────────────────────────────────────────────────────────');

const originalLicense = 'mypc123|1701475200000|abc1';
const encoded = encodeToReadableFormat(originalLicense);
const decoded = decodeFromReadableFormat(encoded);

console.log(`Original: ${originalLicense}`);
console.log(`Encoded: ${encoded}`);
console.log(`Decoded: ${decoded}`);

if (originalLicense === decoded) {
  console.log(`✅ Round-trip successful`);
} else {
  console.log(`❌ Round-trip failed!`);
}

// FINAL SUMMARY
console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                    TEST SUMMARY                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('✅ Tests completed. Review results above for issues.');
console.log('\nNext steps:');
console.log('1. If all tests pass, the license system is working correctly');
console.log('2. If checksum test fails, check the checksum calculation logic');
console.log('3. Test in the browser at http://127.0.0.1:5173/admin\n');
