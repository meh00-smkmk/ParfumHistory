# License System Testing Checklist

## ✅ What to Test

### 1. Customer License Screen
- [ ] Open app without license
- [ ] See License Screen
- [ ] PC Identifier visible and copyable
- [ ] Can copy PC ID with button
- [ ] Input box for license code
- [ ] Clear instructions visible
- [ ] NO code generation button shown

### 2. Generate License (Admin Panel)
- [ ] Go to: http://localhost:5179/admin
- [ ] See Admin License Generator
- [ ] Single License mode available
- [ ] Batch mode available
- [ ] Can enter PC ID
- [ ] Can set expiry days
- [ ] Generate button works
- [ ] License code generated
- [ ] Can copy code

### 3. License Validation
- [ ] Take generated code
- [ ] Go to License Screen
- [ ] Paste code
- [ ] Click "Activate License"
- [ ] Should see: "✅ License valid"
- [ ] App should unlock
- [ ] Should show dashboard

### 4. PC Binding
- [ ] Generate license for PC-A: `testpc123456789abcdefghijklmnopqr`
- [ ] Try to validate on different PC: `otherpc987654321zyxwvutsrqponmlk`
- [ ] Should show: "License is tied to different PC"
- [ ] This is correct behavior (not a bug)

### 5. Checksum Validation
- [ ] Generate license: `YTFiMmMzZDRlNWY2ZzdoOGk5ajBrMWwybTNuNG81cDZ8MTgwNjg2MzM5NTY4N3wwY2Zj`
- [ ] Modify one character: `YTFiMmMzZDRlNWY2ZzdoOGk5ajBrMWwybTNuNG81cDZ8MTgwNjg2MzM5NTY4N3wxY2Zj` (changed 0c to 1c)
- [ ] Try to validate modified code
- [ ] Should show: "License code is corrupted"
- [ ] This is correct behavior (tampering detected)

### 6. Expiry Validation
- [ ] Generate license with 0 days expiry (today)
- [ ] Try to validate immediately
- [ ] Should work (not expired yet)
- [ ] Wait... (in real testing, set to past date)
- [ ] Should show: "License expired"

### 7. Base64 Encoding
- [ ] Look at generated license code
- [ ] Should be base64 encoded (alphanumeric + / + =)
- [ ] Should NOT contain special characters from checksum (only hex)
- [ ] Should be copyable without issues
- [ ] Should decode correctly

### 8. Browser Compatibility
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] All should work (using btoa/atob, not Buffer)

### 9. UI/UX
- [ ] License Screen looks professional
- [ ] Clear instructions for customers
- [ ] Admin panel looks professional
- [ ] Easy to copy/paste codes
- [ ] Error messages are helpful
- [ ] Success messages are clear

### 10. Edge Cases
- [ ] Empty PC ID: Should show error
- [ ] Empty license code: Should show error
- [ ] Whitespace in license code: Should handle
- [ ] Very long PC ID: Should work
- [ ] Multiple copies of same license: Should work

---

## 🧪 Manual Testing Script

### Test 1: Single License Generation & Validation

```bash
# 1. Open admin panel
Visit: http://localhost:5179/admin

# 2. Generate license
PC Identifier: test1234567890abcdefghijklmnopqrst
Expiry Days: 365
Click: 🔑 Generate License

# Expected output:
# YTFpMmMzZDRlNWY2ZzdoOGk5ajBrMWwybTNuNG81cDZ8MTgwNjg2MzM5NTY4N3wwY2Zj

# 3. Copy code and clear localStorage
localStorage.clear()

# 4. Reload app
# You should see License Screen

# 5. Paste code and validate
Paste code → Click "✓ Activate License"

# Expected result:
# ✅ License valid. Expires in 365 days.
# App unlocks → Shows dashboard
```

### Test 2: PC Binding

```bash
# Generate for PC-A
Admin panel → Generate for: test1234567890abcdefghijklmnopqrst
Copy code

# Simulate different PC
Open DevTools Console
localStorage.setItem('_pc_id', 'different9876543210zyxwvutsrqponml')

# Try to validate
Paste code → Click activate

# Expected result:
# ❌ License is tied to different PC. This PC: different... Licensed PC: test...
```

### Test 3: Checksum Tampering

```bash
# Generate code
Admin panel → Generate license
Get code: YTFiMmMzZDRlNWY2ZzdoOGk5ajBrMWwybTNuNG81cDZ8MTgwNjg2MzM5NTY4N3wwY2Zj

# Modify in DevTools Console
const tampered = "YTFiMmMzZDRlNWY2ZzdoOGk5ajBrMWwybTNuNG81cDZ8MTgwNjg2MzM5NTY4N3gxY2Zj"
// Changed last 0cfc to 1cfc

# Try to validate
localStorage.clear()
Paste tampered code → Click activate

# Expected result:
# ❌ License code is corrupted or invalid.
```

---

## 📝 Bug Report Template

If something doesn't work:

```
Title: [ISSUE TYPE]
Environment: [Browser], [OS], [Version]

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
...

Actual Result:
...

Error Message:
(paste from console if any)

Screenshots:
(attach if possible)
```

---

## ✅ Success Criteria

All of the following must be true:

1. ✅ Customer sees simple, clean License Screen
2. ✅ No code generation button visible to customer
3. ✅ Developer can generate codes at `/admin`
4. ✅ Generated codes work when pasted
5. ✅ Validation rejects wrong PC
6. ✅ Validation detects tampering
7. ✅ Expiry dates are enforced
8. ✅ Works on all browsers
9. ✅ No console errors
10. ✅ Professional UI/UX

---

**Status**: Ready for testing ✅  
**Test Date**: [Fill in when testing]  
**Tested By**: [Your name]  
**Results**: [Pass/Fail + notes]
