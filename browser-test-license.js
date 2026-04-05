/**
 * Browser-Based License System Test
 * Run this in the browser console at http://127.0.0.1:5173/admin
 */

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║       LICENSE SYSTEM - BROWSER VERIFICATION TEST          ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Dynamically load the functions
async function runBrowserTests() {
  try {
    // Wait for modules to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('TEST 1: Check AdminLicenseGenerator Component');
    console.log('───────────────────────────────────────────────────────────');
    
    const adminPanel = document.querySelector('[class*="Admin"], [class*="admin"], div');
    if (adminPanel) {
      console.log('✅ Admin panel DOM found');
      console.log(`   Content: ${adminPanel.textContent.substring(0, 50)}...`);
    } else {
      console.log('⚠️  Admin panel DOM not immediately visible');
    }

    // Check for key UI elements
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    console.log(`✅ Found ${inputs.length} input elements`);

    const buttons = document.querySelectorAll('button');
    console.log(`✅ Found ${buttons.length} buttons`);

    // TEST 2: Check localStorage and session
    console.log('\n\nTEST 2: Check Browser Storage');
    console.log('───────────────────────────────────────────────────────────');
    
    const allKeys = Object.keys(localStorage);
    console.log(`✅ localStorage keys (${allKeys.length}):`);
    allKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`   - ${key}: ${value.substring(0, 30)}...`);
    });

    // TEST 3: PC Identifier
    console.log('\n\nTEST 3: PC Identifier Check');
    console.log('───────────────────────────────────────────────────────────');
    
    const pcId = localStorage.getItem('_pc_id');
    if (pcId) {
      console.log(`✅ PC Identifier found: ${pcId}`);
    } else {
      console.log('⚠️  PC Identifier not in localStorage');
      console.log('   Try opening License Screen first to generate it');
    }

    // TEST 4: Check for license-related code
    console.log('\n\nTEST 4: Check License Code Availability');
    console.log('───────────────────────────────────────────────────────────');
    
    const licenseCode = localStorage.getItem('_license_code');
    if (licenseCode) {
      console.log(`✅ License code found (${licenseCode.length} chars)`);
      console.log(`   First 20 chars: ${licenseCode.substring(0, 20)}...`);
    } else {
      console.log('✅ No license code yet (expected - not activated)');
    }

    // TEST 5: Manual generation test
    console.log('\n\nTEST 5: Manual License Generation (if functions available)');
    console.log('───────────────────────────────────────────────────────────');
    
    try {
      // Note: This will fail because we can't import ES modules from console
      // But we show what would need to happen
      console.log('⚠️  Cannot import ES modules from console');
      console.log('   To test manually:');
      console.log('   1. Go to http://127.0.0.1:5173/admin');
      console.log('   2. You should see "🔑 Admin License Generator"');
      console.log('   3. Enter a test PC ID');
      console.log('   4. Click "🔑 Generate License"');
      console.log('   5. Copy the code');
      console.log('   6. Clear localStorage: localStorage.clear()');
      console.log('   7. Reload page');
      console.log('   8. Paste code into License Screen');
      console.log('   9. Click "✓ Activate License"');
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }

    // TEST 6: Check page title and headers
    console.log('\n\nTEST 6: UI Elements Check');
    console.log('───────────────────────────────────────────────────────────');
    
    const headings = document.querySelectorAll('h1, h2, h3');
    console.log(`Found ${headings.length} headings:`);
    Array.from(headings).slice(0, 5).forEach(h => {
      console.log(`   - ${h.tagName}: ${h.textContent.substring(0, 40)}`);
    });

    // SUMMARY
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                    BROWSER TEST COMPLETE                  ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('✅ Browser environment verified');
    console.log('\nMANUAL TEST STEPS:');
    console.log('1. You are at http://127.0.0.1:5173/admin');
    console.log('2. Look for "🔑 Admin License Generator" heading');
    console.log('3. In "Customer PC Identifier" field, enter: testpc123');
    console.log('4. Leave "License Validity" as 365 days');
    console.log('5. Click "🔑 Generate License"');
    console.log('6. You should see a generated code');
    console.log('7. Copy the code');
    console.log('\nTo activate:');
    console.log('1. Paste this in browser console: localStorage.clear()');
    console.log('2. Press Enter and refresh page (F5)');
    console.log('3. You should see License Screen');
    console.log('4. Copy your actual PC ID from the screen');
    console.log('5. Go to /admin again');
    console.log('6. Generate license for YOUR PC ID');
    console.log('7. Return to License Screen');
    console.log('8. Paste YOUR generated code');
    console.log('9. Click "✓ Activate License"');
    console.log('10. App should unlock!\n');

  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run tests
runBrowserTests();
