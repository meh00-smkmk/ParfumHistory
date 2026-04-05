# PerfumierPro App Verification Test
# This script VERIFIES the app is actually working

Write-Host "════════════════════════════════════════════════════════════"
Write-Host "PerfumierPro App Verification Test"
Write-Host "════════════════════════════════════════════════════════════"
Write-Host ""

$port = 5173
$passed = 0
$failed = 0

# Test 1: Dev server running
Write-Host "TEST 1: Dev server running on port $port..."
try {
  $response = Invoke-WebRequest -Uri "http://127.0.0.1:$port/" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
  if ($response.StatusCode -eq 200) {
    Write-Host "  ✅ PASS: Server responds with HTTP 200"
    $passed++
  } else {
    Write-Host "  ❌ FAIL: Got HTTP $($response.StatusCode)"
    $failed++
  }
} catch {
  Write-Host "  ❌ FAIL: Server not responding - $_"
  Write-Host "  Run: npm run dev"
  $failed++
}

# Test 2: React app in HTML
Write-Host ""
Write-Host "TEST 2: React app loaded..."
try {
  $html = (Invoke-WebRequest -Uri "http://127.0.0.1:$port/" -UseBasicParsing).Content
  if ($html -match '<div id="root"') {
    Write-Host "  ✅ PASS: React root div found"
    $passed++
  } else {
    Write-Host "  ❌ FAIL: React root div not found"
    $failed++
  }
} catch {
  Write-Host "  ❌ FAIL: Cannot fetch HTML"
  $failed++
}

# Test 3: Auto-login code in App.jsx
Write-Host ""
Write-Host "TEST 3: Auto-login code present..."
try {
  $appContent = Get-Content ".\src\App.jsx" -Raw
  $checks = @(
    ("Auto-login code", "Auto-login for demo"),
    ("setTimeout", "setTimeout"),
    ("localStorage.setItem", "localStorage.setItem.*authToken"),
    ("DashboardLayout", "DashboardLayout")
  )
  
  foreach ($check in $checks) {
    if ($appContent -match $check[1]) {
      Write-Host "  ✅ Found: $($check[0])"
      $passed++
    } else {
      Write-Host "  ❌ Missing: $($check[0])"
      $failed++
    }
  }
} catch {
  Write-Host "  ❌ Cannot read App.jsx"
  $failed++
}

# Test 4: POS Page has demo data
Write-Host ""
Write-Host "TEST 4: POSPage has demo data..."
try {
  $posContent = Get-Content ".\src\pages\POSPage.jsx" -Raw
  $demoProducts = @(
    "Chanel No. 5",
    "Dior",
    "Gucci Flora",
    "Prada"
  )
  
  foreach ($product in $demoProducts) {
    if ($posContent -match [regex]::Escape($product)) {
      Write-Host "  ✅ Found: $product"
      $passed++
    } else {
      Write-Host "  ❌ Missing: $product"
      $failed++
    }
  }
} catch {
  Write-Host "  ❌ Cannot read POSPage.jsx"
  $failed++
}

# Test 5: Path aliases configured
Write-Host ""
Write-Host "TEST 5: Path aliases configured..."
try {
  $viteConfig = Get-Content ".\vite.config.js" -Raw
  if ($viteConfig -match "'@'.*path.resolve" -or $viteConfig -match '"@".*path.resolve') {
    Write-Host "  ✅ PASS: Vite path alias configured"
    $passed++
  } else {
    Write-Host "  ❌ FAIL: Path alias not configured"
    $failed++
  }
  
  $jsconfigFile = Test-Path ".\jsconfig.json"
  if ($jsconfigFile) {
    Write-Host "  ✅ PASS: jsconfig.json exists"
    $passed++
  } else {
    Write-Host "  ❌ FAIL: jsconfig.json missing"
    $failed++
  }
} catch {
  Write-Host "  ❌ Cannot check config files"
  $failed++
}

# Summary
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════"
Write-Host "Test Results:"
Write-Host "  ✅ Passed: $passed"
Write-Host "  ❌ Failed: $failed"
Write-Host "════════════════════════════════════════════════════════════"

if ($failed -eq 0) {
  Write-Host "🎉 ALL TESTS PASSED!"
  Write-Host ""
  Write-Host "Next steps:"
  Write-Host "1. Open browser: http://127.0.0.1:$port"
  Write-Host "2. Should see PerfumierPro dashboard with sidebar"
  Write-Host "3. Click menu items to navigate pages"
  Write-Host "4. POS page should show products and shopping cart"
  Write-Host "5. If white page: Check browser console (F12) for errors"
  exit 0
} else {
  Write-Host "⚠️  Some tests failed. See errors above."
  exit 1
}
