# PerfumierPro App — Project Memory
## Last Updated: 2026-04-04

## Project Overview
PerfumierPro is a desktop-class POS web app for a perfume shop in Algeria.
Built with: Vite + React (JSX) | No backend server (localStorage only) | DZD currency

## Architecture
- **Router**: react-router-dom v6 with nested Routes
- **Auth**: Mock users in src/api/auth.js (manager + seller roles)
- **License**: PC-fingerprint system with base64 license codes
- **Data**: All data in localStorage (no backend DB)
- **Styling**: Inline CSS-in-JS via `<style>` tags in each component
- **Theme**: Dark mode with gold accent (#d4af37), navy background (#1a1a2e)

## Phase Status
| Phase | Status |
|-------|--------|
| 1. Setup | ✅ Complete |
| 2. APIs | ✅ Complete |
| 3. Pages | ✅ Complete |
| 4. Styling | ✅ Complete |
| 5. License System | ✅ Complete |
| 6. Advanced Features | ✅ Complete |
| 7. Deploy & Optimize | ⏳ Pending |

## Key Features (Phase 6)
- POS with size-based pricing tiles (10ml-100ml, DA pricing)
- Sales History page with filters (date, search, expandable details)
- Telegram notifications on sale (async, non-blocking)
- Role-based access: Manager (full) vs Seller (POS/Products/History only)
- Loyalty system with tiers (New/Silver/Gold/Platinum)

## Login Credentials
- Manager: demo@perfumierpro.com / demo@123
- Seller: seller@perfumierpro.com / seller@123
- Admin: visit /admin directly (no login needed)

## File Structure
```
src/
├── App.jsx              ← Router + DashboardLayout + role filtering
├── pages/
│   ├── POSPage.jsx      ← Size-based POS (8 perfumes, size tiles)
│   ├── SalesHistoryPage.jsx ← Historique des Ventes
│   ├── LoginPage.jsx
│   ├── AdminPanel.jsx   ← License key generator (bypasses auth)
│   └── [other pages]
├── services/
│   ├── telegramService.js    ← Telegram bot notification
│   ├── salesHistoryService.js ← localStorage sales persistence
│   ├── loyaltyService.js     ← Customer loyalty tiers
│   ├── ticketService.js      ← Receipt printer
│   └── [other services]
├── utils/
│   ├── licenseGenerator.js   ← Developer-only license gen
│   ├── licenseValidator.js   ← Client-side license check
│   └── pcIdentifier.js       ← Browser fingerprint
├── api/
│   ├── auth.js               ← Mock users + login logic
│   └── sales.js              ← Sales API client (unused, localStorage used)
└── components/
    ├── LicenseScreen.jsx
    ├── AdminLicenseGenerator.jsx
    └── [other components]
```

## Known Issues
- Automated browser testing (CDP) can't trigger React synthetic events on button clicks
- Products page still uses old data model (needs update for size-based pricing)
- No backend server deployed — all data is localStorage only

## Important Patterns
- Admin route (/admin) bypasses both license check AND login
- License codes are base64 encoded: PC_ID|EXPIRY_TIMESTAMP|CHECKSUM
- Telegram service silently fails — never blocks checkout
- Sales are saved to localStorage array, newest first
