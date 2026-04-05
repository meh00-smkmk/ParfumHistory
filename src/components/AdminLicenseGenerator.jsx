/**
 * Admin License Generator Panel
 * DEVELOPER ONLY - Hidden from regular users
 * 
 * This page allows the app maker to generate license codes
 * Access: Only with developer password
 */

import React, { useState } from 'react';
import { generateLicenseForCustomer, generateLicensesBatch } from '@/utils/licenseGenerator';

export const AdminLicenseGenerator = () => {
  const [pcIdInput, setPcIdInput] = useState('');
  const [expiryDays, setExpiryDays] = useState(365);
  const [generatedCode, setGeneratedCode] = useState('');
  const [message, setMessage] = useState('');
  const [batchMode, setBatchMode] = useState(false);
  const [batchPCIds, setBatchPCIds] = useState('');
  const [batchResults, setBatchResults] = useState({});

  const handleGenerateSingle = () => {
    if (!pcIdInput.trim()) {
      setMessage('❌ Please enter a PC ID');
      return;
    }

    try {
      const code = generateLicenseForCustomer(pcIdInput.trim(), expiryDays);
      if (code) {
        setGeneratedCode(code);
        setMessage('✅ License generated successfully!');
      } else {
        setMessage('❌ Error generating license');
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleGenerateBatch = () => {
    if (!batchPCIds.trim()) {
      setMessage('❌ Please enter PC IDs (one per line)');
      return;
    }

    const pcIds = batchPCIds
      .split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (pcIds.length === 0) {
      setMessage('❌ No valid PC IDs found');
      return;
    }

    try {
      const results = generateLicensesBatch(pcIds, expiryDays);
      setBatchResults(results);
      setMessage(`✅ Generated ${Object.keys(results).length} licenses!`);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('✅ Copied to clipboard!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔑 Admin License Generator</h1>
        <p style={styles.subtitle}>Generate license codes for customers (DEVELOPER ONLY)</p>
      </div>

      {/* Mode Selector */}
      <div style={styles.modeSelector}>
        <button
          onClick={() => {
            setBatchMode(false);
            setGeneratedCode('');
            setBatchResults({});
            setMessage('');
          }}
          style={{
            ...styles.modeButton,
            ...(batchMode ? {} : styles.modeButtonActive)
          }}
        >
          📝 Single License
        </button>
        <button
          onClick={() => {
            setBatchMode(true);
            setGeneratedCode('');
            setBatchResults({});
            setMessage('');
          }}
          style={{
            ...styles.modeButton,
            ...(batchMode ? styles.modeButtonActive : {})
          }}
        >
          📦 Batch Generate
        </button>
      </div>

      {/* Single Mode */}
      {!batchMode && (
        <div style={styles.section}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Customer PC Identifier</label>
            <input
              type="text"
              value={pcIdInput}
              onChange={(e) => setPcIdInput(e.target.value)}
              placeholder="e.g., a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
              style={styles.input}
            />
            <small style={styles.hint}>Customer provides this from the License Screen</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>License Validity (Days)</label>
            <input
              type="number"
              value={expiryDays}
              onChange={(e) => setExpiryDays(Math.max(1, parseInt(e.target.value) || 365))}
              min="1"
              max="36500"
              style={styles.input}
            />
            <small style={styles.hint}>How long the license is valid (1 year = 365 days)</small>
          </div>

          <button onClick={handleGenerateSingle} style={styles.generateBtn}>
            🔑 Generate License
          </button>

          {generatedCode && (
            <div style={styles.codeBox}>
              <h3 style={styles.codeTitle}>✅ Generated License Code</h3>
              <div style={styles.codeContainer}>
                <code style={styles.code}>{generatedCode}</code>
                <button
                  onClick={() => copyToClipboard(generatedCode)}
                  style={styles.copyBtn}
                >
                  📋 Copy
                </button>
              </div>
              <p style={styles.codeHint}>
                📧 Send this code to the customer via secure email. They paste it into the License Screen.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Batch Mode */}
      {batchMode && (
        <div style={styles.section}>
          <div style={styles.formGroup}>
            <label style={styles.label}>PC IDs (one per line)</label>
            <textarea
              value={batchPCIds}
              onChange={(e) => setBatchPCIds(e.target.value)}
              placeholder="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6&#10;b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6&#10;..."
              style={styles.textarea}
              rows="6"
            />
            <small style={styles.hint}>Paste one PC ID per line</small>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>License Validity (Days)</label>
            <input
              type="number"
              value={expiryDays}
              onChange={(e) => setExpiryDays(Math.max(1, parseInt(e.target.value) || 365))}
              min="1"
              max="36500"
              style={styles.input}
            />
          </div>

          <button onClick={handleGenerateBatch} style={styles.generateBtn}>
            📦 Generate Batch
          </button>

          {Object.keys(batchResults).length > 0 && (
            <div style={styles.batchResults}>
              <h3 style={styles.resultsTitle}>✅ Batch Results</h3>
              <div style={styles.batchTable}>
                {Object.entries(batchResults).map(([pcId, code]) => (
                  <div key={pcId} style={styles.batchRow}>
                    <div style={styles.batchPCId}>{pcId.substring(0, 12)}...</div>
                    <div style={styles.batchCode}>
                      <code style={styles.batchCodeText}>{code}</code>
                      <button
                        onClick={() => copyToClipboard(code)}
                        style={styles.smallCopyBtn}
                      >
                        📋
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p style={styles.codeHint}>
                💾 All codes generated. Send each code to the corresponding customer.
              </p>
            </div>
          )}
        </div>
      )}

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

      {/* Info */}
      <div style={styles.infoBox}>
        <h3 style={styles.infoTitle}>ℹ️ How It Works</h3>
        <ol style={styles.infoList}>
          <li>Customer opens PerfumierPro without a license</li>
          <li>They see the License Screen with their PC Identifier</li>
          <li>They send you their PC ID</li>
          <li>You generate a license code here</li>
          <li>You send them the code via secure email</li>
          <li>They paste the code into the License Screen</li>
          <li>The app validates and unlocks</li>
        </ol>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'var(--color-background)',
    minHeight: '100vh'
  },
  header: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid var(--color-accent)'
  },
  title: {
    color: 'var(--color-accent)',
    margin: '0 0 10px 0',
    fontSize: '28px'
  },
  subtitle: {
    color: 'var(--color-text-secondary)',
    margin: 0,
    fontSize: '14px'
  },
  modeSelector: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  modeButton: {
    flex: 1,
    padding: '12px',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-background-secondary)',
    color: 'var(--color-text)',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  modeButtonActive: {
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    borderColor: 'var(--color-accent)'
  },
  section: {
    backgroundColor: 'var(--color-background-secondary)',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid var(--color-border)',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: 'var(--color-accent)',
    fontWeight: '600',
    marginBottom: '8px',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    fontSize: '13px',
    fontFamily: 'monospace',
    boxSizing: 'border-box',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text)',
    fontSize: '12px',
    fontFamily: 'monospace',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical'
  },
  hint: {
    display: 'block',
    color: 'var(--color-text-secondary)',
    fontSize: '12px',
    marginTop: '4px'
  },
  generateBtn: {
    width: '100%',
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
  codeBox: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'var(--color-background)',
    borderRadius: '6px',
    border: '2px solid var(--color-accent)'
  },
  codeTitle: {
    color: 'var(--color-accent)',
    margin: '0 0 10px 0',
    fontSize: '14px'
  },
  codeContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start'
  },
  code: {
    flex: 1,
    padding: '10px',
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: '4px',
    fontSize: '12px',
    color: 'var(--color-text)',
    wordBreak: 'break-all',
    fontFamily: 'monospace'
  },
  copyBtn: {
    padding: '10px 15px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  codeHint: {
    marginTop: '10px',
    color: 'var(--color-text-secondary)',
    fontSize: '12px',
    margin: '10px 0 0 0'
  },
  batchResults: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: 'var(--color-background)',
    borderRadius: '6px',
    border: '2px solid var(--color-accent)'
  },
  resultsTitle: {
    color: 'var(--color-accent)',
    margin: '0 0 15px 0',
    fontSize: '14px'
  },
  batchTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  batchRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'var(--color-background-secondary)',
    borderRadius: '4px',
    border: '1px solid var(--color-border)'
  },
  batchPCId: {
    minWidth: '150px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: 'var(--color-text-secondary)'
  },
  batchCode: {
    flex: 1,
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  batchCodeText: {
    fontSize: '11px',
    fontFamily: 'monospace',
    color: 'var(--color-text)',
    wordBreak: 'break-all'
  },
  smallCopyBtn: {
    padding: '6px 10px',
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '11px'
  },
  message: {
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid'
  },
  infoBox: {
    backgroundColor: 'rgba(100, 150, 200, 0.08)',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(100, 150, 200, 0.3)'
  },
  infoTitle: {
    color: 'var(--color-accent)',
    margin: '0 0 10px 0',
    fontSize: '14px'
  },
  infoList: {
    color: 'var(--color-text)',
    fontSize: '13px',
    lineHeight: '1.6',
    margin: 0,
    paddingLeft: '20px'
  }
};

export default AdminLicenseGenerator;
