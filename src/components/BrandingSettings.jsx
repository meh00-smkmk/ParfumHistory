/**
 * Branding Settings Component
 * Manage shop logo, name, phone, address
 */

import React, { useState, useEffect } from 'react';

export const BrandingSettings = () => {
  const [shopName, setShopName] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopLogo, setShopLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const saved = {
      name: localStorage.getItem('shopName') || '',
      phone: localStorage.getItem('shopPhone') || '',
      address: localStorage.getItem('shopAddress') || '',
      logo: localStorage.getItem('shopLogo') || null
    };
    
    setShopName(saved.name);
    setShopPhone(saved.phone);
    setShopAddress(saved.address);
    setShopLogo(saved.logo);
    setLogoPreview(saved.logo);
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ File too large. Maximum 5MB.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Please upload an image file (JPG, PNG, GIF, etc.)');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setShopLogo(base64);
      setLogoPreview(base64);
      setMessage('✓ Logo selected');
      setTimeout(() => setMessage(''), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setShopLogo(null);
    setLogoPreview(null);
    setMessage('Logo removed');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSave = () => {
    // Validate
    if (!shopName.trim()) {
      setMessage('❌ Shop name is required');
      return;
    }

    if (!shopPhone.trim()) {
      setMessage('❌ Shop phone is required');
      return;
    }

    if (!shopAddress.trim()) {
      setMessage('❌ Shop address is required');
      return;
    }

    setIsSaving(true);

    // Save to localStorage
    localStorage.setItem('shopName', shopName.trim());
    localStorage.setItem('shopPhone', shopPhone.trim());
    localStorage.setItem('shopAddress', shopAddress.trim());
    if (shopLogo) {
      localStorage.setItem('shopLogo', shopLogo);
    }

    setTimeout(() => {
      setIsSaving(false);
      setMessage('✓ Branding settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 500);
  };

  const handleReset = () => {
    if (window.confirm('Reset to default branding?')) {
      setShopName('PerfumierPro');
      setShopPhone('');
      setShopAddress('');
      setShopLogo(null);
      setLogoPreview(null);
      localStorage.removeItem('shopName');
      localStorage.removeItem('shopPhone');
      localStorage.removeItem('shopAddress');
      localStorage.removeItem('shopLogo');
      setMessage('✓ Reset to defaults');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🎨 Shop Branding</h3>

      {/* Logo Section */}
      <div style={styles.section}>
        <label style={styles.label}>📸 Shop Logo</label>
        <div style={styles.logoArea}>
          {logoPreview ? (
            <div style={styles.logoPreviewContainer}>
              <img src={logoPreview} alt="Shop Logo" style={styles.logoPreview} />
              <button
                onClick={handleRemoveLogo}
                style={styles.removeLogoBtn}
              >
                🗑️ Remove Logo
              </button>
            </div>
          ) : (
            <div style={styles.logoPlaceholder}>
              <p>📷 No logo uploaded</p>
              <small>Click "Choose Logo" to upload</small>
            </div>
          )}
        </div>
        <input
          type="file"
          id="logo-input"
          onChange={handleLogoChange}
          accept="image/*"
          style={styles.fileInput}
        />
        <label htmlFor="logo-input" style={styles.fileInputLabel}>
          📁 Choose Logo
        </label>
        <small style={styles.hint}>Max 5MB, PNG/JPG/GIF recommended</small>
      </div>

      {/* Shop Name */}
      <div style={styles.section}>
        <label style={styles.label}>🏪 Shop Name *</label>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="e.g., PerfumierPro Elite"
          style={styles.input}
        />
        <small style={styles.hint}>Used in tickets, header, receipts</small>
      </div>

      {/* Shop Phone */}
      <div style={styles.section}>
        <label style={styles.label}>📞 Shop Phone *</label>
        <input
          type="tel"
          value={shopPhone}
          onChange={(e) => setShopPhone(e.target.value)}
          placeholder="e.g., +213 555 123456"
          style={styles.input}
        />
        <small style={styles.hint}>Contact number for customers</small>
      </div>

      {/* Shop Address */}
      <div style={styles.section}>
        <label style={styles.label}>📍 Shop Address *</label>
        <textarea
          value={shopAddress}
          onChange={(e) => setShopAddress(e.target.value)}
          placeholder="e.g., 123 Perfume Street, Algiers, Algeria"
          style={styles.textarea}
          rows="3"
        />
        <small style={styles.hint}>Displayed on receipts and tickets</small>
      </div>

      {/* Preview */}
      <div style={styles.section}>
        <label style={styles.label}>👁️ Preview</label>
        <div style={styles.preview}>
          {logoPreview && (
            <img src={logoPreview} alt="Preview" style={styles.previewLogo} />
          )}
          <div style={styles.previewText}>
            <h4 style={styles.previewName}>{shopName || 'Shop Name'}</h4>
            <p style={styles.previewPhone}>{shopPhone || 'Phone'}</p>
            <p style={styles.previewAddress}>{shopAddress || 'Address'}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: message.includes('❌') 
            ? 'rgba(231, 76, 60, 0.1)' 
            : 'rgba(39, 174, 96, 0.1)',
          color: message.includes('❌') ? '#e74c3c' : '#27ae60'
        }}>
          {message}
        </div>
      )}

      {/* Buttons */}
      <div style={styles.buttons}>
        <button
          onClick={handleReset}
          style={styles.resetBtn}
        >
          ↺ Reset to Default
        </button>
        <button
          onClick={handleSave}
          style={{...styles.saveBtn, opacity: isSaving ? 0.6 : 1}}
          disabled={isSaving}
        >
          {isSaving ? '💾 Saving...' : '💾 Save Branding'}
        </button>
      </div>

      <div style={styles.info}>
        <strong>ℹ️ Note:</strong> Branding is displayed:
        <ul>
          <li>✓ Header/Logo area</li>
          <li>✓ Tickets and receipts</li>
          <li>✓ Dashboard pages</li>
          <li>✓ Print documents</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: '8px',
    maxWidth: '600px'
  },
  title: {
    color: 'var(--color-text)',
    marginBottom: '20px',
    fontSize: '18px',
    fontWeight: '600'
  },
  section: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: 'var(--color-text)',
    marginBottom: '8px',
    fontWeight: '600',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '4px'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    marginBottom: '4px'
  },
  hint: {
    display: 'block',
    color: 'var(--color-text-secondary)',
    fontSize: '12px',
    marginTop: '4px'
  },
  logoArea: {
    minHeight: '150px',
    border: '2px dashed var(--color-border)',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: '10px'
  },
  logoPlaceholder: {
    textAlign: 'center',
    color: 'var(--color-text-secondary)'
  },
  logoPreviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px'
  },
  logoPreview: {
    maxWidth: '120px',
    maxHeight: '120px',
    objectFit: 'contain',
    borderRadius: '6px'
  },
  fileInput: {
    display: 'none'
  },
  fileInputLabel: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '10px'
  },
  removeLogoBtn: {
    padding: '8px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  preview: {
    padding: '15px',
    backgroundColor: 'var(--color-background)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    display: 'flex',
    gap: '15px',
    alignItems: 'center'
  },
  previewLogo: {
    maxWidth: '80px',
    maxHeight: '80px',
    objectFit: 'contain'
  },
  previewText: {
    flex: 1
  },
  previewName: {
    margin: '0 0 5px 0',
    color: 'var(--color-accent)',
    fontSize: '14px',
    fontWeight: '600'
  },
  previewPhone: {
    margin: '3px 0',
    color: 'var(--color-text-secondary)',
    fontSize: '12px'
  },
  previewAddress: {
    margin: '3px 0',
    color: 'var(--color-text-secondary)',
    fontSize: '12px'
  },
  message: {
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '15px'
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  resetBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  info: {
    padding: '12px',
    backgroundColor: 'rgba(100, 150, 200, 0.1)',
    border: '1px solid rgba(100, 150, 200, 0.3)',
    borderRadius: '6px',
    fontSize: '12px',
    color: 'var(--color-text-secondary)'
  }
};
