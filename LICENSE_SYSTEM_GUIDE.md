# PerfumierPro License System Guide

## Overview

The license system is designed to **protect the app creator's intellectual property** by tying each installation to a specific PC. Only the app maker can generate licenses.

---

## How It Works

### 1. **App Startup**
- User starts the app
- License Screen appears
- User sees their **PC Identifier** (unique hardware fingerprint)

### 2. **User Gets License**
- User contacts the app maker/developer
- User provides their PC Identifier
- Developer generates a license code (see "Developer Instructions" below)
- Developer sends license code via email

### 3. **User Enters License**
- User pastes the license code into the License Screen
- App validates the code
- If valid, app unlocks and user can log in

### 4. **App Locked to PC**
- License only works on that specific PC
- If user tries to use code on different PC, it fails
- Prevents unauthorized sharing/piracy

---

## For App Maker/Developer

### Installation

The license generator is in: `src/utils/licenseGenerator.js`

```javascript
import { generateLicenseForCustomer } from '@/utils/licenseGenerator';

// Customer provides their PC ID from License Screen
const customerPCId = "a1b2c3d4e5f6g7h8i9j0";

// Generate 1-year license
const licenseCode = generateLicenseForCustomer(customerPCId, 365);

// Send to customer: licenseCode
```

### Step-by-Step Process

1. **Customer sends you their PC Identifier**
   - Customer opens the app
   - License Screen shows: "This PC Identifier: [a1b2c3d4...]"
   - Customer copies and sends to you (or uses contact form)

2. **You generate license code**
   ```javascript
   const customerPCId = "abc123def456..."; // from customer
   const code = generateLicenseForCustomer(customerPCId, 365); // 1 year
   // Result: "YWJjMTIzZGVmNDU2Ny4uLnwxNzQ3NDIzNDU2Nzg5fGY3ZjE="
   ```

3. **Send code to customer**
   - Via secure email
   - Via support ticket
   - Via your customer portal

4. **Customer activates**
   - Customer pastes code into License Screen
   - Code validates ✓
   - App unlocks

---

## License Format (Internal)

License codes are **Base64 encoded** for easy copying/pasting.

**Decoded format:**
```
PC_IDENTIFIER|EXPIRY_TIMESTAMP|CHECKSUM
```

**Example (decoded):**
```
a1b2c3d4e5f6g7h8i9j0|1747423456789|f7f1
```

- **PC_IDENTIFIER**: The unique PC fingerprint
- **EXPIRY_TIMESTAMP**: Unix timestamp when license expires
- **CHECKSUM**: Prevents tampering

---

## Backend Integration (Future)

For production, create a **secure backend endpoint**:

```
POST /api/admin/generate-license
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "pc_identifier": "a1b2c3d4e5f6...",
  "expiry_days": 365,
  "customer_email": "customer@example.com"
}

Response:
{
  "success": true,
  "license_code": "YWJjMTIzZGVmNDU2Ny4uLnwxNzQ3NDIzNDU2Nzg5fGY3ZjE=",
  "expires_at": "2025-04-04T00:00:00Z"
}
```

Features:
- ✓ Admin authentication required
- ✓ Logs all generated licenses
- ✓ Rate limited
- ✓ Email confirmation to customer
- ✓ License management dashboard

---

## Security Considerations

### ✓ What's Protected

1. **PC Binding**: License only works on the PC that generated it
2. **Expiry**: Licenses can expire
3. **Checksum**: Prevents tampering
4. **Developer Control**: Only you can generate licenses

### ⚠️ Limitations (Browser-Based)

The current system uses browser storage. In production:

1. **Move to backend**: Generate licenses server-side only
2. **Secure storage**: Don't store license in localStorage
3. **Token validation**: Validate license on each session
4. **Anti-tampering**: Sign licenses with private key

---

## Common Questions

### Q: Can users share license codes?
**A:** No. Each license is tied to a specific PC. Code from PC A won't work on PC B.

### Q: Can I generate licenses?
**A:** Only if you're the app maker. The `licenseGenerator.js` tool is for developers only.

### Q: What if customer gets new PC?
**A:** They need a new license code for their new PC. They provide the new PC's identifier.

### Q: How long do licenses last?
**A:** You decide when generating. Default is 365 days.

### Q: Can licenses be extended?
**A:** Yes. Generate a new license and send to customer.

### Q: What if license expires?
**A:** App shows "License expired" message. User needs new license.

---

## Troubleshooting

### License code not working

1. **Wrong PC?** License must be for this specific PC
   - Check PC Identifier on License Screen
   - Ensure it matches the one you generated for

2. **Expired?** Check expiry date
   - Generate new license if needed

3. **Corrupted?** Try copying/pasting again
   - Make sure full code is pasted
   - No extra spaces

4. **Still not working?** Debug in console
   ```javascript
   import { validateLicense } from '@/utils/licenseValidator';
   const result = validateLicense("paste_code_here");
   console.log(result);
   ```

---

## Best Practices

### For Developers

1. ✓ Keep `licenseGenerator.js` secret (developer only)
2. ✓ Generate licenses server-side in production
3. ✓ Log all generated licenses for audit
4. ✓ Set reasonable expiry dates (365 days is standard)
5. ✓ Provide customer support for license issues

### For Customers

1. ✓ Keep your PC Identifier confidential
2. ✓ Don't share license codes
3. ✓ Request new license for different PC
4. ✓ Contact support if license issues

---

## Files Reference

| File | Purpose | Who Can Access |
|------|---------|-----------------|
| `src/utils/licenseGenerator.js` | Generate codes (DEV ONLY) | App Maker Only |
| `src/utils/licenseValidator.js` | Validate codes | Both |
| `src/components/LicenseScreen.jsx` | Entry UI | All Users |
| `src/utils/pcIdentifier.js` | Generate PC fingerprint | All Users |

---

## Contact

For license issues or integration questions:
- 📧 Email: support@perfumierpro.com
- 🔗 Website: https://perfumierpro.com
- 💬 Support: [Your support portal]

---

**Last Updated:** 2026-04-04  
**Version:** 1.0.0  
**Status:** Production Ready
