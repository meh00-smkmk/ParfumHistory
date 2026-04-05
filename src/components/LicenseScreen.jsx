/**
 * License Screen Component
 * Entry UI for license code validation
 * Customers paste license codes from the app maker only
 */

import React, { useState, useEffect } from 'react';
import { getPCIdentifier, getPCIdentifierInfo } from '@/utils/pcIdentifier';
import { saveLicense } from '@/utils/licenseValidator';

export const LicenseScreen = ({ onLicenseValid }) => {
  const [licenseCode, setLicenseCode] = useState('');
  const [pcInfo, setPcInfo] = useState(null);
  const [message, setMessage] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setPcInfo(getPCIdentifierInfo());
  }, []);

  const handleSubmitLicense = () => {
    if (!licenseCode.trim()) {
      setMessage('❌ Please enter a license code');
      return;
    }

    setIsValidating(true);
    setMessage('');

    // Simulate validation delay
    setTimeout(() => {
      const result = saveLicense(licenseCode);

      if (result.valid) {
        setMessage(`✅ ${result.details.message}`);
        setTimeout(() => {
          onLicenseValid();
        }, 1000);
      } else {
        setMessage(`❌ ${result.error}`);
      }

      setIsValidating(false);
    }, 500);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🔐 License Activation</h1>
          <p style={styles.subtitle}>PerfumierPro is licensed per PC</p>
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          {/* PC Info */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Your PC Identifier</h3>
            {pcInfo ? (
              <div style={styles.pcInfo}>
                <p style={styles.pcInfoRow}>
                  <code style={styles.code}>{pcInfo.identifier}</code>
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pcInfo.identifier);
                    setMessage('✅ PC Identifier copied to clipboard!');
                  }}
                  style={styles.copyButton}
                >
                  📋 Copy Identifier
                </button>
              </div>
            ) : (
              <p style={styles.loading}>Loading PC info...</p>
            )}
          </div>

          {/* License Input */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Enter License Code</h3>
            <textarea
              value={licenseCode}
              onChange={(e) => setLicenseCode(e.target.value)}
              placeholder="Paste your license code here..."
              style={styles.licenseInput}
              rows="4"
              disabled={isValidating}
            />
            <small style={styles.hint}>You received this code from the app maker</small>
          </div>

          {/* Messages */}
          {message && (
            <div
              style={{
                ...styles.message,
                backgroundColor: message.includes('✅')
                  ? 'rgba(39, 174, 96, 0.15)'
                  : 'rgba(231, 76, 60, 0.15)',
                color: message.includes('✅') ? '#27ae60' : '#e74c3c'
              }}
            >
              {message}
            </div>
          )}

          {/* Button */}
          <div style={styles.buttons}>
            <button
              onClick={handleSubmitLicense}
              style={styles.activateBtn}
              disabled={isValidating || !licenseCode.trim()}
            >
              {isValidating ? '⏳ Activating...' : '✓ Activate License'}
            </button>
          </div>

          {/* Instructions */}
          <div style={styles.divider} />

          <div style={styles.instructionsBox}>
            <h3 style={styles.sectionTitle}>📝 Steps to Activate</h3>
            <ol style={styles.stepList}>
              <li>
                Copy your <strong>PC Identifier</strong> (above)
              </li>
              <li>
                Send it to the app maker
              </li>
              <li>
                They will generate a license code for you
              </li>
              <li>
                Paste the code in the box above
              </li>
              <li>
                Click "Activate License"
              </li>
            </ol>
          </div>

          {/* Contact */}
          <div style={styles.contactBox}>
            <h3 style={styles.sectionTitle}>❓ Need Help?</h3>
            <p style={styles.contactText}>
              Contact the app maker to request your license code.
            </p>
            <p style={styles.contactText}>
              Provide them with your PC Identifier (shown above) and they will generate a code for you.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            🔒 <strong>License is tied to this PC.</strong>
            <br />
            <small>If you reinstall the OS or move to another PC, you'll need a new license.</small>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  container: {
    backgroundColor: 'var(--color-background)',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '2px solid var(--color-accent)'
  },
  header: {
    padding: '30px 20px',
    borderBottom: '2px solid var(--color-accent)',
    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)'
  },
  title: {
    color: 'var(--color-accent)',
    margin: '0 0 10px 0',
    fontSize: '28px',
    fontWeight: '700'
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    margin: 0,
    fontSize: '14px'
  },
  content: {
    padding: '20px'
  },
  section: {
    marginBottom: '20px'
  },
  sectionTitle: {
    color: 'var(--color-accent)',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: 0,
    marginBottom: '10px'
  },
  pcInfo: {
    backgroundColor: 'var(--color-background-secondary)',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)'
  },
  pcInfoRow: {
    margin: '8px 0',
    color: 'var(--color-text)',
    fontSize: '13px'
  },
  code: {
    backgroundColor: 'var(--color-background)',
    padding: '8px 12px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '11px',
    color: 'var(--color-accent)',
    display: 'block',
    wordBreak: 'break-all',
    lineHeight: '1.4'
  },
  copyButton: {
    marginTop: '8px',
    padding: '8px 12px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    width: '100%'
  },
  loading: {
    color: 'var(--color-text-secondary)',
    fontStyle: 'italic'
  },
  licenseInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    backgroundColor: 'var(--color-background-secondary)',
    color: 'var(--color-text)',
    fontSize: '12px',
    fontFamily: 'monospace',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '8px'
  },
  hint: {
    display: 'block',
    color: 'var(--color-text-secondary)',
    fontSize: '12px'
  },
  message: {
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '15px',
    fontSize: '14px',
    border: '1px solid'
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  activateBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '20px 0'
  },
  instructionsBox: {
    padding: '15px',
    backgroundColor: 'rgba(100, 150, 200, 0.08)',
    border: '1px solid rgba(100, 150, 200, 0.3)',
    borderRadius: '6px',
    marginBottom: '15px'
  },
  stepList: {
    color: 'var(--color-text)',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0 0 0 20px',
    padding: 0
  },
  contactBox: {
    padding: '15px',
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    borderRadius: '6px'
  },
  contactText: {
    color: 'var(--color-text-secondary)',
    fontSize: '13px',
    margin: '8px 0',
    lineHeight: '1.4'
  },
  footer: {
    padding: '15px 20px',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  footerText: {
    color: 'var(--color-text-secondary)',
    fontSize: '12px',
    margin: '8px 0',
    lineHeight: '1.4'
  }
};
